import { Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { loginToken, verifyCodeFailure } from '../features/Login/LoginActions';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreToken } from '../util/selectors';
import { Notifications, Notification } from 'react-native-notifications';
import { getChats, updateCurrentRoomView } from '../features/Chat/ChatActions';
import { registerStoreCode } from '../features/Register/RegisterActions';
import store from 'store';
import { Easing, Notifier } from 'react-native-notifier';
import { navigate } from 'nav/RootNavigation';
import ChatsSlice from 'features/Chats/ChatsSlice';
import ConversationSlice from 'features/Chats/ConversationSlice';
import { ChannelMetaData, MetaData } from 'screens/Chats/ConversationsScreen';
import { sbGetChannelByUrl } from './sendbird/messaging';
import generalConstants from 'constants/general';
import { useTheme } from '@react-navigation/native';
import { Amplitude } from '@amplitude/react-native';
import routes from 'nav/routes';

/*
 * Handle opening, notifications, pushed events, deep links.. etc
 * Deeplink Url Structure = pop://:domain/:type/:payload
 */

interface IDeepLink {
  domain: string;
  action: string;
  payload?: string;
}

const MAX_LENGTH = 100;

const useMount = (func: () => void) => useEffect(() => func(), []);
const decomposeUrl = (url: string): IDeepLink => {
  const urlParts: string[] = url.replace('pop://', '').split('/');
  const domain: string = urlParts[0];
  const action = urlParts[1];
  const payload = urlParts[2];

  return { domain, action, payload };
};

const handleDeepLink = (
  url: string,
  token: string,
  dispatch,
  onComplete: () => void,
) => {
  const { domain, action, payload }: IDeepLink = decomposeUrl(url);
  console.log(domain, action);
  switch (domain) {
    case 'account':
      switch (action) {
        case 'verified':
          console.log('logging in...');
          dispatch(loginToken(token));
          onComplete();
          break;
        case 'verifiedfailure':
          dispatch(
            verifyCodeFailure({
              err: 'There was an error validating your account',
            }),
          );
          onComplete();
          break;
      }
      break;
  }
};

const EventsHandler = ({ children }) => {
  const [url, setUrl] = useState<string | null>();
  const token: string | null = useSelector(getStoreToken);
  const [currentNotification, setNotification] = useState<Notification>();
  const dispatch = useDispatch();
  const amp = Amplitude.getInstance();

  const { status, isAuthenticated, isWaitlisted } = useSelector(
    (state) => state.login,
  );
  useMount(() => {
    async () => {
      // Get the deep link used to open the app
      const initialUrl: string | null = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setUrl(initialUrl);
    };
  });

  useMount(() => {
    Linking.addEventListener('url', ({ url }) => {
      console.log('LINKING_EVENT_LISTENER_URL', url);
      setUrl(url);
    });
  });

  // Commented out due to ios breaking when user opens the notification in background
  // Notifications.registerRemoteNotifications();

  // Notifications.events().registerNotificationReceivedForeground(
  //   (notification: Notification, completion) => {
  //     console.log('foreground notification', notification);
  //     amp.logEvent('NOTIFICATION FOREGROUND RECEIVE', {
  //       title: notification.title,
  //       body: notification.body,
  //     });

  //     if (notification.payload.sendbird) {
  //       const channelUrl = notification.payload.sendbird.channel.channel_url;
  //       if (channelUrl !== store.getState().chats.currentChannel) {
  //         sbGetChannelByUrl(channelUrl).then((channel) => {
  //           // parsing name from user metadata
  //           const dataDic = JSON.parse(channel.data);
  //           const otherUser = channel.members.find(
  //             (e) => e.userId === notification.payload.sendbird.sender.id,
  //           );
  //           const { name, avatar } = otherUser?.metaData as MetaData;
  //           const chatProgressPercentage =
  //             dataDic.switches / generalConstants.maxDisplayNameThresholdNumber;
  //           let displayName = '';
  //           chatProgressPercentage > generalConstants.displayNameThreshold
  //             ? (displayName = name)
  //             : (displayName = otherUser ? otherUser.nickname : '');

  //           //parsing avatar data
  //           const avatarJs = JSON.parse(avatar);

  //           const message = notification.payload.sendbird.message;
  //           const len = message.length;
  //           const truncate = len > MAX_LENGTH ? MAX_LENGTH : len;
  //           // show notification
  //           Notifier.showNotification({
  //             title: displayName,
  //             // title: notification.payload.sendbird.sender.name,
  //             description: message.substring(0, truncate),
  //             duration: 5000,
  //             showAnimationDuration: 800,
  //             showEasing: Easing.bounce,
  //             componentProps: {
  //               titleStyle: {
  //                 color: '#2FD8DC',
  //               },
  //             },
  //             onHidden: () => console.log('Hidden'),
  //             onPress: () => {
  //               dispatch(ChatsSlice.actions.setCurrentChannel(channelUrl));
  //               dispatch(
  //                 ConversationSlice.actions.setOtherUserId(
  //                   notification.payload.sendbird.sender.id,
  //                 ),
  //               );
  //               navigate('INNER_STACK', {
  //                 screen: 'MESSAGING_STACK',
  //                 params: {
  //                   screen: 'MESSAGES_SCREEN',
  //                   params: {
  //                     avatar: avatarJs,
  //                     conversation: channel,
  //                     userId: notification.payload.sendbird.sender.id,
  //                     url: channelUrl,
  //                     progress: chatProgressPercentage,
  //                     displayName,
  //                   },
  //                 },
  //               });
  //             },
  //             hideOnPress: true,
  //           });
  //         });

  //         completion({ alert: false, sound: false, badge: false });
  //       }
  //     } else {
  //       Notifier.showNotification({
  //         title: notification.title,
  //         description: notification.body,
  //         duration: 5000,
  //         showAnimationDuration: 800,
  //         showEasing: Easing.bounce,
  //         onHidden: () => console.log('Hidden'),
  //         onPress: () => {
  //           // navigationRef.current?.navigate('');
  //         },
  //         hideOnPress: true,
  //       });
  //       completion({ alert: false, sound: false, badge: false });
  //     }
  //   },
  // );
  Notifications.events().registerNotificationReceivedBackground(
    (notification: Notification, completion) => {
      console.log('background notification', notification);
      // commented cuz it logs too much
      // amp.logEvent('NOTIFICATION BACKGROUND RECEIVE', {
      //   title: notification.title,
      //   body: notification.body,
      // });
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification: Notification, completion) => {
      //console.log(`Notification opened: ${notification.payload}`);
      // Out cuz it logs too many times
      // amp.logEvent('NOTIFICATION OPEN', {
      //   title: notification.title,
      //   body: notification.body,
      // });
      console.log(notification.payload);
      handleNotification(notification);
      completion();
    },
  );

  // //Launched by notification
  // Notifications.getInitialNotification().then((notification) => {
  //   if (notification) {
  //     console.log('Launch noti', notification);
  //     setNotification(notification);
  //     amp.logEvent('NOTIFICATION OPEN', {
  //       title: notification.title,
  //       body: notification.body,
  //     });
  //   }
  // });

  // useEffect(() => {
  //   if (currentNotification) {
  //     console.log('CURRENT_NOTIFICATION', currentNotification);
  //     setNotification(null);
  //   }
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if (url && url.length > 0) {
  //     handleDeepLink(url, token, dispatch, () => setUrl(''));
  //   }
  // }, [url]);

  const handleNotification = (notification: Notification) => {
    const type: string = notification.payload.type;
    navigate(routes.RECEPTION_STACK, {});
  };

  return <>{children}</>;
};

export default EventsHandler;
