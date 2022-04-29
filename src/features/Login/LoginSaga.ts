import { call, delay, put, race, take, takeLatest } from 'redux-saga/effects';
import {
  Credentials,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_TOKEN,
  LOGOUT,
} from 'features/Login/LoginTypes';
import { appStart } from 'features/App/AppActions';
import Config from 'react-native-config';
import { APP_LOADING, APP_POS_IN, APP_POS_OUT } from 'features/App/AppTypes';
import { loginFailed, loginSuccess } from 'features/Login/LoginActions';
import {
  getFCMToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
} from 'util/async';
import { uniqueDeviceId } from 'util/phone';
import { API } from 'services/api';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { logError } from 'util/log';
import { Amplitude } from '@amplitude/react-native';
import {
  sbConnect,
  sbDisconnect,
  sbRegisterPushToken,
  sbSetPushPreference,
  sbUnregisterPushToken,
  SBToken,
} from 'services/sendbird/user';
import ChatsSlice from 'features/Chats/ChatsSlice';
import * as Sentry from '@sentry/react-native';

const handleLogin = function* handleLogin({ credentials }) {
  try {
    const fcmToken = yield call(getFCMToken);
    const data = {
      ...credentials,
      deviceId: uniqueDeviceId,
      platformType: Platform.OS,
    };
    const res = yield call(API.authenticate, data);
    const { token, user, id, status, isWaitlisted } = res;
    console.log(res);
    yield call(setAccessToken, token);

    const sbToken = res?.sendbirdToken ?? '';

    const amp = Amplitude.getInstance();
    yield amp.setUserId(id);
    const userProps = {
      interests: user.interest,
      university: user.university,
      gender: user.gender,
      hometown: user.hometown,
      username: user.username,
      personality: user.personality,
    };
    yield amp.setUserProperties(userProps);
    yield put(
      loginSuccess({
        ...user,
        access: { token, sbToken },
        id,
        status,
        isWaitlisted,
      }),
    );
    return token;
  } catch (e) {
    logError(e);
    console.log(e);
    yield put(loginFailed(e));

    const status = e.response.status || 400;
    if (status === 401) {
      Toast.show({
        text1: e.response.data.error,
        type: 'error',
        position: 'bottom',
      });
    } else {
      Toast.show({
        text1: "We couldn't process your request.",
        type: 'error',
        position: 'bottom',
      });
    }
  }
  return null;
};

const authorize = function* authorize(accessToken: { token: string }) {
  try {
    const res = yield call(API.tokenLogin, {
      token: accessToken.token,
      version: Config.VERSION,
      platformType: Platform.OS,
      deviceId: uniqueDeviceId,
    });
    console.log('authorizingg');
    if (res) {
      const { isAccess, status, exp } = res.token;
      // const verifiedToken = yield call(API.verifyToken, {
      //   token: accessToken.token,
      // });
      // if (verifiedToken) {
      //   const { isAccess, status, exp } = verifiedToken;
      if (isAccess) {
        // const res = yield call(API.tokenLogin, {
        //   token: accessToken.token,
        //   version: Config.VERSION,
        //   platformType: Platform.OS,
        //   deviceId: uniqueDeviceId,
        // });
        const { user, id, isWaitlisted, sendbirdToken } = res;

        // Sentry logging
        Sentry.configureScope((scope) => {
          scope.setUser({ id, username: user.name });
        });

        Sentry.addBreadcrumb({
          category: 'auth',
          message: `Authenticated user ${user.name}-id`,
          level: Sentry.Severity.Info,
        });

        const amp = Amplitude.getInstance();
        yield amp.setUserId(id);
        const userProps = {
          interests: user.interest,
          university: user.university,
          gender: user.gender,
          hometown: user.hometown,
          username: user.username,
          personality: user.personality,
        };
        //yield branch.setIdentity(id);
        yield amp.setUserProperties(userProps);

        yield put(
          loginSuccess({
            ...user,
            status,
            id,
            access: { token: accessToken.token, sbToken: sendbirdToken },
            isWaitlisted,
          }),
        );
      }
      return { token: accessToken.token, exp: exp };
    }
    // else {
    //   throw verifiedToken;
    // }
  } catch (e) {
    logError(e);
    console.log(e);
    if (e.response?.status == 403) {
      Toast.show({
        text1: 'Update Required',
        text2: 'Please update the app to login!',
        type: 'error',
        position: 'bottom',
      });
    }

    yield put(loginFailed(e?.response?.data?.error ?? 'Something Went Wrong'));
    return null;
  }
};

const handleLogout = function* handleLogout() {
  yield sbUnregisterPushToken();
  yield sbDisconnect();
  yield call(removeAccessToken);
  yield call(removeRefreshToken);
  yield put(appStart({ root: APP_LOADING }));
  yield put(appStart({ root: APP_POS_OUT }));
};

const handleLoginSuccess = function* handleLoginSuccess({
  data,
}: {
  data: {
    identityId: string;
    access: { token: string; sbToken: SBToken };
  };
}) {
  const { identityId, access } = data;
  const { sbToken } = access;
  const amp = Amplitude.getInstance();
  yield amp.setUserId(identityId);

  // yield unleash.updateContext({ userId: identityId });
  // yield unleash.start();

  //yield branch.logout();
  yield put(ChatsSlice.actions.registerSBToken(sbToken));
  yield sbConnect(identityId, sbToken)
    .then(() => {
      console.info('SendBird connected');
      sbRegisterPushToken().then(() => {
        sbSetPushPreference();
      });
    })
    .catch((err) => console.info('SB Error:', err));
};

const LoginSaga = function* LoginSaga(): Generator {
  yield takeLatest(LOGIN_TOKEN, authorize);
  yield takeLatest(LOGIN, handleLogin);
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(LOGIN_SUCCESS, handleLoginSuccess);
};

export default LoginSaga;
