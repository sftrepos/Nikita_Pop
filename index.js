import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Amplitude } from '@amplitude/react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Android background data notification //
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

  const amp = Amplitude.getInstance();
  amp.logEvent('NOTIFICATION BACKGROUND RECEIVE', { ...remoteMessage });
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
