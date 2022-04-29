import {
  AppState,
  YellowBox,
  Platform,
  PermissionsAndroid,
  AppStateStatus,
} from 'react-native';
import SendBird from 'sendbird';
import { getAccessToken } from './async';
import { logError } from './log';
import store from 'store';
import { loginToken } from 'features/Login/LoginActions';
import initAnalytics from './analytics/initAnalytics';
import messaging from '@react-native-firebase/messaging';
import { isIphone } from './phone';
import { NotificationService } from 'services';
import routes from 'nav/routes';
import { navigate, navigationRef } from 'nav/RootNavigation';

let url = undefined;
const requestLocationAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Pop Location Permission',
        message:
          'Pop needs access to your location ' + 'to give you accurate matches',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.info('PERMISSION_ANDROID_GRANTED');
    } else {
      console.info('PERMISSION_ANDROID_DENIED');
    }
  } catch (err) {
    logError(err);
  }
};

const execAndroidLocationPermissions = () => {
  if (
    Platform.OS === 'android' &&
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((res) => res)
  ) {
    requestLocationAndroid().finally();
  }
};

// Retrieve access token and place it in the store.
const dispatchToken = () => {
  const bootstrapAsync = async () => {
    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (e) {
      logError(e);
    }
    if (accessToken) {
      store.dispatch(loginToken(accessToken));
    }
  };

  bootstrapAsync().finally();
};

const handleAppStateChange = (state: AppStateStatus) => {
  const sb = SendBird.getInstance();
  if (sb) {
    switch (state) {
      case 'active': {
        sb.setForegroundState();
        console.log('APP_FOREGROUND');
        break;
      }
      case 'inactive':
        break;
      case 'background':
        console.log('APP_BACKGROUND');
        sb.setBackgroundState();
        break;
      default:
        break;
    }
  }
};

const initializeListeners = () => {
  AppState.addEventListener('change', handleAppStateChange);
};

const initializeApp = (): typeof handleAppStateChange => {
  YellowBox.ignoreWarnings(['']);
  initAnalytics();
  dispatchToken();
  execAndroidLocationPermissions();
  initializeListeners();
  console.info('APP_LAUNCHED');
  // navigate(routes.RECEPTION_STACK, {});
  return handleAppStateChange;
};

export default initializeApp;
