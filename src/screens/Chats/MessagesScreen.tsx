import ChatBubbleWrapper from 'components/Messaging/ChatBubbleWrapper';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollViewProps,
  Platform,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  useTheme,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import MessagingEmptyView from 'components/Messaging/MessagingEmptyView';
import {
  sbGetChannelByUrl,
  sbMessageReceiver,
  sbSendMessage,
  sbReactMessage,
  sbReactMessageRemove,
  sbSendFileMessage,
} from 'services/sendbird/messaging';
import { MetaData } from './ConversationsScreen';
import SendBird, {
  Member,
  UserMessage,
  FileMessage,
  AdminMessage,
  GroupChannel,
  Reaction,
  PreviousMessageListQuery,
} from 'sendbird';
import MessageInput from 'components/MessageInput';
import { KeyboardCompatibleView } from 'components/KeyboardCompatibleView';
import MessagingFooter from 'components/Messaging/MessagingFooter';
import _ from 'lodash';
import store from 'store/index';
import { getId, getStoreToken, getProfileData } from 'util/selectors';
import { sendRequest } from 'features/Request/RequestActions';
import ProfileModal from 'components/Modals/ProfileModal';
import { PopApi } from 'services/api';
import MessageProgressBar from 'components/MessageProgressBar/MessageProgressBar';
import { Paragraph } from 'components/Text';
import { width } from 'util/phone';
import generalConstants from 'constants/general';
import ReactionPanel from 'components/Messaging/ReactionPanel';
import reactions, { reaction } from 'constants/reactions';
import { TMessageDate } from 'components/Messaging/MessageDate';
import { useDispatch, useSelector } from 'react-redux';
import ChatsSlice from 'features/Chats/ChatsSlice';
import useAnalytics from 'util/analytics/useAnalytics';
import ConversationSlice from 'features/Chats/ConversationSlice';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AppState, AppStateStatus } from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import MessagesScreenSideMenu from './MessagesScreenSideMenu';
import { CustomHeaderButton } from 'components/HeaderButtons';
import MessagingHeader, {
  EventMessagingHeader,
  GroupMessagingHeader,
} from 'components/Messaging/MessagingHeader';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import InviteModal from './InviteModal';
import InvitePopInScreen from './InvitePopInScreen';
import routes from 'nav/routes';
import Toast from 'react-native-toast-message';
import RadialMenu from './RadialMenu';
import Interactable from 'react-native-interactable';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import OptionsModal from './OptionsModal';
import ReportPopinModal from './ReportPopinModal';
import ViewMembersModal from './ViewMembersModal';
import { Keyboard } from 'react-native';
import LeavePopinModal from './LeavePopinModal';
import LockModal from './LockModal';
import ProfileModalHost from './ProfileModalHost';
import QuickInviteScreen from 'screens/Browse/components/CarouselModal/QuickInviteScreen';
import { ISendRequest } from 'services/types';
import PopInSlice from 'features/Chats/PopInSlice';

const styles = EStyleSheet.create({
  _r: {
    padding: '1rem',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: '1rem',
  },
  flatlistContainer: {
    flex: 1,
    width: '100%',
  },
  keyboardPadding: {
    // paddingBottom: '0.7rem',
  },
  containerProgressBar: {
    justifyContent: 'center',
    padding: '0.5rem',
  },
  containerProgressBarTextWrap: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: '#FFFFFF50',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  popInInvite: {
    marginHorizontal: '1rem',
  },
});
let dataDic = null;

const log = (...t: any) =>
  console.info('------MESSAGING:', ...t, '------------');

const uniqueList = (list: SbMessage[]) => {
  return list.reduce((uniqList, currentValue) => {
    const ids = uniqList.map((item: any) => {
      return item.messageId;
    });
    if (ids.indexOf(currentValue.messageId) < 0) {
      uniqList.push(currentValue);
    }
    return uniqList;
  }, []);
};

export const MESSAGES_LIMIT = 30;
export type SbMessage = UserMessage | FileMessage | AdminMessage;
export type SenderData = {
  _sender: {
    userId: string;
  };
};
export type StdMessage =
  | ((UserMessage | FileMessage) & SenderData)
  | AdminMessage;

export type Conversation = GroupChannel;

export type MassageScreenProps = {
  navigation: any;
};
const keyExtractor = (item: StdMessage): string =>
  item.messageId.toString() || item.createdAt.toString();

