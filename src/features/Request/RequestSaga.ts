import { call, put, select, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';
import * as types from './RequestTypes';
import { AuthAPI, PopApi } from 'services/api';
import {
  getStoreToken,
  getId,
  getFilters,
  getProfileInterests,
} from 'util/selectors';
import * as RequestActions from './RequestActions';
import { logError } from 'util/log';
import { getYearArrayFromClassArray } from 'util/misc';
import { initialFilters } from 'components/Modals/FilterModal/Filter';
import { ISendRequest } from 'services/types';
import Toast from 'react-native-toast-message';

function* handleSendRequest({ payload }: { payload: ISendRequest }) {
  try {
    const id = yield select(getId);
    const data = { ...payload, id };
    const response = yield call(AuthAPI.sendRequest, data);
    if (response.success === 'Successfully Send Request') {
      yield put(RequestActions.sendRequestSuccess(response));
      Toast.show({
        text1: 'Sent request!',
        type: 'success',
        position: 'bottom',
      });
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status !== 405) {
      Toast.show({
        text1: 'Just one second!',
        text2: error.response.data.error,
        type: 'info',
        position: 'bottom',
      });
    }
    yield put(RequestActions.sendRequestFailure(error));
  }
}

function* handleGetCards({ pg, shownCards }: { pg: number }) {
  try {
    const id = yield select(getId);
    const token = yield select(getStoreToken);
    const filterParam = yield select((state) => getFilters(state));
    const profile = yield select(getProfileInterests);

    const body = {
      id,
      token,
      isHomebase: filterParam.isHomebase,
      // page: pg,
    };

    const filterCompareArr = {
      ...filterParam,
      isHomebase: initialFilters.isHomebase,
    };

    const areFiltersEnabled = !_.isEqual(filterCompareArr, initialFilters);

    if (areFiltersEnabled) {
      const formatInterests = filterParam.interests.map((interest: string) =>
        _.find(profile.interests, (o) => o.title === interest),
      );

      const formattedFilterParam = {
        year: getYearArrayFromClassArray(filterParam.class),
        interests: formatInterests,
      };
      body.filterParam = {
        ...formattedFilterParam,
      };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { response, error } = yield call(PopApi.getStatusMatch, body, config);
    if (response) {
      yield put(RequestActions.getCardsSuccess(response.data.data, pg));
    } else {
      throw error;
    }
  } catch (error) {
    yield put(RequestActions.getCardsFailure(error));
  }
}

function* handleAcceptRequest({
  requesterId,
  msg,
}: {
  requesterId: string;
  msg?: string;
}) {
  try {
    const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));
    const params = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        id,
      },
    };

    const body = {
      id,
      requesterId,
      message: msg,
    };

    const { response, error } = yield call(PopApi.acceptRequest, body, params);

    if (response) {
      yield put(RequestActions.acceptRequestSuccess(response, requesterId));
    } else {
      console.log(error);
      yield put(RequestActions.acceptRequestFailure(error, requesterId));
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleGetRequests() {
  try {
    // const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));
    const requestMap = yield select((state) => state.login.user.requestQueue);
    const interests = yield select((state) => state.login.user.interest);
    const body = {
      params: {
        id,
      },
    };
    const response = yield call(AuthAPI.getRequestsQueue, body);

    if (response) {
      yield put(
        RequestActions.getRequestsSuccess(
          response.requestQueue,
          requestMap,
          interests,
        ),
      );
    } else {
      yield put(RequestActions.getRequestsFailure('err'));
    }
  } catch (error) {
    logError(error);
  }
}

function* handleRejectRequest({ requesterId }: { requesterId: string }) {
  try {
    const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));
    const params = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        id,
      },
    };
    const body = {
      id,
      requesterId,
    };

    const { response, error } = yield call(PopApi.rejectRequest, body, params);

    if (response) {
      yield handleGetRequests();
      yield put(
        RequestActions.rejectRequestSuccess(response.data, requesterId),
      );
    } else {
      yield put(RequestActions.rejectRequestFailure(error, requesterId));
    }
  } catch (err) {
    console.log(err);
  }
}

const RequestSaga = function* RequestSaga() {
  yield takeLatest(types.REQUEST, handleSendRequest);
  yield takeLatest(types.MATCH_GET_CARDS, handleGetCards);
  // yield takeLatest(types.SET_FILTERS, handleGetCards);
  yield takeLatest(types.ACCEPT_REQUEST, handleAcceptRequest);
  yield takeLatest(types.GET_REQUESTS, handleGetRequests);
  yield takeLatest(types.REJECT_REQUEST, handleRejectRequest);
};

export default RequestSaga;
