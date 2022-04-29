import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createGroup } from './MapActions';
import { CREATE_GROUP } from './MapTypes';
import { PopApi } from 'services/api';
import { getId, getStoreToken } from 'util/selectors';
import Toast from 'react-native-toast-message';

function* handleGroup({ name, description, emoji, creator }) {
  const token = yield select((state) => getStoreToken(state));
  const id = yield select((state) => getId(state));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      id,
    },
  };
  const body = {
    name,
    description:
      "In-person meet-up event for Pop Social Inc.'s software development team",
    emoji: 'technologist',
    creator: '608dec2f2e268200117f6e7f',
    members: ['608dec2f2e268200117f6e7f', '5e5677a039e725001343db33'],
    location: {
      point: {
        type: 'Point',
        coordinates: [-97.74300447202947, 30.279952183318787],
      },
      name: 'The University of Texas at Austin',
      address: 'The University of Texas at Austin, Austin, TX 78712',
    },
  };
  const { response, error } = yield call(
    PopApi.createPopIn,
    params,
    body,
    config,
  );

  if (response) {
    console.info(response);
    // yield put(submitQuizSuccess(response.data));
  } else {
    console.info(error);
    //  yield put(submitQuizFailure(error));
  }
}

const MapSaga = function* MapSaga() {
  yield takeLatest(CREATE_GROUP, handleGroup);
};

export default MapSaga;
