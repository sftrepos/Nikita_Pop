// Managing FCM Notifications

// Note all Pop-based notifications are handled here (as they are FCM notifications)
// Whereas for Sendbird, ios notifications are handled in the eventhandler.tsx file, not here.
// Android's Sendbird notifications are handled here as well.

import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { setFCMToken } from 'util/async';
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
//import NotificationToast from 'components/Toasts/NotificationToast';
import { Amplitude } from '@amplitude/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { ChatsScreenNavigationProp } from 'nav/types';

interface NotificationPayload {
  msg: {
    body: string;
    title: string;
    type: string;
  };
  ctx: string;
  navigation: any;
  route: ChatsScreenNavigationProp;
}

export const sendNotifier = (): void => {
  console.log('testingg');
  Notifier.showNotification({
    title: 'testtt',
    description: 'test',
    showAnimationDuration: 800,
    showEasing: Easing.quad,
    Component: NotifierComponents.Notification,
    hideOnPress: true,
  });
};

export const execNotificationByType = (
  notificationPayload: NotificationPayload,
) => {
  const { msg, ctx, navigation } = notificationPayload;
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.info('PushNotification has authorization:', authStatus);
  } else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.info('PushNotification has provisional access:', authStatus);
  } else {
    console.info('PushNotification authorization denied:', authStatus);
  }
}

export const NotificationService = (): void => {
  const amp = Amplitude.getInstance();
  // const nav = useNavigation();
  useEffect(() => {
    async () => await messaging().registerDeviceForRemoteMessages();
    requestUserPermission().then();
    //Listen for messages in foreground.
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.info('FCM foreground message:===', remoteMessage);
      amp.logEvent('NOTIFICATION FOREGROUND RECEIVE', { ...remoteMessage });
    });

    // Showing Sendbird background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage.data && remoteMessage.data.sendbird) {
        const payload = JSON.parse(remoteMessage.data.sendbird);
        const text =
          payload.custom_type === ''
            ? remoteMessage.data.message
            : `${payload.sender.name}: Shared a ${payload.custom_type}`;

        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'chat',
        });

        // Open a message from background

        // Link: https://notifee.app/react-native/reference/displaynotification
        await notifee
          .displayNotification({
            id: remoteMessage.messageId,
            title: 'New message has arrived!',
            //subtitle: `Number of unread messages: ${payload.unread_message_count}`,
            body: text,
            // Link: https://notifee.app/react-native/reference/notificationandroid
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              smallIcon: 'ic_notification',
              pressAction: {
                id: 'default',
              },
            },
          })
          .catch((err) => console.log(err));
      }

      //console.info('FCM setBackgroundMessageHandler: ', remoteMessage);
      amp.logEvent('NOTIFICATION BACKGROUND RECEIVE', { ...remoteMessage });
    });

    // Open a message from background.
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.info('FCM message app open:', remoteMessage);
      //amp.logEvent('NOTIFICATION OPEN', { ...remoteMessage });
    });

    // Open from quit state.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.info('FCM initial notification:', remoteMessage);
      });

    messaging()
      .getToken()
      .then(async (token) => {
        await setFCMToken(token);
      });

    messaging().onTokenRefresh((token) => setFCMToken(token));

    return unsubscribe;
  }, []);
};
