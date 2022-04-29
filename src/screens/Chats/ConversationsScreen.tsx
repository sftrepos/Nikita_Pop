import React, {
  ReactElement,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConversationItem, {
  EventConversationItem,
  GroupConversationItem,
} from 'components/Conversations/ConversationItem';
import SendBird, {
  Member,
  GroupChannelListQuery,
  GroupChannel,
  UserMessage,
  FileMessage,
} from 'sendbird';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import MessagingEmptyView from 'components/Messaging/MessagingEmptyView';
import { getId } from 'util/selectors';
import { CustomAvatarProps } from '../../../assets/vectors/pochies/CustomAvatar';
import { useFocusEffect } from '@react-navigation/core';
import generalConstants from 'constants/general';
import MessagingFooter from 'components/Messaging/MessagingFooter';
import { useDispatch, useSelector } from 'react-redux';
import useAnalytics from 'util/analytics/useAnalytics';
import ChatsSlice from 'features/Chats/ChatsSlice';
import ConversationSlice from 'features/Chats/ConversationSlice';
import { AppState, AppStateStatus } from 'react-native';
import { CustomHeaderButton } from 'components/HeaderButtons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import InviteModal from './InviteModal';
import { useTheme } from '@react-navigation/native';
import { SbMessage } from './MessagesScreen';
import ActionButton from 'components/Buttons/ActionButton';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { checkNotifications } from 'react-native-permissions';
import routes from 'nav/routes';

const before = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
const now = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');

const styles = EStyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  flatlist: {
    flex: 1,
  },
  popContainer: {
    borderRadius: 20,
    backgroundColor: 'white',
    padding: '1rem',
    width: Dimensions.get('window').width - 90,
    alignSelf: 'center',
    margin: '10rem',
    justifyContent: 'center',
    borderWidth: 0,
    elevation: 3,
  },
  popupHeading: {
    fontSize: 14,
    color: 'black',
    margin: 5,
    textAlign: 'center',
  },
  popupSubTitle: {
    fontSize: 10,
    color: 'black',
    padding: '0.5rem',
    textAlign: 'center',
  },
  actionButtonStyles: {
    alignSelf: 'center',
    height: '2.5 rem',
    width: '100%',
    marginBottom: '.5rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  actionButtonLaterTextStyle: {
    color: '$raspberry',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'uppercase',
    fontWeight: '700',
    alignSelf: 'center',
    letterSpacing: 1,
    fontSize: '1 rem',
    marginBottom: '1rem',
  },
  modal: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: '#FFFFFF50',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

const QUERY_SIZE = 20;
// const { colors } = useTheme();

interface IConversationsScreen {
  navigation: any;
}

export type MetaData = {
  avatar: string;
  name: string;
};

export type ChannelMetaData = {
  lastSpeaker: string;
  switches: string;
  type: string;
};

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

const ConversationsScreen = ({
  navigation,
}: IConversationsScreen): ReactElement => {
  const { colors } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [initialize, isInitialize] = useState(false);
  const currentUrl = useSelector((state) => state.chats.currentChannel);
  const groupId = useSelector((state) => state.chats.groupId);

  const [collection, setCollection] = useState<ChannelCollectionInstance>();

  const [conversationQuery, setConversationQuery] =
    useState<GroupChannelListQuery>();
  const id = useSelector(getId);
  const sb = SendBird.getInstance();
  const appState = useRef(AppState.currentState);
  const [isVisible, setVisible] = useState(false);
  const permissionStatus = '';

  // modal
  const inviteModalRef = useRef<Modalize>(null);

  //open invite modal
  const openInviteModal = () => {
    inviteModalRef.current?.open();
  };

  // Trigger the load when hitting the bottom
  const getNextConversations = () => {
    setIsLoadingMore(true);
    if (conversationQuery && conversationQuery.hasNext) {
      conversationQuery.next((moreChannels) => {
        console.log(moreChannels.length);
        setConversations((oldConversations) => [
          ...oldConversations,
          ...moreChannels,
        ]);
      });
    } else {
      setHasNext(false);
    }
    setIsLoadingMore(false);
    setHasNext(false);
  };

  const dispatch = useDispatch();
  const analytics = useAnalytics();

  // Insert new incoming message in a conversation
  const insertNewMessageToChannelList = (
    channel: GroupChannel,
    message: SbMessage,
  ) => {
    setConversations((oldConversations) => {
      let channelsBuffer = [...oldConversations];
      const index = oldConversations.findIndex(
        (elem) => elem.url == message.channelUrl,
      );
      if (index >= 0) {
        const temp = oldConversations[index];
        temp.lastMessage = message;
        channelsBuffer.splice(index, 1);
        channelsBuffer = [temp, ...channelsBuffer];
      } else {
        channelsBuffer = [channel, ...channelsBuffer];
      }
      sb.getTotalUnreadChannelCount((count, err) => {
        PushNotificationIOS.setApplicationIconBadgeNumber(count);
        dispatch(ChatsSlice.actions.setNumUnreadChat(count));
      });
      return channelsBuffer;
    });
  };

  // removes a channel
  const removeChannel = (channelUrl: string) => {
    setConversations((oldConversations) => {
      const channelsBuffer = [...oldConversations];
      const index = oldConversations.findIndex(
        (elem) => elem.url == channelUrl,
      );
      if (index >= 0) {
        channelsBuffer.splice(index, 1);
      }
      return channelsBuffer;
    });
  };

  // update members of channels TODO not triggering rerender
  const updateChannelMembers = (channel: GroupChannel) => {
    setConversations((oldConversations) => {
      let channelsBuffer = [...oldConversations];
      const index = oldConversations.findIndex(
        (elem) => elem.url == channel.url,
      );
      if (index >= 0) {
        channelsBuffer.splice(index, 1);
        channelsBuffer = [channel, ...channelsBuffer];
      } else {
        channelsBuffer = [channel, ...channelsBuffer];
      }
      return channelsBuffer;
    });
  };

  // Clearing channels on the screen
  const clearChannels = () => {
    setConversations([]);
  };

  const getConversations = (isRefreshing?: boolean) => {
    if (isRefreshing) setRefreshing(true);

    if (conversationQuery?.hasNext) {
      setHasNext(true);
      conversationQuery.next((initialChannels) => {
        setConversations(initialChannels);
        setConversationQuery(conversationQuery);
      });
    } else {
      setHasNext(false);
    }
    // Setting badge count
    sb.getTotalUnreadChannelCount((count, err) => {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
      dispatch(ChatsSlice.actions.setNumUnreadChat(count));
    });
  };

  // // Retrieving new chats when the app comes back from messages screen
  useFocusEffect(
    useCallback(() => {
      onRefresh();
      renderPopup();
    }, []),
  );

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    onRefresh();
  };

  useEffect(() => {
    // Sendbird Connection + Channel handlers
    const channelHandler = new sb.ChannelHandler();
    const connectionHandler = new sb.ConnectionHandler();

    connectionHandler.onReconnectFailed = () => {
      sb.reconnect();
    };

    sb.addConnectionHandler(id, connectionHandler);
    sb.addChannelHandler(id, channelHandler);

    // Chatroom query parameters
    const query = sb.GroupChannel.createMyGroupChannelListQuery();
    query.limit = QUERY_SIZE;
    query.includeEmpty = true;
    query.memberStateFilter = 'joined_only';
    query.order = 'latest_last_message';
    setConversationQuery(query);
    sb.getTotalUnreadChannelCount((count, err) => {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
      dispatch(ChatsSlice.actions.setNumUnreadChat(count));
    });

    // Inbound message
    channelHandler.onMessageReceived = (channel, message: UserMessage) => {
      insertNewMessageToChannelList(channel, message);
    };

    // On deletion
    channelHandler.onChannelDeleted = (
      channelUrl: string,
      channelType: string,
    ) => {
      removeChannel(channelUrl);
    };

    // On invite
    channelHandler.onUserJoined = (
      channel: GroupChannel,
      user: SendBird.User,
    ) => {
      updateChannelMembers(channel);
    };

    AppState.addEventListener('change', _handleAppStateChange);
    navigation.setOptions({
      headerRight: () => (
        <CustomHeaderButton
          style={{ marginRight: 16 }}
          onPress={() => {
            openInviteModal();
          }}
          name="plus"
        />
      ),
    });

    return () => {
      if (conversationQuery) setConversationQuery(undefined);
      if (collection) setCollection(undefined);
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  // Opening conversation
  const onPressConversation = (messagingParams: MessagingNavParams) => {
    dispatch(ConversationSlice.actions.setAllChannelList(conversations));
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

  // Rendering each converation item
  const renderItem = (props: ListRenderItemInfo<Conversation>) => {
    const { item, index } = props;
    const { unreadMessageCount, members, lastMessage, url, data } = item;
    let createdAt, message;
    if (!lastMessage || lastMessage.message === undefined) {
      createdAt = item.createdAt;
      message = '';
    } else {
      message = lastMessage.message;
      createdAt = lastMessage.createdAt;
    }

    if (item.customType === 'event') {
      // groupName,
      // lastMessage,
      // onPress,
      // isOnline,
      // emoji,
      // lastMessageDate,

      if (lastMessage?.customType) {
        const is_me = lastMessage._sender.userId === id;
        message = `${is_me ? 'You' : lastMessage.sender.nickname} sent a ${
          lastMessage.customType
        }!`;
      }

      let dataDic = {};
      if (item.data != undefined) {
        try {
          dataDic = JSON.parse(item.data);
        } catch (err) {
          console.log('Error in parsing' + item.data);
        }
      }

      const displayName = dataDic.name;
      const emoji = dataDic.emoji;

      return (
        <EventConversationItem
          emoji={emoji}
          groupId={dataDic.groupId}
          onPress={() => {
            onPressConversation({
              type: item.customType,
              avatar: undefined,
              userId: id,
              conversation: item,
              progress: 0,
              displayName,
              url,
            });
            // Resetting unread count
            conversations[index].unreadMessageCount = 0;
            setConversations(conversations);
          }}
          isOnline={item.unreadMessageCount > 0}
          lastMessage={message}
          lastMessageDate={createdAt}
          groupName={displayName}
        />
      );
    } else if (item.customType === 'group') {
      const otherUsers = members.filter((member) => member.userId !== id);
      const thisUser = members.find((member) => member.userId === id);
      if (!thisUser) {
        throw new Error('This user is not in the group');
      }

      // parse data for users
      const { userId, nickname, metaData } = otherUsers[0]
        ? otherUsers[0]
        : thisUser;
      const { avatar, name } = metaData as MetaData;

      let avatarJs = undefined;
      if (avatar) {
        avatarJs = JSON.parse(avatar);
      }

      const usernamesArr = [] as Array<string>;
      for (let i = 0; i < otherUsers.length; i++) {
        // TODO parse names
        usernamesArr.push(otherUsers[i].nickname);
      }

      // group display name
      let displayName: string;
      if (usernamesArr.length === 0) {
        displayName = 'You';
      } else if (usernamesArr.length === 1) {
        displayName = usernamesArr[0];
      } else {
        displayName = `${usernamesArr[0]}, + ${usernamesArr.length - 1} more`;
      }

      if (lastMessage?.customType) {
        const is_me = lastMessage._sender.userId === id;
        message = `${is_me ? 'You' : lastMessage.sender.nickname} sent a ${
          lastMessage.customType
        }!`;
      }

      let dataDic = {};
      if (item.data != undefined) {
        try {
          dataDic = JSON.parse(item.data);
        } catch (err) {
          console.log('Error in parsing' + item.data);
        }
      }

      return (
        <GroupConversationItem
          avatar={avatarJs}
          onPress={() => {
            onPressConversation({
              type: item.customType,
              avatar: avatarJs,
              userId,
              conversation: item,
              progress: 0,
              displayName,
              url,
            });
            // Resetting unread count
            conversations[index].unreadMessageCount = 0;
            setConversations(conversations);
          }}
          isOnline={item.unreadMessageCount > 0}
          lastMessage={message}
          lastMessageDate={createdAt}
          users={usernamesArr}
          groupName={displayName}
        />
      );
    } else {
      const otherUser = members.find((member) => member.userId !== id);

      if (otherUser === undefined) {
        return <></>;
      }

      const { userId, nickname, metaData } = otherUser as Member;
      const { avatar, name } = metaData as MetaData;

      let avatarJs = undefined;
      if (avatar) {
        avatarJs = JSON.parse(avatar);
      }

      const dataDic = JSON.parse(data);
      const chatProgressPercentage =
        dataDic.switches / generalConstants.maxDisplayNameThresholdNumber;
      const displayName =
        chatProgressPercentage > generalConstants.displayNameThreshold
          ? name
          : nickname;

      if (lastMessage?.customType) {
        const is_me = lastMessage._sender.userId === id;
        message = `${is_me ? 'You' : displayName} sent a ${
          lastMessage.customType
        }!`;
      }

      return (
        <ConversationItem
          avatar={avatarJs}
          onPress={() => {
            console.log(
              'chat data is   ' +
                item.customType +
                '\n' +
                userId +
                '\n' +
                displayName +
                '\n' +
                url,
            );
            onPressConversation({
              type: item.customType,
              avatar: avatarJs,
              userId,
              conversation: item,
              progress: chatProgressPercentage,
              displayName: displayName,
              url,
            });
            // Resetting unread count
            conversations[index].unreadMessageCount = 0;
            setConversations(conversations);
          }}
          isOnline={item.unreadMessageCount > 0}
          lastMessage={message}
          lastMessageDate={createdAt}
          user={displayName}
        />
      );
    }
  };

  const storeDataValue = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  const renderPopup = async () => {
    let diff = 0;
    const value = await AsyncStorage.getItem('datee');
    if (value != null) {
      diff = moment(now).diff(moment(value), 'days');
    }

    checkNotifications().then(({ status, settings }) => {
      if (status === 'blocked' && value == null) {
        setVisible(true);
        storeDataValue('datee', '' + before);
      } else if (status === 'blocked' && diff >= 7) {
        analytics.logEvent(
          {
            name: 'NOTIFICATION PERMISSION MODAL SHOW',
            data: {},
          },
          true,
        );
        setVisible(true);
      }
    });
  };

  const initConversations = () => {
    console.log('INITIALIZE CONVERSATIONS');
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y < -100 && isLoading) {
      initConversations();
    }
  };

  const onRefresh = () => {
    const query = sb.GroupChannel.createMyGroupChannelListQuery();
    query.limit = QUERY_SIZE;
    query.includeEmpty = true;
    query.memberStateFilter = 'joined_only';
    query.order = 'latest_last_message';
    setConversationQuery(query);

    // Querying latest chats
    query.next((initialChannels) => {
      setConversations(initialChannels);
      // This allows us to query the next chats
      setConversationQuery(query);
    });

    // Setting for next batch of chats
    if (query.hasNext) {
      setHasNext(true);
    } else {
      setHasNext(false);
    }

    // updating redux and app's notification when coming back from background
    sb.getTotalUnreadChannelCount((count, err) => {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
      dispatch(ChatsSlice.actions.setNumUnreadChat(count));
    });
  };

  // Reduces load
  // https://stackoverflow.com/questions/44743904/virtualizedlist-you-have-a-large-list-that-is-slow-to-update
  const memoizedValue = useMemo(() => renderItem, [conversations]);

  const handleClick = () => {
    Linking.openSettings();
    storeDataValue('datee', '' + before);
    analytics.logEvent(
      {
        name: 'NOTIFICATION PERMISSION MODAL PRESS TURN ON',
        data: {},
      },
      true,
    );
  };
  const modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversations}
        style={[styles.flatlist]}
        keyExtractor={(channel) => channel.url}
        contentContainerStyle={[styles.contentContainer]}
        onEndReached={({ distanceFromEnd }) => {
          console.log('end has been reached', conversationQuery?.hasNext);
          // Temp fix to stop onEndReached being called everytime
          if (distanceFromEnd < 0) {
            conversationQuery?.hasNext && !conversationQuery?.isLoading
              ? getNextConversations()
              : () => {};
          }
        }}
        onEndReachedThreshold={0}
        renderItem={memoizedValue}
        ListFooterComponent={<MessagingFooter isLoadingMore={isLoadingMore} />}
        ListEmptyComponent={
          isLoading && !isLoadingMore ? (
            <MessagingEmptyView />
          ) : (
            <MessagingEmptyView
              isMessageScreen={false}
              message="No messages yet. Try swiping to find and chat with other people!"
            />
          )
        }
        onScroll={onScroll}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        getItemLayout={(_, index) => ({
          index,
          length: 65,
          offset: 65 * index,
        })}
        removeClippedSubviews={true}
      />
      <Portal>
        <Modalize
          // modalStyle={{borderTopLeftRadius: 12}}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          adjustToContentHeight={true}
          ref={inviteModalRef}
          handlePosition="inside">
          <InviteModal
            type="create"
            close={() => inviteModalRef.current?.close()}
            navigation={navigation}
          />
        </Modalize>
      </Portal>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <View style={[styles.modal, modalBackgroundStyle]}>
          <View style={[styles.popContainer]}>
            <Text style={[styles.popupHeading]}>
              Your Notifications are Off!
            </Text>
            <Image
              source={require('../../../assets/notification_icon.png')}
              style={{ alignSelf: 'center', margin: 10 }}></Image>

            <Text style={[styles.popupSubTitle]}>
              Never miss a message from a friend by turning your notifications
              on!
            </Text>
            <View style={{ marginTop: 5 }}>
              <ActionButton
                containerStyle={styles.actionButtonStyles}
                onPress={handleClick}
                gradient
                label="Turn On"
                textStyle={styles.actionButtonTextStyle}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                storeDataValue('datee', '' + before);
                analytics.logEvent(
                  {
                    name: 'NOTIFICATION PERMISSION MODAL PRESS LATER',
                    data: {},
                  },
                  true,
                );
              }}>
              <Text style={[styles.actionButtonLaterTextStyle]}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConversationsScreen;
