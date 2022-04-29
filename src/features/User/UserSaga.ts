import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  updateProfileFailure,
  updateProfileSuccess,
  getProfileFailure,
  getProfileSuccess,
  getUsersSuccess,
  getUsersFailure,
  getQuizzesFailure,
  getQuizzesSuccess,
  getQuizSuccess,
  getQuizFailure,
  submitQuizSuccess,
  submitQuizFailure,
  getQuizPersonalityRecommendationSuccess,
  getQuizPersonalityRecommendationFailure,
} from './UserActions';
import {
  USER_UPDATE_PROFILE,
  USER_GET_PROFILE,
  USER_SET_SETTING_SNOOZE,
  GET_USERS,
  GET_QUIZZES,
  GET_QUIZ,
  SUBMIT_QUIZ,
  GET_QUIZ_PERSONALITY_RECOMMENDATION,
} from './UserTypes';
import { PopApi } from 'services/api';
import { getId, getStoreToken } from 'util/selectors';
import Toast from 'react-native-toast-message';

function* handleProfileSetting({ params }) {
  switch (params) {
    case 'isSnoozeOn':
      break;
    default:
      break;
  }

  try {
    const token = yield select((state) => getStoreToken(state));
    const body = {
      token,
      snooze: params,
    };
    const { response, error } = yield call(PopApi.setSnoozeSetting, body);
  } catch (error) {}
}

function* handleUpdateProfile({ params }) {
  try {
    const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { id },
    };
    const body = {
      ...params,
    };

    const { response, error } = yield call(PopApi.updateProfile, body, config);
    if (response) {
      yield put(updateProfileSuccess(response));
    } else {
      console.log(error);
      yield put(updateProfileFailure(error.response));
      Toast.show({
        text1: 'Error updating user profile.',
        type: 'error',
        position: 'bottom',
      });
    }
  } catch (error) {
    console.log(error);
    yield put(updateProfileFailure(error.response));
    Toast.show({
      text1: 'Error updating user profile.',
      type: 'error',
      position: 'bottom',
    });
  }
}

function* handleGetProfile() {
  const token = yield select((state) => getStoreToken(state));
  const id = yield select((state) => getId(state));
  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const body = {
    id,
  };
  const { response, error } = yield call(PopApi.getProfile, body, params);

  if (response) {
    yield put(getProfileSuccess(response.data));
  } else {
    yield put(getProfileFailure());
  }
}

function* handleGetUsers({ params }) {
  const token = yield select((state) => getStoreToken(state));

  const id = yield select((state) => getId(state));
  const body = {
    token,
    id,
    query: { identityId: { $in: params } },
    fields: [
      'avatar',
      'identityId',
      'interest',
      'question',
      'username',
      'name',
      'gender',
      'hometown',
      'university',
      'personality',
    ],
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { response, error } = yield call(PopApi.getUsers, body, config);
  if (response) {
    yield put(getUsersSuccess(response));
  } else {
    console.info(error);
    yield put(getUsersFailure(error));
  }
}

function* handleGetQuizzes() {
  const token = yield select((state) => getStoreToken(state));
  const id = yield select((state) => getId(state));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      id,
    },
  };
  const { response, error } = yield call(PopApi.getQuizzes, config);

  if (response) {
    console.info(response);
    yield put(getQuizzesSuccess(response.data));
  } else {
    yield put(getQuizzesFailure(error));
  }
}

function* handleGetQuiz({ quizId }) {
  const token = yield select((state) => getStoreToken(state));
  const id = yield select((state) => getId(state));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      id,
      quizId,
    },
  };
  const { response, error } = yield call(PopApi.getQuiz, config);

  if (response) {
    console.info(response);
    yield put(getQuizSuccess(response.data));
  } else {
    console.info(error);
    yield put(getQuizFailure(error));
  }
}

function* handleSubmitQuiz({ quizId, answers }) {
  const token = yield select((state) => getStoreToken(state));
  const id = yield select((state) => getId(state));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      id,
    },
  };
  const body = {
    answers,
    quizId,
  };
  const { response, error } = yield call(PopApi.submitQuiz, body, config);

  if (response) {
    console.info(response);
    yield put(submitQuizSuccess(response.data));
  } else {
    console.info(error);
    yield put(submitQuizFailure(error));
  }
}

function* handleGetQuizPersonalityRecommendation({ id, personality }) {
  const token = yield select((state) => getStoreToken(state));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      id,
      personality,
    },
  };
  const { response, error } = yield call(
    PopApi.getPersonalityRecommendation,
    config,
  );

  if (response) {
    console.info(response);
    yield put(getQuizPersonalityRecommendationSuccess(response.data));
  } else {
    console.info(error);
    yield put(getQuizPersonalityRecommendationFailure(error));
  }
}

const UserSaga = function* UserSaga() {
  yield takeLatest(USER_UPDATE_PROFILE, handleUpdateProfile);
  yield takeLatest(USER_GET_PROFILE, handleGetProfile);
  yield takeLatest(USER_SET_SETTING_SNOOZE, handleProfileSetting);
  yield takeLatest(GET_USERS, handleGetUsers);
  yield takeLatest(GET_QUIZZES, handleGetQuizzes);
  yield takeLatest(GET_QUIZ, handleGetQuiz);
  yield takeLatest(SUBMIT_QUIZ, handleSubmitQuiz);
  yield takeLatest(
    GET_QUIZ_PERSONALITY_RECOMMENDATION,
    handleGetQuizPersonalityRecommendation,
  );
};

export default UserSaga;
