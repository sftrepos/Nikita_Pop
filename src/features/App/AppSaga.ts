import { call, takeLatest, put } from 'redux-saga/effects';
import {
  APP_LOADING,
  APP_POS_OUT,
  APP_RESTORE,
  APP_START,
  APP_UPDATE_THEME,
} from 'features/App/AppTypes';
import RNBootSplash from 'react-native-bootsplash';
import _ from 'lodash';
import { appReady, appStart, appUpdateTheme } from 'features/App/AppActions';
import { getAccessToken, getTheme, setTheme } from 'util/async';

const handleRestore = function* handleRestore() {
  const isDarkEnabled = yield call(getTheme);
  try {
    const token = yield call(getAccessToken);
    if (!token) {
      yield put(appStart({ root: APP_POS_OUT }));
    } else {
      yield put(appStart({ root: APP_POS_OUT }));
      // Found token
    }
    yield put(appReady());
  } catch (e) {
    yield put(appStart({ root: APP_POS_OUT }));
  }
};

const handleStart = function handleStart() {
  RNBootSplash.hide();
};

const handleUpdateTheme = function* handleUpdateTheme({
  payload,
}: {
  payload: boolean;
}) {
  yield call(setTheme, payload);
};

const AppSaga = function* AppSaga(): Generator {
  yield takeLatest(APP_START, handleStart);
  yield takeLatest(APP_RESTORE, handleRestore);
  yield takeLatest(APP_UPDATE_THEME, handleUpdateTheme);
};

export default AppSaga;
