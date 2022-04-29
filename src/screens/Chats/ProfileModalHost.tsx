import React, { useEffect, useState } from 'react';
import { View, Modal, Dimensions, Pressable } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
// import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import ProfileCard from 'components/ProfileCard';
import useAnalytics from 'util/analytics/useAnalytics';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuickSendButton from 'components/Buttons/QuickSendButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducer } from 'store/rootReducer';
import { GroupChannelMemberListQuery } from 'sendbird';
import ChatsSlice from 'features/Chats/ChatsSlice';
import ConversationSlice from 'features/Chats/ConversationSlice';
import generalConstants from 'constants/general';
import SendBird, { GroupChannel, Member } from 'sendbird';
import { CustomAvatarProps } from '../../../assets/vectors/pochies/CustomAvatar';
interface IProfileModal {
  otherUser: any;
  onClose?: () => void;
  isHost: boolean;
  removeMember?: (id: string) => void;
  close: () => void;
  openRequestModal: () => void;
  navigation: any;
}
export type Conversation = GroupChannel;
export type MessagingNavParams = {
  type: string;
  avatar: CustomAvatarProps;
  userId: string;
  conversation: Conversation;
  // meta: ChannelMetaData;
  url: string;
  progress: number;
  displayName: string;
};
export type MetaData = {
  avatar: string;
  name: string;
};
const ProfileModalHost = ({
  otherUser,
  onClose,
  isHost,
  removeMember,
  close,
  openRequestModal,
  navigation,
}: IProfileModal) => {
  const analytics = useAnalytics();
  const { colors } = useTheme();
  let channelList = [] as GroupChannel[];

  const numUnreadChat: GroupChannelMemberListQuery[] = useSelector(
    (state: RootReducer) => state.conversation.channelList,
  );
  channelList = useSelector((state) => state.conversation.channelList);
  const dispatch = useDispatch();
  const onPressConversation = (messagingParams: MessagingNavParams) => {
    dispatch(ConversationSlice.actions.setType(messagingParams.type));
    dispatch(ConversationSlice.actions.setName(messagingParams.displayName));
    dispatch(ChatsSlice.actions.setCurrentChannel(messagingParams.url));
    dispatch(ConversationSlice.actions.setOtherUserId(messagingParams.userId));
    dispatch(ConversationSlice.actions.setProgress(messagingParams.progress));
    navigation.navigate('MESSAGING_STACK', {
      screen: 'MESSAGING_SCREEN',
      params: messagingParams,
    });
    analytics.logEvent(
      {
        name: 'CHATROOM NAVIGATE',
        data: { chatId: messagingParams.url },
      },
      true,
    );
  };
  let userId = '',
    url = '',
    type = '',
    displayName = '',
    progress;
  let item;

  let avatar;

  for (let i = 0; i < numUnreadChat.length; i++) {
    for (let j = 0; j < numUnreadChat[i].members.length; j++) {
      if (
        otherUser.isMatched &&
        numUnreadChat[i].members[j].userId == otherUser.identityId &&
        numUnreadChat[i].isDistinct == true
      ) {
        userId = otherUser.identityId;
        const dataDic = JSON.parse(numUnreadChat[i].data);
        progress =
          dataDic.switches / generalConstants.maxDisplayNameThresholdNumber;
        avatar = numUnreadChat[i].members[0].metaData.avatar;
        displayName =
          progress > generalConstants.displayNameThreshold
            ? numUnreadChat[i].members[0].metaData.name
            : numUnreadChat[i].members[0].nickname;
        item = numUnreadChat[i];
        type = numUnreadChat[i].customType;
        url = numUnreadChat[i].url;
      }
    }
  }
  const Spinner = () => {
    if (!otherUser) {
      return (
        <ActivityIndicator
          //   style={{ position: 'absolute', top: '50%' }}
          color={colors.primary}
        />
      );
    } else {
      return <View />;
    }
  };

  return (
    <>
      {otherUser ? (
        <View>
          <ProfileCard
            style={{
              height: Dimensions.get('screen').height * 0.7,
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
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                position: 'absolute',
                top: -25,
                flexDirection: 'row',
              }}>
              {isHost && (
                <Pressable
                  style={styles.test}
                  onPress={() => {
                    removeMember && removeMember(otherUser.identityId);
                    // close();
                  }}>
                  <Icon name="close" size={25} color="red" />
                </Pressable>
              )}
              <View
                style={{
                  opacity: otherUser.isMatched ? 0.6 : 1,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    close();
                  }}>
                  <View style={styles.test}>
                    <Icon name="close" size={25} color="red" />
                  </View>
                </TouchableOpacity>
                <QuickSendButton
                  onPress={() => {
                    if (!otherUser.isMatched) {
                      openRequestModal();
                    } else {
                      onClose();
                      onPressConversation({
                        type: type,
                        avatar: undefined,
                        userId: userId,
                        conversation: item,
                        progress: 0,
                        displayName,
                        url,
                      });
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <Pressable
            style={{ marginTop: 20, height: Dimensions.get('screen').height }}
            onPress={close}
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
  test: {
    width: '3 rem',
    height: '3 rem',
    marginRight: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'red',
    backgroundColor: 'white',
    borderWidth: '.1rem',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  cancelVIew: {},
});

export default ProfileModalHost;
