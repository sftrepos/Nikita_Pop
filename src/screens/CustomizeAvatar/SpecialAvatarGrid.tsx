import React, { ReactElement } from 'react';
import { View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SPECIAL_AVATARS } from 'assets/vectors/pochies/parts/constants';
import { useTheme } from '@react-navigation/native';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SpecialAvatarGridProps {
  setSpecial: (special: SPECIAL_AVATARS) => void;
  avatars: typeof SPECIAL_AVATARS;
  selectedSpecial: SPECIAL_AVATARS;
  faceColor: string;
  rewards: any[];
  bubbleColor: string;
}

interface SpecialButtonProps {
  special: SPECIAL_AVATARS;
  onPress: (special: SPECIAL_AVATARS) => void;
  selectedSpecial: SPECIAL_AVATARS;
  faceColor: string;
  disabled?: boolean;
  bubbleColor: string;
}

const SpecialAvatarGrid = ({
  setSpecial,
  selectedSpecial,
  faceColor,
  rewards,
  bubbleColor,
}: SpecialAvatarGridProps): ReactElement => {
  return (
    <View style={styles.grid}>
      {Object.values(SPECIAL_AVATARS).map((special) => (
        <SpecialButton
          onPress={setSpecial}
          special={special}
          selectedSpecial={selectedSpecial}
          bubbleColor={bubbleColor}
          faceColor={faceColor}
          disabled={!rewards.find((r) => r.key == special)}
        />
      ))}
      <SpecialButton
        onPress={setSpecial}
        special={null}
        selectedSpecial={selectedSpecial}
        bubbleColor={bubbleColor}
        faceColor={faceColor}
      />
    </View>
  );
};

const SpecialButton = ({
  special,
  onPress,
  selectedSpecial,
  faceColor,
  disabled,
  bubbleColor,
}: SpecialButtonProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const handleOnPress = () => onPress(special);
  return (
    <View
      style={[
        styles.SpecialButtonContainer,
        { backgroundColor: colors.border },
      ]}>
      <TouchableOpacity onPress={handleOnPress} disabled={disabled}>
        <View
          style={[
            styles.SpecialButton,
            selectedSpecial === special ? styles.selected : null,
          ]}>
          {disabled && (
            <Icon
              style={styles.lockIcon}
              name="lock"
              color={EStyleSheet.value('$grey2')}
            />
          )}
          <CustomAvatar
            scale={0.5}
            special={special}
            faceColor={faceColor}
            bubbleColor={bubbleColor}
            faceType="1"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = EStyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  SpecialButtonContainer: {
    marginTop: '2.5rem',
    marginHorizontal: '.5rem',
    borderRadius: 75,
  },
  SpecialButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.62,
    backgroundColor: 'white',
    elevation: 4,
  },
  selected: {
    borderWidth: '0.25rem',
    borderColor: 'black',
  },
  lockIcon: {
    position: 'absolute',
    zIndex: 99,
    fontSize: 84,
    opacity: 0.7,
  },
});

export default SpecialAvatarGrid;
