import React, { useState, useEffect, ReactElement } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import ColorGrid from './ColorGrid';
import {
  faceColors,
  bubbleColors,
  FACE_TYPES,
  SPECIAL_AVATARS,
} from 'assets/vectors/pochies/parts/constants';
import FaceGrid from './FaceGrid';
import { useTheme } from '@react-navigation/native';
import { updateProfile } from 'features/User/UserActions';
import SpecialAvatarGrid from './SpecialAvatarGrid';
import { RootReducer } from 'store/rootReducer';

const menuOptions = ['color', 'face', 'bubble', 'special'];

const CustomizeAvatarScreen = (): ReactElement => {
  const [avatar, setAvatar] = useState(
    useSelector((state: RootReducer) => state.user.localUser.avatar),
  );
  const [menuState, setMenuState] = useState(menuOptions[0]);
  const { rewards } = useSelector((state) => state.user.localUser.rewardList);
  const dispatch = useDispatch();

  const saveAvatar = () => {
    dispatch(updateProfile({ avatar }));
  };

  const setColor = (color: string) =>
    setAvatar((avatar) => ({
      ...avatar,
      faceColor: color,
    }));
  const setBubbleColor = (color: string) =>
    setAvatar((avatar) => ({
      ...avatar,
      bubbleColor: color,
    }));
  const setFace = (faceType: string) =>
    setAvatar((avatar) => ({
      ...avatar,
      faceType,
    }));

  const setSpecial = (special: SPECIAL_AVATARS) =>
    setAvatar((avatar) => ({
      ...avatar,
      special,
    }));

  useEffect(() => {
    (async () => {
      await getAvatar();
    })();
  }, []);

  useEffect(() => {
    saveAvatar();
  }, [avatar]);
  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View style={styles.screen}>
        <View style={styles.avatarTopContainer}>
          {avatar ? (
            <CustomAvatar
              faceType={avatar.faceType}
              faceColor={avatar.faceColor}
              bubbleColor={avatar.bubbleColor}
              hat={avatar.hat}
              customAvatarContainerStyle={styles.shadow}
              special={avatar.special}
            />
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.tabRow}>
            <TabButton
              label="Color"
              selected={menuState === menuOptions[0]}
              onPress={() => setMenuState(menuOptions[0])}
            />
            <TabButton
              label="Face"
              selected={menuState === menuOptions[1]}
              onPress={() => setMenuState(menuOptions[1])}
              disabled={!!avatar.special}
            />
            <TabButton
              label="Bubble"
              selected={menuState === menuOptions[2]}
              onPress={() => setMenuState(menuOptions[2])}
            />
            <TabButton
              label="Special"
              selected={menuState === menuOptions[3]}
              onPress={() => setMenuState(menuOptions[3])}
            />
          </View>

          <View style={styles.subMenuContainer}>
            <ScrollView
              style={styles.screen}
              contentContainerStyle={styles.container}>
              <Menu
                menu={menuState}
                setColor={setColor}
                setBubbleColor={setBubbleColor}
                setFace={setFace}
                faceColor={avatar?.faceColor}
                bubbleColor={avatar?.bubbleColor}
                selectedFace={avatar?.faceType}
                special={avatar.special}
                setSpecial={setSpecial}
                rewards={rewards}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface TabButtonProps {
  selected: boolean;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const TabButton = ({
  selected = false,
  label,
  onPress,
  disabled = false,
}: TabButtonProps) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.tabButton,
          selected && !disabled
            ? { ...styles.tabLabelSelected, borderColor: colors.primary }
            : null,
        ]}>
        <Text
          style={[styles.tabLabel, disabled ? styles.tabLabelDisabled : null]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface MenuProps {
  menu: string;
  setColor: (color: string) => void;
  setBubbleColor: (bubble: string) => void;
  setFace: (face: string) => void;
  faceColor: string;
  bubbleColor: string;
  selectedFace: string;
  special: SPECIAL_AVATARS;
  setSpecial: (special: SPECIAL_AVATARS) => void;
  rewards: any[];
}

const Menu = ({
  menu,
  setColor,
  setBubbleColor,
  setFace,
  faceColor,
  bubbleColor,
  selectedFace,
  special,
  setSpecial,
  rewards,
}: MenuProps) => {
  switch (menu) {
    case menuOptions[0]:
      return (
        <ColorGrid
          colors={faceColors}
          setColor={setColor}
          selectedColor={faceColor}
        />
      );
    case menuOptions[1]:
      return (
        <FaceGrid
          faces={FACE_TYPES}
          setFace={setFace}
          selectedFace={selectedFace}
        />
      );
    case menuOptions[2]:
      return (
        <ColorGrid
          colors={bubbleColors}
          setColor={setBubbleColor}
          selectedColor={bubbleColor}
        />
      );
    case menuOptions[3]:
      return (
        <SpecialAvatarGrid
          avatars={SPECIAL_AVATARS}
          selectedSpecial={special}
          faceColor={faceColor}
          setSpecial={setSpecial}
          rewards={rewards}
          bubbleColor={bubbleColor}
        />
      );
    default:
      return (
        <ColorGrid
          colors={faceColors}
          setColor={setColor}
          selectedColor={faceColor}
        />
      );
  }
};

const styles = EStylesheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'white',
    height: '100%',
  },
  container: {
    flexGrow: 1,
  },
  avatarTopContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '35%',
  },
  menuContainer: {
    flexGrow: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.62,
    elevation: 5,
    zIndex: 11,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  subMenuContainer: {
    height: '25rem',
  },
  tabRow: {
    flexDirection: 'row',
    paddingVertical: '1rem',
    paddingHorizontal: '1rem',
    borderBottomWidth: EStylesheet.hairlineWidth,
    justifyContent: 'center',
    borderColor: 'gray',
  },
  tabLabel: {
    fontSize: '1.25rem',
  },
  tabLabelSelected: {
    borderBottomWidth: 2,
  },
  tabLabelDisabled: {
    borderBottomWidth: 2,
    borderColor: '$grey4',
    color: '$grey4',
  },
  tabButton: {
    marginHorizontal: '1.5rem',
    paddingVertical: '0.25rem',
  },
  menuContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1rem',
    flexGrow: 1,

    borderWidth: 1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.62,
  },
});

export default CustomizeAvatarScreen;
