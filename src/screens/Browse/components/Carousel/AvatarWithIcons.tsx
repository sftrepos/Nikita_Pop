import React, { ReactElement, useState } from 'react';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import { useTheme } from '@react-navigation/native';
import Avatar, { AvatarProps, AvatarWrapper } from 'components/Avatar';
import IconButton from 'components/Buttons/IconButton';
import VaccineInfoModal from 'components/Modals/VaccineInfoModal';

const styles = EStyleSheet.create({
  _measurements: {
    rem_1: '1rem',
    rem_15: '1.5rem',
  },
  container: {
    height: '100%',
    // overflow: 'hidden',
  },
  avatar: {
    flex: 1,
    marginTop: '-1.0 * 5rem',
  },
  header: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    paddingHorizontal: '1rem',
    marginVertical: '.5rem',
    height: '4rem',
  },
  iconButton: {
    flex: 1,
    // alignSelf: 'center',
  },
  icon: {
    alignSelf: 'flex-end',
  },
});

interface IAvatarWithIcons {
  avatar: CustomAvatarProps;
  username: string;
  meta: any;
  onPress?: () => void;
}

const AvatarWithIcons = ({
  avatar,
  username,
  onPress,
  meta,
}: IAvatarWithIcons): ReactElement => {
  const [showVaccineModal, setShowVaccineModal] = useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const isVaccinated = meta?.isVaccinated || false;

  const renderVaccineBadge = () => {
    if (!isVaccinated) {
      return <View style={{ flex: 1 }} />;
    } else {
      return (
        <>
          <IconButton
            size={styles._measurements.rem_15}
            iconColor={colors.grapesicle}
            iconBackgroundColor={'transparent'}
            onPress={() => setShowVaccineModal(true)}
            iconName={'shield-check'}
            containerStyle={styles.iconButton}
            style={styles.icon}
          />
          <VaccineInfoModal
            username={username}
            onClose={() => setShowVaccineModal(false)}
            isVisible={showVaccineModal}
          />
        </>
      );
    }
  };

  const screenHeight = Dimensions.get('screen').height;
  const AVATAR_SCALE =
    screenHeight < 700
      ? styles._measurements.rem_1 * 0.045
      : styles._measurements.rem_1 * 0.05;

  const avatarProps: AvatarProps = {
    avatar: avatar,
    onPress: onPress,
    theme: theme,
    scale: AVATAR_SCALE,
    containerStyle: styles.avatar,
  };

  return (
    <AvatarWrapper
      containerStyle={styles.header}
      avatarProps={avatarProps}
      leftChild={<View style={{ flex: 1 }} />}
      rightChild={renderVaccineBadge()}
    />
  );
};

export default AvatarWithIcons;