const MessagesScreen: React.FC<MassageScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previousListQuery, setPreviousListQuery] =
    useState<PreviousMessageListQuery>();
  const [messagesState, setMessagesState] = useState<SbMessage[]>([]);
  const [conversation, setConversation] = useState<GroupChannel>();

  const [msgType, setMsgType] = useState('text');
  const id = getId(store.getState());
  const currentUser = getProfileData(store.getState());

  let url: string, type: string, displayName: string;
  if (route && route.params && route.params.type == 'event') {
    url = route.params.url;
    type = route.params.type;
    displayName = route.params.displayName;
  } else {
    url = useSelector((state) => state.chats.currentChannel);
    type = useSelector((state) => state.conversation.type);
    displayName = useSelector((state) => state.conversation.name);
  }

  const userId = useSelector((state) => state.conversation.otherUserId);
  const progress = useSelector((state) => state.conversation.progress);

  // 1:1 chat
  const [otherUser, setOtherUser] = useState('');
  const [localProgress, setLocalProgress] = useState(progress);

  // group chat
  const [group, setGroup] = useState();
  const [groupPrivate, setGroupPrivate] = useState(false);
  const [isInviteLocked, setInviteLocked] = useState(false);
  const [isReloadPage, setReloadPage] = useState(false);

  const dispatch = useDispatch();
  const analytics = useAnalytics();

  //reaction panel visible
  const [panelVisible, setPanelVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SbMessage>();
  const [highlighted, setHighlighted] = useState<Reaction[]>([]);
  const [reactionUpdate, setReactionUpdate] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [isVisible, setVisible] = useState(true);
  const [id1, setId] = useStateWithCallbackLazy('');

  //reaction list panel
  const [panelListVisible, setPanelListVisible] = useState(false);

  // side menu modal
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  // invite modal
  const inviteModalRef = useRef<Modalize>(null);
  const toggleInviteModal = (url: string) => {
    inviteModalRef.current?.open();
    analytics.logEvent(
      { name: 'CHATROOM INVITE MODAL OPEN', data: { chatId: url } },
      true,
    );
  };

  // options modal
  const optionsModalRef = useRef<Modalize>(null);
  const toggleOptionsModal = () => {
    Keyboard.dismiss();
    optionsModalRef.current?.open();
  };

  // report modal
  const reportModalRef = useRef<Modalize>(null);
  const toggleReportModal = () => {
    reportModalRef.current?.open();
  };

  // view members modal
  const viewMembersModalRef = useRef<Modalize>(null);
  const toggleViewMembersModal = () => {
    viewMembersModalRef.current?.open();
  };

  // leave modal
  const leaveModalRef = useRef<Modalize>(null);
  const toggleLeaveModal = () => {
    leaveModalRef.current?.open();
  };

  // lock modal
  const lockModalRef = useRef<Modalize>(null);
  const toggleLockModal = () => {
    lockModalRef.current?.open();
  };

  // popin invite modal
  const popInInviteModalRef = useRef<Modalize>(null);
  const togglePopInInviteModal = () => {
    popInInviteModalRef.current?.open();
  };

  //quick invite modal
  const quickInviteModalRef = useRef<Modalize>(null);
  const onPressQuickInvite = () => {
    quickInviteModalRef.current?.open();
  };

  const closeQuickInviteModal = () => {
    quickInviteModalRef.current?.close();
  };

  // profile modal (1:1)
  const profileModalRef = useRef<Modalize>(null);
  const openProfileModal = (url: string) => {
    console.info('opening profile modal');
    profileModalRef.current?.open();
    Keyboard.dismiss();
    analytics.logEvent(
      {
        name: 'CHATROOM PROFILE MODAL OPEN',
        data: { chatId: url, type: conversation?.customType },
      },
      true,
    );
  };
  const [prevModal, setPrevModal] =
    useState<'none' | 'sidemenu' | 'reaction'>('none');

  const contentRef = useRef<ScrollView>(null);

  // sending requests
  const isSendRequestSuccess = useSelector(
    (state) => state.requests.requestSuccess,
  );
  const isLoadingSendRequest = useSelector((state) => state.requests.isLoading);

  //radial menu
  const actionButton = useRef(null);
  const interactableView = useRef(null);
  const [buttonPos, setButtonPos] = useState<'right' | 'left'>('right');
  const [buttonsActive, setButtonsActive] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);

  // const token = useSelector((state) => getStoreToken(state));
  // const [isLoadingCreation, setIsLoadingCreation] = useState(false);
  // const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // const groupId = useSelector((state) => state.chats.groupId);

  type close = { close: () => void };

  const toggleButtonsActive = () => {
    if (actionButton.current) {
      setButtonsActive(false);
      actionButton.current.reset();
      setTimeout(() => {
        interactableView.current &&
          interactableView.current.snapTo({ index: snapIndex });
      }, 50);
    }
  };

  // update progress bar locally
  useEffect(() => {
    const sb = SendBird.getInstance();
    sendbirdListen(sb);
    if (type !== 'group' && type !== 'event') {
      PopApi.getUser({
        params: {
          id,
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${getStoreToken(store.getState())}`,
        },
      }).then((res) => {
        const otherUserData = res.response.data;
        setOtherUser(otherUserData);
        console.log('=====   ' + otherUserData);
      });
    } else {
    }

    return () => {
      sb.removeChannelHandler(userId);
      dispatch(ChatsSlice.actions.setCurrentChannel(''));
      dispatch(PopInSlice.actions.setLoaded(false));
    };
  }, [isReloadPage]);

  const toggleInfo = () => {
    navigation.navigate('POPIN_DETAILS_SCREEN');
  };

  const addMessage = (newMsg: SbMessage) => {
    parseMessages(
      uniqueList([
        ...[newMsg as StdMessage],
        ...(messagesState as StdMessage[]),
      ]),
    );
  };

  const onMessageReceived = (channel: GroupChannel, message: SbMessage) => {
    if (channel.url && channel.url == url) {
      //log('Message received', message, messagesState);
      setMessagesState((oldMessages) =>
        uniqueList([
          ...[message as StdMessage],
          ...(oldMessages as StdMessage[]),
        ]),
      );

      channel.markAsRead();
      const dataDic = JSON.parse(channel.data);
      if (
        channel.customType !== 'group' &&
        channel.customType !== 'event' &&
        (message.isUserMessage() || message.isFileMessage()) &&
        message.sender.userId != dataDic.lastSpeaker
      ) {
        updateProgressBar(JSON.parse(channel.data).switches + 1, channel);
      } else if (
        (channel.customType === 'group' || channel.customType === 'event') &&
        message.isAdminMessage()
      ) {
        setConversation(channel);
      }
    }
  };

  const onReactionReceived = () => {
    refreshMessages();
  };

  const onUserJoined = (channel: GroupChannel) => {
    if (channel.customType === 'event') {
      setConversation(channel);
    } else if (channel.customType === 'group') {
      setConversation(channel);
      const otherUser = channel.members.find((member) => member.userId !== id);
      const { name, avatar } = otherUser?.metaData as MetaData;
      let avatarJs: any = undefined;
      if (avatar) {
        avatarJs = JSON.parse(avatar);
      }

      const userArr = [] as Array<string>;
      for (let i = 0; i < channel.members.length; i++) {
        // TODO parse names
        if (channel.members[i].userId !== id) {
          userArr.push(channel.members[i].nickname);
        }
      }

      // group display name
      let newDisplayName = '';
      let i = 0;
      while (i < userArr.length && i < 1) {
        if (i === userArr.length - 1) {
          newDisplayName += ` ${userArr[i]}`;
        } else {
          newDisplayName += ` ${userArr[i]},`;
        }
        i++;
      }
      if (i < userArr.length) {
        newDisplayName += ` + ${userArr.length - i} more`;
      }

      navigation.setOptions({
        headerLeft: () => (
          <View style={{ flexDirection: 'row' }}>
            <CustomHeaderButton
              name="chevron-left"
              onPress={() => {
                navigation.pop();
              }}
            />
            {channel.customType === 'group' && (
              <GroupMessagingHeader
                displayName={newDisplayName}
                avatar={avatarJs}
              />
            )}
          </View>
        ),
      });
    }
  };

  const parseMessages = (messages: StdMessage[]) => {
    if (messages.length > 0) {
      setMessagesState(messages);
    } else {
      setMessagesState([]);
      setIsLoading(false);
    }
    const sb = SendBird.getInstance();
    sb.getTotalUnreadChannelCount((count, err) => {
      if (Platform.OS == 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(count);
      dispatch(ChatsSlice.actions.setNumUnreadChat(count));
    });
  };

  // update progress bar locally
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  // Listening to Sendbird
  const sendbirdListen = (sb) => {
    sb.getTotalUnreadChannelCount((count, err) => {
      if (Platform.OS == 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(count);
      dispatch(ChatsSlice.actions.setNumUnreadChat(count));
    });
    sbGetChannelByUrl(url).then((channel) => {
      channel.markAsRead();

      // Receiving new messages
      sbMessageReceiver()
        .then((messagesReceiver) => {
          messagesReceiver.onMessageReceived = onMessageReceived;
          messagesReceiver.onReactionUpdated = onReactionReceived;
          messagesReceiver.onUserJoined = (
            channel: GroupChannel,
            user: SendBird.User,
          ) => {
            onUserJoined(channel);
          };
          messagesReceiver.onUserLeft = (
            channel: GroupChannel,
            user: SendBird.User,
          ) => {
            onUserJoined(channel);
          };

          messagesReceiver.onChannelDeleted = (
            channelUrl: string,
            channelType: string,
          ) => {
            navigation.navigate(routes.CHATS_SCREEN);
            Toast.show({
              text1: 'The channel has been deleted',
              type: 'info',
              position: 'bottom',
            });
          };

          sb.addChannelHandler(userId, messagesReceiver);
        })
        .catch((err) => {
          console.log('MSG_RECV_ERR', err);
        });

      setConversation(channel);

      //progress bar percentage and metadata parsing
      if (channel.customType === 'event') {
        const channelData = JSON.parse((channel as GroupChannel).data);
        PopApi.getPopIn(channelData.groupId, {
          params: {
            id,
          },
          headers: {
            Authorization: `Bearer ${getStoreToken(store.getState())}`,
          },
        }).then((res) => {
          if (res.error) {
            Toast.show({
              text1: 'Error getting popin',
              type: 'error',
              position: 'bottom',
            });
          } else {
            setGroup(res.response.data.data);
            dispatch(PopInSlice.actions.setName(res.response.data.data.name));
            dispatch(
              PopInSlice.actions.setDescription(
                res.response.data.data.description,
              ),
            );
            dispatch(PopInSlice.actions.setEmoji(res.response.data.data.emoji));
            dispatch(
              PopInSlice.actions.setLatitude(
                res.response.data.data.location.point.coordinates[1],
              ),
            );
            dispatch(
              PopInSlice.actions.setLongitude(
                res.response.data.data.location.point.coordinates[0],
              ),
            );

            dispatch(
              PopInSlice.actions.setSendbirdId(
                res.response.data.data.chat.sendbirdId,
              ),
            );

            dispatch(
              PopInSlice.actions.setLocation(res.response.data.data.location),
            );

            dispatch(
              PopInSlice.actions.setCreatedAt(
                new Date(res.response.data.data.createdAt),
              ),
            );

            dispatch(
              PopInSlice.actions.setCreator(res.response.data.data.creator),
            );

            dispatch(PopInSlice.actions.setGroupId(res.response.data.data._id));
            dispatch(PopInSlice.actions.setLoaded(true));
          }
        });

        navigation.setOptions({
          headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
              <CustomHeaderButton
                name="chevron-left"
                onPress={() => {
                  navigation.pop();
                }}
              />
              <EventMessagingHeader
                displayName={channelData.name}
                emoji={channelData.emoji}
                onPress={() => {
                  analytics.logEvent(
                    {
                      name: 'MESSASGES SCREEN POP-IN DETAILS OPEN',
                      data: {
                        chatId: url,
                        type: conversation?.customType,
                        buttonLocation: 'header',
                      },
                    },
                    true,
                  );
                  navigation.navigate('POPIN_DETAILS_SCREEN');
                }}
              />
            </View>
          ),
        });
      } else if (channel.customType === 'group') {
        //get backend group
        const channelData = JSON.parse((channel as GroupChannel).data);
        PopApi.getGroup(channelData.groupId, {
          params: {
            id,
          },
          headers: {
            Authorization: `Bearer ${getStoreToken(store.getState())}`,
          },
        }).then((res) => {
          if (res.error) {
            Toast.show({
              text1: 'Error getting group',
              type: 'error',
              position: 'bottom',
            });
          } else {
            setGroup(res.response.data.data);
          }
        });
      } else {
        const dataDic = JSON.parse(channel.data);
        const otherUser = channel.members.find(
          (member) => member.userId !== id,
        );
        const { name, avatar } = otherUser?.metaData as MetaData;
        let avatarJs: any = undefined;
        if (avatar) {
          avatarJs = JSON.parse(avatar);
        }

        const chatProgressPercentage =
          dataDic.switches / generalConstants.maxDisplayNameThresholdNumber;
        let displayName = '';
        chatProgressPercentage > generalConstants.displayNameThreshold
          ? (displayName = name)
          : (displayName = otherUser?.nickname ? otherUser.nickname : '');
        dispatch(ConversationSlice.actions.setProgress(chatProgressPercentage));
        dispatch(
          ConversationSlice.actions.setName(
            displayName !== undefined ? displayName : '',
          ),
        );

        navigation.setOptions({
          headerTitle: () => (
            <MessagingHeader
              displayName={displayName}
              avatar={avatarJs}
              onPress={() => {
                getProfile(userId, channel.url);
                setPrevModal('none');
              }}
            />
          ),
        });
      }

      dispatch(ConversationSlice.actions.setUsers(channel.members));

      // list query
      const initialListQuery = channel.createPreviousMessageListQuery();
      initialListQuery.limit = MESSAGES_LIMIT;
      initialListQuery.reverse = true;
      initialListQuery.includeMetaArray = true;
      initialListQuery.includeReactions = true;
      initialListQuery.includeReplies = true;
      initialListQuery.includeParentMessageText = true;
      setPreviousListQuery(initialListQuery);
      initialListQuery.load((messages, err) =>
        err
          ? log('ERR: Initial message load:', err)
          : parseMessages(messages as StdMessage[]),
      );
    });
  };

  // When user comes back to the screen.
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    refreshMessages();
  };

  const removeMember = (removeId: string, removerId?: string) => {
    if (conversation) {
      if (conversation.customType === 'group') {
        const channelData = JSON.parse((conversation as GroupChannel).data);
        PopApi.groupLeave(
          channelData.groupId,
          {
            params: {
              id,
            },
            headers: {
              Authorization: `Bearer ${getStoreToken(store.getState())}`,
            },
          },
          removeId,
        ).then((res) => {
          if (id === removeId) {
            if (res.error) {
              Toast.show({
                text1: 'Error leaving channel',
                type: 'error',
                position: 'bottom',
              });
              console.log('failed to leave channel', res.error);
            } else {
              Toast.show({
                text1: 'Success leaving channel',
                type: 'success',
                position: 'bottom',
              });
              navigation.navigate(routes.CHATS_SCREEN);
              console.log('Left channel', res.response);
            }
          } else {
            if (res.error) {
              Toast.show({
                text1: 'Error removing member',
                type: 'error',
                position: 'bottom',
              });
              console.log('failed to remove member', res.error);
            } else {
              Toast.show({
                text1: 'Successfully removed member',
                type: 'success',
                position: 'bottom',
              });
            }
          }
        });
      } else if (conversation.customType === 'event') {
        const channelData = JSON.parse((conversation as GroupChannel).data);
        PopApi.popInLeave(
          channelData.groupId,
          {
            params: {
              id,
              remover: removerId,
            },
            headers: {
              Authorization: `Bearer ${getStoreToken(store.getState())}`,
            },
          },
          removeId,
        ).then((res) => {
          if (id === removeId) {
            if (res.error) {
              Toast.show({
                text1: 'Error leaving popin',
                type: 'error',
                position: 'bottom',
              });
              console.log('failed to leave popin', res.error);
            } else {
              Toast.show({
                text1: 'Success leaving popin',
                type: 'success',
                position: 'bottom',
              });
              navigation.navigate(routes.CHATS_SCREEN);
            }
          } else {
            if (res.error) {
              Toast.show({
                text1: 'Error removing member',
                type: 'error',
                position: 'bottom',
              });
              console.log('failed to remove member', res.error);
            } else {
              Toast.show({
                text1: 'Successfully removed member',
                type: 'success',
                position: 'bottom',
              });
            }
          }
        });
      }
    }
  };

  const reportPopIn = (category: string, desc: string) => {
    if (group) {
      PopApi.reportPopIn(
        group._id,
        {
          id,
          reportedId: group._id,
          data: {
            type: 'chat',
            category: category,
            description: desc,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${getStoreToken(store.getState())}`,
          },
        },
      ).then((res) => {
        if (res.error) {
          Toast.show({
            text1: 'Error sending report',
            type: 'error',
            position: 'bottom',
          });
        } else {
          Toast.show({
            text1: 'Success reporting pop-in',
            type: 'success',
            position: 'bottom',
          });
        }
      });
    }
  };

  // get profile on press from side menu
  const getProfile = (uid: string, url: string) => {
    PopApi.getUser({
      params: {
        id,
        userId: uid,
      },
      headers: {
        Authorization: `Bearer ${getStoreToken(store.getState())}`,
      },
    }).then((res: any) => {
      const otherUserData = res.response.data;

      // If I'm getting my own profile.
      if (otherUserData.identityId == id) {
        otherUserData.isMatched = true;
      }
      if (otherUserData) {
        try {
          setOtherUser(otherUserData);
          openProfileModal(url);
        } catch (err) {
          console.info('error:', err);
        }
      }
    });
  };

  // update group
  const updateGroup = (data: any) => {
    if (group && conversation) {
      if (conversation.customType === 'group') {
        PopApi.updateGroup(group._id, data, {
          headers: {
            Authorization: `Bearer ${getStoreToken(store.getState())}`,
          },
        }).then((res: any) => {
          console.log(res);
        });
      } else if (conversation.customType === 'event') {
        PopApi.updatePopIn(group._id, data, {
          headers: {
            Authorization: `Bearer ${getStoreToken(store.getState())}`,
          },
        }).then((res: any) => {
          console.log(res);
        });
      }
      11;
    }
  };

  useEffect(() => {
    const sb = SendBird.getInstance();
    sendbirdListen(sb);
    if (type !== 'group' && type !== 'event') {
      PopApi.getUser({
        params: {
          id,
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${getStoreToken(store.getState())}`,
        },
      }).then((res) => {
        const otherUserData = res.response.data;
        setOtherUser(otherUserData);
      });
    } else {
    }

    return () => {
      sb.removeChannelHandler(userId);
      dispatch(ChatsSlice.actions.setCurrentChannel(''));
      dispatch(PopInSlice.actions.setLoaded(false));
    };
  }, []);

  useEffect(() => {
    if (group) {
      setGroupPrivate(group.isPrivate);
      if (!group.isPrivate) {
        setInviteLocked(false);
      } else {
        setInviteLocked(group.creator != id);
      }
    }
  }, [group]);

  useEffect(() => {
    if (
      conversation &&
      (conversation.customType === 'group' ||
        conversation.customType === 'event')
    ) {
      dataDic = JSON.parse(conversation.data);
      setId(dataDic.groupId, (dd: string) => dd);
      // if (g != undefined) {
      //   joinUsers()
      // }
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            {/* <CustomHeaderButton
              style={{ marginRight: 5 }}
              onPress={() => {
                toggleLockModal();
              }}
              name="lock-outline"
            /> */}
            <Pressable
              style={{
                marginRight: 10,
              }}
              onPress={() => {
                toggleLockModal();
              }}>
              {conversation.customType == 'event' ? (
                groupPrivate ? (
                  <Image
                    style={{ height: 32, width: 32 }}
                    source={require('assets/icons/lockIcon.png')}
                  />
                ) : (
                  <Image
                    style={{ height: 32, width: 32 }}
                    source={require('assets/icons/lockOpenIcon.png')}
                  />
                )
              ) : (
                <></>
              )}
            </Pressable>
            {/* {conversation.customType === 'event' && (
              <CustomHeaderButton
                style={{ marginRight: styles._r.padding }}
                onPress={() => {
                  toggleInfo();
                }}
                name="information-outline"
              />
            )} */}
          </View>
        ),
      });
    }
  }, [conversation, groupPrivate]);

  // Updating local progress bar component
  const updateProgressBar = (switches: number, channel: GroupChannel) => {
    console.log('upb');
    const newProgressPercentage =
      switches / generalConstants.maxDisplayNameThresholdNumber;
    setLocalProgress(newProgressPercentage);
    const isLessThanDisplayNameThreshold =
      newProgressPercentage < generalConstants.displayNameThreshold;

    if (!isLessThanDisplayNameThreshold && channel !== undefined) {
      const members = channel.memberMap;
      const myUser = members[Object.keys(members).find((e) => e !== id)];
      const { nickname, metaData } = myUser;
      const { avatar } = metaData as MetaData;

      let avatarJs: any = undefined;
      if (avatar) {
        avatarJs = JSON.parse(avatar);
      }
      const realName = metaData.name;
      navigation.setOptions({
        headerTitle: () => (
          <MessagingHeader
            displayName={realName}
            avatar={avatarJs}
            onPress={() => {
              openProfileModal(channel.url);
            }}
          />
        ),
      });
    }
  };

  const onPressSendMessage = (message: string) => {
    setText('');
    if (!url) conversation.url;
    if (url) {
      try {
        const sb = SendBird.getInstance();
        sb.GroupChannel.getChannel(url, (channel, err) => {
          if (err) {
            log("ERR: Can't get channel from url", url, err);
          } else {
            const userIds = channel.members.map((user) => user.userId);
            sbSendMessage({
              message,
              channel,
              userIds,
            })
              .then((newMsg) => {
                addMessage(newMsg);

                if (
                  channel.customType !== 'group' &&
                  channel.customType !== 'event'
                ) {
                  // update switches (progress bar)
                  const params = new sb.GroupChannelParams();
                  const dataDic = JSON.parse(channel.data);

                  // updating SB switch data
                  if (dataDic.lastSpeaker != id) {
                    dataDic.lastSpeaker = id;
                    dataDic.switches += 1;
                    // dataDic.switches = 0;
                    updateProgressBar(dataDic.switches, channel);
                    params.data = JSON.stringify(dataDic);
                    channel.updateChannel(params, (gc, err) => {});
                  }
                }
              })
              .catch((err) => console.log(err));
            analytics.logEvent(
              {
                name: 'CHAT MESSAGE SEND',
                data: {
                  chatId: url,
                  message: message,
                  type: conversation?.customType,
                },
              },
              true,
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.info('NO CHANNEL URL1');
    }
  };

  const onPressSendFileMessage = (file: string, type: string) => {
    setText('');

    if (url) {
      const sb = SendBird.getInstance();
      sb.GroupChannel.getChannel(url, (channel, err) => {
        if (err) {
          log("ERR: Can't get channel from url", url, err);
        } else {
          console.log('sending file messages');
          sbSendFileMessage({
            file,
            type,
            currentUser,
            channel,
          }).then((newMsg) => {
            addMessage(newMsg);

            if (
              channel.customType !== 'group' &&
              channel.customType !== 'event'
            ) {
              // update switches (progress bar)
              const params = new sb.GroupChannelParams();
              const dataDic = JSON.parse(channel.data);

              // updating SB switch data
              if (dataDic.lastSpeaker != id) {
                dataDic.lastSpeaker = id;
                dataDic.switches += 1;
                updateProgressBar(dataDic.switches, channel);
                params.data = JSON.stringify(dataDic);
                channel.updateChannel(params, (gc, err) => {});
              }
            }
          });

          analytics.logEvent(
            {
              name: `CHAT ${type.toUpperCase()} SEND`,
              data: {
                chatId: url,
                type: conversation?.customType,
                file,
              },
            },
            true,
          );
        }
      });
    } else {
      console.info('NO CHANNEL URL2');
    }
  };

  const renderItem = ({ item, index }: { index: number; item: StdMessage }) => {
    if (item.isAdminMessage()) {
      return (
        <Paragraph
          style={{ alignSelf: 'center', margin: 16 }}
          color={colors.gray}>
          {(item as AdminMessage).message}
        </Paragraph>
      );
    }

    const { _sender } = item;
    // if (item.reactions.length > 0) {
    // }
    const isLastItem =
      index == messagesState.length - 1 || messagesState.length == 0;
    const previousItemIndex = isLastItem ? index : index + 1; // if last item, set same index
    const messageDateParam: TMessageDate = {
      date: item.createdAt,
      prevDate: messagesState[previousItemIndex].createdAt,
      isFirstMessage: isLastItem, // last index b/c of  inverted
    };

    const differentSender =
      messagesState[previousItemIndex].isAdminMessage() ||
      (!!messagesState[previousItemIndex].sender &&
        messagesState[previousItemIndex].sender.userId !== item.sender.userId);

    const nextItemIndex = index - 1;
    const differentNextSender =
      index == 0
        ? true
        : messagesState[nextItemIndex].isAdminMessage() ||
          (messagesState[nextItemIndex].sender &&
            messagesState[nextItemIndex].sender.userId !== item.sender.userId);

    let avatar;
    let name = '';
    // parsing avatar
    if (type === 'group' || type === 'event') {
      const sender = item.sender;
      const metadata = sender.metaData as MetaData;
      name = metadata.name;
      const avatarJs = metadata.avatar;
      if (avatarJs) {
        avatar = JSON.parse(avatarJs);
      }
    }

    return (
      <>
        <ChatBubbleWrapper
          right={_sender.userId === id}
          avatar={avatar}
          // right={false}
          differentSender={differentSender}
          differentNextSender={differentNextSender}
          text={
            item.isUserMessage()
              ? (item as UserMessage & SenderData).message
              : ''
          }
          item={item}
          username={
            type === 'group' || type === 'event' ? item.sender.nickname : ''
          }
          dateParam={messageDateParam}
          reactionList={item.reactions}
          avatarOnPress={() => getProfile(item.sender.userId, url)}
          onLongPress={() => {
            setSelectedMessage(item);
            setHighlighted(item.reactions);
            setPanelVisible(true);
          }}
          onPressReaction={(reaction: Reaction) => {
            const r = reactions.find((el) => el.key === reaction.key);
            if (r) {
              handleReaction(r, item);
            }
          }}
          onLongPressReaction={(reaction: Reaction) => {
            const r = reactions.find((el) => el.key === reaction.key);
            if (r) {
              // TODO when React introduces batched updates, batch these
              setSelectedMessage(item);
              setHighlighted(item.reactions);
              setPanelListVisible(true);
              setPanelVisible(true);
            }
          }}
        />
      </>
    );
  };

  const renderListFooterComponent = () => (
    // reflect over y-axis to prevent inversion
    <View style={{ transform: [{ scaleY: -1 }] }}>
      <MessagingEmptyView message="Welcome to your newest chat!" />
    </View>
  );

  const onScroll: ScrollViewProps['onScroll'] = (e) => {
    // TODO: Mark off read by message
  };

  const renderProgressBar = () => (
    <View style={styles.containerProgressBar}>
      <View style={styles.containerProgressBarTextWrap}>
        <View />
        <Paragraph
          color={colors.text}
          style={{ left: width * 0.44 - 10, position: 'absolute' }}>
          Unlock name
        </Paragraph>
        <Paragraph
          color={colors.text}
          style={{ position: 'absolute', right: 0 }}>
          Meetup
        </Paragraph>
      </View>
      <MessageProgressBar progress={localProgress} />
    </View>
  );

  const handleReaction = (
    item: reaction | any,
    message: SbMessage | any | undefined,
  ) => {
    if (message !== undefined) {
      const reactionsList = message.reactions.find((el) => el.key === item.key);
      if (reactionsList && reactionsList.userIds.find((el) => el === id)) {
        sbReactMessageRemove({
          channel: conversation,
          message: message,
          reaction: item.key,
        }).then((res) => {
          message.applyReactionEvent(res);
          setReactionUpdate(!reactionUpdate); // force rerender
          analytics.logEvent(
            {
              name: 'CHAT REACTION REMOVE',
              data: {
                chatId: conversation.url,
                reaction: item.key,
              },
            },
            true,
          );
        });
      } else {
        sbReactMessage({
          channel: conversation,
          message: message,
          reaction: item.key,
        }).then((res) => {
          message.applyReactionEvent(res);
          setReactionUpdate(!reactionUpdate); // force rerender
          analytics.logEvent(
            {
              name: 'CHAT REACTION ADD',
              data: {
                chatId: conversation.url,
                reaction: item.key,
              },
            },
            true,
          );
        });
      }
      setPanelVisible(false);
    }
  };
  const handleReply = (message: SbMessage) => {
    if (message) {
      setPanelVisible(false);
      console.log('reply to', message);
    }
  };

  const refreshMessages = () => {
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(url, (channel, err) => {
      if (err) {
        log("ERR: Couldn't get channel from url:", err);
      } else {
        const listQuery = channel.createPreviousMessageListQuery();
        listQuery.limit = 30;
        listQuery.reverse = true;
        listQuery.includeMetaArray = true;
        listQuery.includeReactions = true;
        listQuery.includeReplies = true;
        setPreviousListQuery(listQuery);
        listQuery.load((messages, err) =>
          err
            ? log('ERR: Initial message load:', err)
            : parseMessages(messages as StdMessage[]),
        );
      }
    });
  };
  const link = dynamicLinks().buildShortLink({
    link: `https://links.popmobile.app/group?id=${id1}`,
    domainUriPrefix: 'https://links.popmobile.app',
    android: {
      packageName: 'com.popsocial',
    },
    ios: {
      appStoreId: '1460938657',
      bundleId: 'com.urbubblepop.pop',
    },
    social: {
      title: displayName, // Replase with title
      descriptionText: 'Come join our Pop-in!', // Replace with Pop-in info
      imageUrl:
        'https://storage.googleapis.com/pop-app-assets/quiz/fantasyroles/Title%20Page%20Image.png',
    },
  });
  const getMessages = () => {
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(url, (channel, err) => {
      if (err) {
        log("ERR: Couldn't get channel from url:", err);
      } else {
        if (!previousListQuery) {
          const listQuery = channel.createPreviousMessageListQuery();
          listQuery.limit = 30;
          listQuery.reverse = true;
          listQuery.includeMetaArray = true;
          listQuery.includeReactions = true;
          listQuery.includeReplies = true;
          setPreviousListQuery(listQuery);
        } else {
          setIsLoadingMore(true);
          if (previousListQuery.hasMore) {
            previousListQuery.load((messages, err) => {
              if (err) {
                log("ERR: Couldn't load messages", err);
                return;
              }
              log('OK: Loading more', messages);
              parseMessages(uniqueList([...messagesState, ...messages]));
              setIsLoadingMore(false);
            });
          } else setIsLoadingMore(false);
        }
      }
    });
  };

  const reload = () => window.location.reload(true);
  const handleModalClose = () => {
    switch (prevModal) {
      case 'reaction': {
        setPanelVisible(true);
        break;
      }
      case 'sidemenu': {
        setIsSideMenuVisible(true);
        break;
      }
      default:
        return;
    }
  };

  const doSendRequest = ({ receiverId, message, card }: ISendRequest) => {
    dispatch(
      sendRequest({
        receiverId,
        message,
        card,
      }),
    );
    analytics.logEvent(
      {
        name: 'MESSASGES SCREEN SEND REQUEST',
        data: {
          chatId: conversation?.url,
          type: conversation?.customType,
          userId: receiverId,
        },
      },
      true,
    );
    closeQuickInviteModal();
  };

  const onKeyboardFocus = () => {
    _.throttle(() => {
      contentRef.current?.scrollToEnd({ animated: true });
    }, 1000)();
  };

  return (
    <KeyboardCompatibleView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Portal>
        <Modalize
          ref={inviteModalRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          // onClose={handleModalClose}
          handlePosition="inside">
          <InviteModal
            type="invite"
            channel={conversation}
            close={() => {
              setPrevModal('none');
              inviteModalRef.current?.close();
              // handleModalClose();
            }}
          />
        </Modalize>
        <Modalize
          ref={popInInviteModalRef}
          modalStyle={styles.popInInvite}
          withHandle={false}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          // onClose={handleModalClose}
          handlePosition="inside">
          <InvitePopInScreen
            type="invite"
            channel={conversation}
            close={() => {
              setPrevModal('none');
              popInInviteModalRef.current?.close();
              // handleModalClose();
            }}
          />
        </Modalize>
        <Modalize
          ref={optionsModalRef}
          modalTopOffset={Dimensions.get('screen').height - 250}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          // onClose={handleModalClose}
          withHandle={false}
          handlePosition="inside">
          <OptionsModal
            channel={conversation}
            navigation={navigation}
            openReportModal={() => toggleReportModal()}
            openMembersModal={() => toggleViewMembersModal()}
            openLeaveModal={() => toggleLeaveModal()}
            close={() => {
              setPrevModal('none');
              optionsModalRef.current?.close();
              // handleModalClose();
            }}
          />
        </Modalize>
        <Modalize
          ref={reportModalRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
            scrollEnabled: false,
          }}
          keyboardAvoidingBehavior="padding"
          modalTopOffset={Dimensions.get('screen').height * 0.2}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
            },
          ]}
          withHandle={false}
          handlePosition="inside">
          <ReportPopinModal
            channel={conversation}
            doReport={(category: string, description: string) => {
              analytics.logEvent(
                {
                  name: 'MESSASGES SCREEN POP-IN REPORT',
                  data: {
                    chatId: conversation?.url,
                    type: conversation?.customType,
                    category,
                    description,
                  },
                },
                true,
              );
              reportPopIn(category, description);
            }}
            close={() => {
              setPrevModal('none');
              reportModalRef.current?.close();
              // handleModalClose();
            }}
          />
        </Modalize>
        <Modalize
          ref={viewMembersModalRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
            scrollEnabled: false,
          }}
          modalTopOffset={Dimensions.get('screen').height * 0.1}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
            },
          ]}
          withHandle={false}
          handlePosition="inside">
          <ViewMembersModal
            channel={conversation}
            // navigation={navigation}
            onPressUser={(user: Member) => {
              analytics.logEvent(
                {
                  name: 'MESSASGES SCREEN VIEW MEMBER ',
                  data: {
                    chatId: conversation?.url,
                    type: conversation?.customType,
                    userId: user.userId,
                  },
                },
                true,
              );
              getProfile(user.userId, conversation.url);
              setIsSideMenuVisible(false);
              viewMembersModalRef.current?.close();
              // setPrevModal('sidemenu');
            }}
            close={() => {
              setPrevModal('none');
              viewMembersModalRef.current?.close();
              // handleModalClose();
            }}
            group={group}
          />
        </Modalize>
        <Modalize
          ref={leaveModalRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
            scrollEnabled: false,
          }}
          keyboardAvoidingBehavior="padding"
          modalTopOffset={Dimensions.get('screen').height * 0.2}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
            },
          ]}
          withHandle={false}
          handlePosition="inside">
          <LeavePopinModal
            channel={conversation}
            navigation={navigation}
            leaveChannel={() => {
              analytics.logEvent(
                {
                  name: 'MESSASGES SCREEN POP-IN LEAVE',
                  data: {
                    chatId: conversation?.url,
                    type: conversation?.customType,
                  },
                },
                true,
              );
              removeMember(id);
            }}
            close={() => {
              setPrevModal('none');
              leaveModalRef.current?.close();
            }}
          />
        </Modalize>
        <Modalize
          ref={lockModalRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
            scrollEnabled: false,
          }}
          keyboardAvoidingBehavior="padding"
          modalTopOffset={Dimensions.get('screen').height * 0.2}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
            },
          ]}
          withHandle={false}
          handlePosition="inside">
          <LockModal
            channel={conversation}
            // navigation={navigation}
            close={() => {
              setPrevModal('none');
              lockModalRef.current?.close();
              // handleModalClose();
            }}
            lock={() => {
              analytics.logEvent(
                {
                  name: 'MESSASGES SCREEN POP-IN LOCK',
                  data: {
                    chatId: conversation?.url,
                    type: conversation?.customType,
                  },
                },
                true,
              );
              if (group) {
                updateGroup({
                  id,
                  isPrivate: true,
                });
                setGroupPrivate(true);
                setInviteLocked(group.creator != id);
              }
            }}
            unlock={() => {
              analytics.logEvent(
                {
                  name: 'MESSASGES SCREEN POP-IN UNLOCK',
                  data: {
                    chatId: conversation?.url,
                    type: conversation?.customType,
                  },
                },
                true,
              );
              if (group) {
                updateGroup({
                  id,
                  isPrivate: false,
                });
                setGroupPrivate(false);
                setInviteLocked(false);
              }
            }}
            locked={groupPrivate}
            isHost={id === group?.creator}
          />
        </Modalize>
        <Modalize
          ref={profileModalRef}
          contentRef={contentRef}
          onClose={handleModalClose}
          handlePosition="inside"
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            keyboardShouldPersistTaps: 'handled',
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
            scrollEnabled: true,
          }}
          modalTopOffset={Dimensions.get('screen').height * 0.05}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
          ]}
          withHandle={false}>
          {group ? (
            <ProfileModalHost
              otherUser={otherUser}
              onClose={() => {
                setReloadPage(true);
                profileModalRef.current?.close();
              }}
              isHost={group?.creator === id}
              removeMember={(otherUserId: string) => {
                Alert.alert('Remove this user?', '', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      analytics.logEvent(
                        {
                          name: 'MESSASGES SCREEN REMOVE USER',
                          data: {
                            chatId: conversation?.url,
                            type: conversation?.customType,
                            userId: otherUserId,
                          },
                        },
                        true,
                      );
                      removeMember(otherUserId, id);
                      profileModalRef.current?.close();
                      viewMembersModalRef.current?.close();
                    },
                  },
                ]);
              }}
              close={() => {
                profileModalRef.current?.close();
              }}
              openRequestModal={onPressQuickInvite}
              navigation={navigation}
            />
          ) : (
            <ProfileModal
              otherUser={otherUser}
              onClose={() => profileModalRef.current?.close()}
            />
          )}

          {/* <CarouselModal
            isSendRequestSuccess={true}
            onKeyboardFocus={onKeyboardFocus}
            isLoading={false}
            sendRequest={sendRequest}
            data={
              otherUser
                ? {
                    ...otherUser,
                    background: otherUser.card.background,
                  }
                : {}
            }
            closeModal={() => profileModalRef.current?.close()}
          /> */}
        </Modalize>
        <Modalize
          useNativeDriver
          ref={quickInviteModalRef}
          withHandle={false}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'handled',
          }}
          // modalTopOffset={Dimensions.get('screen').height * .2}
          modalStyle={[styles.modal, { backgroundColor: 'transparent' }]}
          closeOnOverlayTap={true}>
          <QuickInviteScreen
            data={otherUser}
            onClose={closeQuickInviteModal}
            isSendRequestSuccess={isSendRequestSuccess}
            onKeyboardFocus={() => {
              // console.log('keyboard focus');
            }}
            isLoading={isLoadingSendRequest}
            sendRequest={doSendRequest}
          />
        </Modalize>
      </Portal>

      {selectedMessage !== undefined && conversation && (
        <ReactionPanel
          isList={panelListVisible}
          doReaction={(item: reaction) => {
            handleReaction(item, selectedMessage);
          }}
          doReply={(message: SbMessage) => {
            handleReply(message);
          }}
          visible={panelVisible}
          close={() => {
            setPanelVisible(false);
            setPanelListVisible(false);
          }}
          highlighted={highlighted}
          selectedMessage={selectedMessage}
          onPressUser={(uid) => {
            setPanelVisible(false);
            getProfile(uid, conversation.url);
            setPrevModal('reaction');
          }}
          conversation={conversation}
        />
      )}
      {conversation && (
        <MessagesScreenSideMenu
          visible={isSideMenuVisible}
          toggleSideMenu={toggleSideMenu}
          toggleInviteModal={() => {
            toggleInviteModal(conversation.url);
            setIsSideMenuVisible(false);
            setPrevModal('sidemenu');
          }}
          conversation={conversation}
          // members={members}
          onPressUser={(user: Member) => {
            getProfile(user.userId, conversation.url);
            setIsSideMenuVisible(false);
            setPrevModal('sidemenu');
          }}
          navigation={navigation}
        />
      )}

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
          },
          styles.keyboardPadding,
        ]}
        onLayout={() => {
          // radial menu snap to position
          interactableView.current &&
            interactableView.current.snapTo({ index: snapIndex });
        }}>
        <FlatList
          onTouchStart={() => {
            toggleButtonsActive();
          }}
          style={styles.flatlistContainer}
          onEndReached={() => getMessages()}
          onEndReachedThreshold={0}
          keyExtractor={keyExtractor}
          inverted
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            <MessagingFooter isLoadingMore={isLoadingMore} />
          }
          ListEmptyComponent={
            isLoading ? <MessagingEmptyView /> : renderListFooterComponent
          }
          onScroll={onScroll}
          renderItem={renderItem}
          data={messagesState}
          contentContainerStyle={[styles.contentContainer]}
        />

        {(conversation?.customType === 'group' ||
          conversation?.customType === 'event') && (
          <Interactable.View
            dragEnabled={!buttonsActive}
            ref={interactableView}
            snapPoints={[
              { x: 0 },
              { x: -Dimensions.get('screen').width + 120 },
            ]}
            onSnapStart={(e) => {
              setSnapIndex(e.nativeEvent.index);
              if (e.nativeEvent.index === 0) {
                setButtonPos('right');
              } else {
                setButtonPos('left');
              }
            }}
            style={{
              position: 'absolute',
              height: buttonsActive ? 170 : 60,
              width: buttonsActive ? 170 : 60,
              bottom: 70,
              right: buttonsActive && buttonPos === 'left' ? -80 : 30,
            }}>
            <RadialMenu
              isPopin={conversation?.customType === 'event'}
              onPress={() => {
                setButtonsActive(!buttonsActive);
                setTimeout(() => {
                  interactableView.current &&
                    interactableView.current.snapTo({ index: snapIndex });
                }, 50);
                analytics.logEvent(
                  {
                    name: `MESSASGES SCREEN ${
                      buttonsActive ? 'EXPAND' : 'CLOSE'
                    } RADIAL BUTTON`,
                    data: {
                      chatId: conversation?.url,
                      type: conversation?.customType,
                    },
                  },
                  true,
                );
              }}
              toggleButtons={() => {
                dispatch(
                  ChatsSlice.actions.setInviteLink(JSON.stringify(link._W)),
                );
                setButtonsActive(false);
                setTimeout(() => {
                  interactableView.current &&
                    interactableView.current.snapTo({ index: snapIndex });
                }, 50);
              }}
              actionButtonRef={actionButton}
              position={buttonPos}
              navigation={navigation}
              onLongPress={() => console.log(actionButton.current)}
              optionModal={() => toggleOptionsModal()}
              inviteModal={() => togglePopInInviteModal()}
              locked={groupPrivate}
              inviteLocked={isInviteLocked}
            />
          </Interactable.View>
        )}
        {conversation?.customType !== 'group' &&
          conversation?.customType !== 'event' &&
          msgType === 'text' &&
          renderProgressBar()}
        <MessageInput
          msgType={msgType}
          setMsgType={(type: string) => setMsgType(type)}
          onPressSendMessage={onPressSendMessage}
          onPressSendFileMessage={onPressSendFileMessage}
          onChange={setText}
          text={text}
        />
      </View>
    </KeyboardCompatibleView>
  );
};

export default MessagesScreen;
