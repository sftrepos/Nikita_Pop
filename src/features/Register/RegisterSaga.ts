import { call, put, takeLatest } from 'redux-saga/effects';
import {
  registerFailed,
  registerSuccess,
} from 'features/Register/RegisterActions';
import { PopApi } from 'services/api';
import { RegisterSendData } from 'services/types';
import { REGISTER } from 'features/Register/RegisterTypes';
import { getDeviceId } from 'react-native-device-info';
import { setAccessToken } from 'util/async';
import Toast from 'react-native-toast-message';
import ChatsSlice from 'features/Chats/ChatsSlice';
import { sbConnect, sbRegisterPushToken } from 'services/sendbird/user';

function* handleRegistration({
  credentials,
}: {
  credentials: RegisterSendData;
}) {
  try {
    const data = {
      ...credentials,
      deviceId: getDeviceId(),
    };
    const { response, error } = yield call(PopApi.register, data);
    if (response) {
      const sbToken: { expires_at: number; session_token: string } =
        response.data.sendbirdToken;
      yield put(ChatsSlice.actions.registerSBToken(sbToken));

      yield sbConnect(response.data.user.identityId, sbToken)
        .then(() => {
          console.info('SendBird connected');
          sbRegisterPushToken();
        })
        .catch((err) => console.info('SB Error:', err));

      yield put(registerSuccess(response.data));
      yield call(setAccessToken, response.data.token);
    } else {
      throw { response, error };
    }
  } catch (e) {
    if (e.error.data) {
      if (e.error.data.error === 'account_already_exists') {
        Toast.show({
          text1: 'An account already exists!',
          type: 'error',
          position: 'bottom',
        });
      }
    }
    if (e.error) yield put(registerFailed(e));
  }
}

// function* handleResendCode() {
//   let email;
//   email = yield select((state) => state.register.user.email);
//   if (!email) {
//     email = yield select((state) => state.login.email);
//   }
//   try {
//     const { response, error } = yield call(
//       PopApi.requestResendConfirmationCode,
//       { email },
//     );
//     if (response) {
//       const res = response.data.sent;
//       yield put(resendCodeSuccess(Boolean(res)));
//       Alert.alert('New code sent', `A new code has been sent to ${email}`);
//     } else {
//       Alert.alert(STRINGS.error, `We could not send a new code to ${email}`);
//       yield put(resendCodeFailure(error));
//     }
//   } catch (error) {
//     yield put(resendCodeFailure(error));
//   }
// }
//
// function* handleVerifyCode({ code }) {
//   let email;
//   email = yield select((state) => state.register.user.email);
//   if (!email) {
//     email = yield select((state) => state.login.email);
//   }
//   const token = yield select((state) => state.register.token);
//   const data = {
//     email,
//     token,
//     code,
//   };
//   try {
//     const { response, error } = yield call(
//       PopApi.activateConfirmationCode,
//       data,
//     );
//     if (response) {
//       yield put(activateCodeSuccess(response.data));
//     } else {
//       Alert.alert(error.error);
//       yield put(activateCodeFailed(error));
//     }
//   } catch (error) {}
// }

const RegisterSaga = function* root() {
  yield takeLatest(REGISTER, handleRegistration);
};

export default RegisterSaga;
