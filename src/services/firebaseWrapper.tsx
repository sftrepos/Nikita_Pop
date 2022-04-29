import React, { ReactElement, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { getId, getStoreToken } from '../util/selectors';
import Axios from 'axios';
import { getApiUrl } from './api';
import { receiveMessageSuccess } from '../features/Chat/ChatActions';
import { Easing, Notifier, NotifierComponents } from 'react-native-notifier';
import { navigate } from 'nav/RootNavigation';
import useAnalytics from 'util/analytics/useAnalytics';
import routes from 'nav/routes';

interface firbase {
  navigation: any;
}
const FirebaseWrapper = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  //const navigation = useNavigation();
  const { isAuthenticated } = useSelector((state) => state.login);
  const id = useSelector((state) => getId(state));
  const token = useSelector((state) => getStoreToken(state));
  const dispatch = useDispatch();
  const analytics = useAnalytics();

  useEffect(() => {
    requestUserPermission().finally();
    return messaging().onMessage(async (remoteMessage) => {
      dispatch(receiveMessageSuccess(remoteMessage));
      if (
        remoteMessage.data &&
        typeof remoteMessage.data.sendbird === 'string'
      ) {
        showSendbirdForegroundNotification(remoteMessage, handleDeepLinking);
      } else {
        const { username, text, chatId }: any = remoteMessage.data;
        Notifier.showNotification({
          title: username,
          description: text,
          duration: 10000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Notification,
          showEasing: Easing.bounce,
          onHidden: () => console.log('Hidden'),
          onPress: () => handleDeepLinking({ title: username, body: text }),
          hideOnPress: false,
        });
      }
    });
    3;
  }, []);

  const handleDeepLinking = (data: any) => {
    navigate(routes.RECEPTION_STACK, {});
  };
  // Open a message from background.
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.info('FCM message app open:', remoteMessage);
    // amp.logEvent('NOTIFICATION OPEN', { ...remoteMessage });
  });
  useEffect(() => {
    if (isAuthenticated) {
      messaging()
        .getToken()
        .then((fcmToken) => {
          Axios.post(
            `${getApiUrl()}/identity/fcmtoken`,
            { fcmToken },
            {
              params: {
                id,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ).then((resp) => null);
        });
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

const showSendbirdForegroundNotification = (
  notification: any,
  handleDeepLinking: (data: any) => void,
): void => {
  const sendbirdData = JSON.parse(notification.data.sendbird);
  // show notification
  Notifier.showNotification({
    title: sendbirdData.sender.name || 'New message has arrived!',
    // title: notification.payload.sendbird.sender.name,
    description: notification.data.message,
    duration: 10000,
    showAnimationDuration: 800,
    Component: NotifierComponents.Notification,
    showEasing: Easing.bounce,
    onHidden: () => console.log('Hidden'),
    onPress: () =>
      handleDeepLinking({
        title: sendbirdData.sender.name || 'New message has arrived!',
        body: notification.data.message,
      }),
    hideOnPress: false,
  });
};

export default FirebaseWrapper;
