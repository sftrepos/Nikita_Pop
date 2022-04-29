import * as types from './UserTypes';

export function updateProfile(params) {
  return {
    type: types.USER_UPDATE_PROFILE,
    params,
  };
}

export function updateProfileSuccess({ data }) {
  return {
    type: types.USER_UPDATE_PROFILE_SUCCESS,
    data,
  };
}

export function updateProfileFailure(params) {
  return {
    type: types.USER_UPDATE_PROFILE_FAILURE,
    params,
  };
}

export function getProfile() {
  return {
    type: types.USER_GET_PROFILE,
  };
}

export function getProfileSuccess(data) {
  return {
    type: types.USER_GET_PROFILE_SUCCESS,
    data,
  };
}

export function getProfileFailure() {
  return {
    type: types.USER_GET_PROFILE_FAILURE,
  };
}

export function setSnoozeSetting(params) {
  return {
    type: types.USER_SET_SETTING_SNOOZE,
    params,
  };
}

export function getUsers(params) {
  return {
    type: types.GET_USERS,
    params,
  };
}

export function getUsersSuccess({ data }) {
  return {
    type: types.GET_USERS_SUCCESS,
    data,
  };
}

export function getUsersFailure(data) {
  return {
    type: types.GET_USERS_FAILURE,
    data,
  };
}

export function getQuizzes() {
  return {
    type: types.GET_QUIZZES,
  };
}

export function getQuizzesSuccess(data) {
  return {
    type: types.GET_QUIZZES_SUCCESS,
    data,
  };
}
export function getQuizzesFailure(error) {
  return {
    type: types.GET_QUIZZES_FAILURE,
    error,
  };
}

export function getQuizSuccess(data) {
  return {
    type: types.GET_QUIZ_SUCCESS,
    data,
  };
}
export function getQuizFailure(error) {
  return {
    type: types.GET_QUIZ_FAILURE,
    error,
  };
}

export function getQuiz(quizId: string) {
  return {
    type: types.GET_QUIZ,
    quizId,
  };
}

export function selectQuiz(quizId: string) {
  return {
    type: types.SELECT_QUIZ,
    quizId,
  };
}

export function submitQuiz(quizId: string, answers) {
  return {
    type: types.SUBMIT_QUIZ,
    quizId,
    answers,
  };
}

export function getQuizPersonalityRecommendation(
  id: string,
  personality: string,
) {
  return {
    type: types.GET_QUIZ_PERSONALITY_RECOMMENDATION,
    id,
    personality,
  };
}

export function getQuizPersonalityRecommendationSuccess(data: any) {
  return {
    type: types.GET_QUIZ_PERSONALITY_RECOMMENDATION_SUCCESS,
    data,
  };
}

export function getQuizPersonalityRecommendationFailure(error: any) {
  return {
    type: types.GET_QUIZ_PERSONALITY_RECOMMENDATION_FAILURE,
    error,
  };
}
export function submitQuizFailure(error) {
  return {
    type: types.SUBMIT_QUIZ_FAILURE,
    error,
  };
}
export function submitQuizSuccess(data) {
  return {
    type: types.SUBMIT_QUIZ_SUCCESS,
    data,
  };
}
export function showReportBlockModal(state: boolean) {
  return {
    type: types.SHOW_REPORT_BLOCK_MODAL,
    state,
  };
}
export function setBlockedUser(data: string) {
  return {
    type: types.BLOCK_USER,
    data,
  };
}
export function setUnblockedUser(data: string) {
  return {
    type: types.UNBLOCK_USER,
    data,
  };
}
export function hideProfile(state: boolean) {
  return {
    type: types.HIDE_PROFILE,
    state,
  };
}
export function setIsVaccinated(state: boolean) {
  return {
    type: types.SET_IS_VACCINATED,
    state,
  };
}
export function setVacciantedModalSeen(state: boolean) {
  return {
    type: types.SET_VACCINATED_MODAL_SEEN,
    state,
  };
}
