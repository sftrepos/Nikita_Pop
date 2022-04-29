import React, { useEffect, useState } from 'react';
import { View, Modal } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
// import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import ProfileCard from 'components/ProfileCard';
import useAnalytics from 'util/analytics/useAnalytics';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

interface IProfileModal {
  otherUser: any;
  onClose?: () => void;
}

const ProfileModal = ({ otherUser, onClose }: IProfileModal) => {
  const analytics = useAnalytics();
  const { colors } = useTheme();

  const Spinner = () => {
    return (
      <ActivityIndicator
        //   style={{ position: 'absolute', top: '50%' }}
        color={colors.primary}
      />
    );
  };

  return (
    <>
      {otherUser ? (
        <View>
          <ProfileCard
            style={{
              height: '100%',
              backgroundColor: colors.card,
              // borderRadius: 25,
            }}
            showBack
            otherUserId={otherUser}
            onBack={() => {
              onClose && onClose();
              analytics.logEvent(
                { name: 'CHATROOM PROFILE CLOSE', data: { userId: otherUser } },
                true,
              );
            }}
            {...otherUser}
            wide
            //   progress={chat?.progress}
          />
        </View>
      ) : (
        <Spinner />
      )}
    </>
  );
};

const styles = EStylesheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatar: {
    padding: '1rem',
  },
  username: {
    fontWeight: '600',
    fontSize: '$fontMd',
    marginLeft: '.25rem',
  },
});

export default ProfileModal;
