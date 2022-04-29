import { takeLatest, call, put } from 'redux-saga/effects';

import AnalyticsSlice from 'features/Analytics/AnalyticsSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { APP_RESTORE } from 'features/App/AppTypes';
import store from 'store/index';
import _ from 'lodash';
import usrDeviceInfo, { AvailableUserInfo } from 'util/deviceInfo';
import { TrackEventType } from 'util/analytics';
import { Amplitude } from '@amplitude/react-native';
import Config from 'react-native-config';

const diff = (obj: Record<string, unknown>, base: Record<string, unknown>) => {
  const changes = (
    obj: Record<string, unknown>,
    base: Record<string, unknown>,
  ) =>
    _.transform(obj, (res, val, key) => {
      if (!_.isEqual(val, base[key])) {
        res[key] =
          _.isObject(val) && _.isObject(base[key])
            ? changes(val, base[key])
            : val;
      }
    });
  return changes(obj, base);
};

const TrackEvent = function* TrackEvent({
  payload,
}: PayloadAction<TrackEventType>): Generator {
  console.log('TRACK_EVENT_SAGA_LOGIC', payload);
  yield 0;
};

const fetchDeviceInfo = async (): Promise<AvailableUserInfo | void> => {
  return await usrDeviceInfo
    .getAvailableUserInfo()
    .then((res) => res)
    .catch((err) => console.info(err));
};

const onMount = function* onMount() {
  const prevDevice = store.getState().analytics.buffer.device;
  // TODO: Diff prev buffer and load in new ones
  const info = yield call(fetchDeviceInfo);
  const amp = Amplitude.getInstance();
  yield amp.setUserProperties(info);
  if (Config.env != 'dev') {
    yield amp.logEvent('APP OPEN');
  }
  yield put(AnalyticsSlice.actions.onMount({ info }));
};

const AnalyticsSaga = function* AnalyticsSaga(): Generator {
  yield takeLatest(AnalyticsSlice.actions.trackEvent.type, TrackEvent);
  yield takeLatest(APP_RESTORE, onMount);
};

export default AnalyticsSaga;
