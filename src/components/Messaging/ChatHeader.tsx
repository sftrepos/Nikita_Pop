import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import EStylsheet from 'react-native-extended-stylesheet';
import { getId } from 'util/selectors';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import Modal from 'react-native-modal';
import ProfileCard from '../ProfileCard';
import useAnalytics from 'util/analytics/useAnalytics';

const ChatHeader = () => {
  const analytics = useAnalytics();
  const id = useSelector((state) => getId(state));
  const chat = useSelector((state) =>
    state.chats.chats.get(state.chats.currentRoom),
  );

  const [showCard, setShowCard] = useState<boolean>(false);

  const otherUser = chat?.userData[chat?.users.find((u) => id !== u)];
  const deviceWidth = Dimensions.get('window').width;

  return (
    <>
      <Modal
        isVisible={showCard}
        onBackdropPress={() => {
          setShowCard(false);
          analytics.logEvent(
            { name: 'CHATROOM PROFILE CLOSE', data: { userId: otherUser } },
            true,
          );
        }}
        coverScreen
        deviceWidth={deviceWidth}
        onBackButtonPress={() => setShowCard(false)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          width: '100%',
          margin: 0,
          padding: 0,
        }}>
        <ProfileCard
          showBack
          onBack={() => {
            setShowCard(false);
            analytics.logEvent(
              { name: 'CHATROOM PROFILE CLOSE', data: { userId: otherUser } },
              true,
            );
          }}
          {...otherUser}
          wide
          progress={chat?.progress}
        />
      </Modal>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowCard(true);
          analytics.logEvent({ name: 'CHATROOM PROFILE OPEN', data: {} }, true);
        }}>
        <View style={styles.container}>
          <CustomAvatar
            scale={0.2}
            {...otherUser?.avatar}
            customAvatarContainerStyle={{ padding: 0 }}
          />
          <Text style={styles.username}>
            {chat?.progress < 2 / 3 ? otherUser?.username : otherUser?.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = EStylsheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

export default ChatHeader;
