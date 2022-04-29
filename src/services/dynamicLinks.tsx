// Managing FCM Notifications

// Note all Pop-based notifications are handled here (as they are FCM notifications)
// Whereas for Sendbird, ios notifications are handled in the eventhandler.tsx file, not here.
// Android's Sendbird notifications are handled here as well.

import { useEffect } from 'react';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

import { setFCMToken } from 'util/async';
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
//import NotificationToast from 'components/Toasts/NotificationToast';
import { Amplitude } from '@amplitude/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { ChatsScreenNavigationProp } from 'nav/types';
import { Middleware } from 'react-native-svg';

// handing dynamiclinks

export const DynamicLinksService = () => {
  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    // Handle dynamic link inside your own application
    if (link.url.startsWith('https://links.popmobile.app/group')) {
      // ...navigate to your offers screen
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener

    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link?.url === 'https://links.popmobile.app/group') {
          // ...set initial route as offers screen
        }
      });

    return () => unsubscribe();
  }, []);

  return null;
};
