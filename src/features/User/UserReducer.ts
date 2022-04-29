import * as types from './UserTypes';
import * as loginTypes from '../Login/LoginTypes';
import _ from 'lodash';
import { REGISTER_SUCCESS } from '../Register/RegisterTypes';
import { USER_GET_PROFILE_SUCCESS } from './UserTypes';
const initialState = {
  localUser: {},
  error: {},
  failure: false,
  isFetching: false,
  setupComplete: false,
  settings: {},
  //data bank for other users
  users: {},
  usersLoading: {},
  quizFetching: false,
  quizzes: null,
  submissions: null,
  quiz: null,
  selectedQuiz: null,
  quizPersonalityRecommendationData: null,
  showReportBlockModal: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case loginTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        localUser: action.data,
      };
    }
    case types.USER_GET_PROFILE:
      return {
        ...state,
        isFetching: true,
        error: {},
      };
    case USER_GET_PROFILE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        localUser: {
          ...action.data,
        },
      };
    case types.USER_UPDATE_PROFILE:
      return {
        ...state,
        isFetching: true,
        error: {},
      };
    case types.USER_UPDATE_PROFILE_SUCCESS:
      const user = _.mergeWith(
        state.localUser,
        action.data,
        (objValue, srcValue) => {
          if (_.isArray(objValue) || _.isObject(srcValue)) return srcValue;
        },
      );

      return {
        ...state,
        isFetching: false,
        error: initialState.error,
        localUser: user,
      };
    case types.USER_UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.err,
        failure: action.error,
      };
    case types.USER_SET_SETTING_SNOOZE:
      return {
        ...state,
        isSnoozeOn: action,
        settings: {
          ...state.settings,
          isSnoozeOn: action.params,
        },
      };
    case types.GET_USERS: {
      const loadingMap = {};
      action.params.forEach((id) => (loadingMap[id] = true));

      return {
        ...state,
        usersLoading: loadingMap,
      };
    }

    case types.GET_USERS_SUCCESS: {
      const loadingMap = { ...state.usersLoading };
      const newUsers = { ...state.users };
      action.data.users.forEach((user) => {
        loadingMap[user.identityId] = false;
        newUsers[user.identityId] = { ...user };
      });

      return {
        ...state,
        users: newUsers,
        usersLoading: loadingMap,
      };
    }
    case REGISTER_SUCCESS: {
      return {
        ...state,
        localUser: action.data.user,
      };
    }
    case loginTypes.LOGOUT:
      return initialState;

    case types.GET_QUIZZES: {
      return {
        ...state,
        quizFetching: true,
      };
    }
    case types.GET_QUIZZES_SUCCESS: {
      return {
        ...state,
        quizzes: action.data.quizzes,
        submissions: action.data.submissions,
        quizFetching: false,
      };
    }
    case types.GET_QUIZZES_FAILURE: {
      return {
        ...state,
        quizFetching: false,
        error: action.error,
      };
    }
    case types.SELECT_QUIZ: {
      return {
        ...state,
        selectedQuiz: action.quizId,
      };
    }
    case types.GET_QUIZ_SUCCESS: {
      return {
        ...state,
        quizFetching: false,
        quiz: action.data,
      };
    }
    case types.GET_QUIZ: {
      return {
        ...state,
        quizFetching: false,
      };
    }
    case types.GET_QUIZ_PERSONALITY_RECOMMENDATION: {
      return {
        ...state,
        personalityRecommendationLoading: true,
      };
    }
    case types.GET_QUIZ_PERSONALITY_RECOMMENDATION_SUCCESS: {
      return {
        ...state,
        personalityRecommendationLoading: false,
        quizPersonalityRecommendationData: action.data,
      };
    }
    case types.GET_QUIZ_PERSONALITY_RECOMMENDATION_FAILURE: {
      return {
        ...state,
        personalityRecommendationLoading: false,
        error: action.error,
      };
    }
    case types.SUBMIT_QUIZ: {
      return {
        ...state,
        quizSubmitting: true,
      };
    }
    case types.SUBMIT_QUIZ_SUCCESS: {
      return {
        ...state,
        quizResult: action.data.result,
        quizSubmitting: false,
      };
    }
    case types.SUBMIT_QUIZ_FAILURE: {
      return {
        ...state,
        quizSubmitting: false,
        error: action.error,
      };
    }
    case types.SHOW_REPORT_BLOCK_MODAL: {
      return {
        ...state,
        showReportBlockModal: action.state,
      };
    }
    case types.BLOCK_USER: {
      const blockedUserList = state.localUser.blockedUsers || [];
      const blockedSet = new Set(blockedUserList);
      blockedSet.add(action.data);
      return {
        ...state,
        localUser: {
          ...state.localUser,
          blockedUsers: Array.from(blockedSet),
        },
      };
    }
    case types.UNBLOCK_USER: {
      const blockedUserList = state.localUser.blockedUsers || [];
      const updatedBlockedUsers = blockedUserList.filter(
        (_oid) => _oid !== action.data,
      );
      return {
        ...state,
        localUser: {
          ...state.localUser,
          blockedUsers: updatedBlockedUsers,
        },
      };
    }
    case types.HIDE_PROFILE: {
      const localUserMeta = state.localUser.meta || {};
      return {
        ...state,
        localUser: {
          ...state.localUser,
          meta: {
            ...localUserMeta,
            hideProfile: action.state,
          },
        },
      };
    }
    case types.SET_IS_VACCINATED: {
      const localUserMeta = state.localUser.meta || {};
      return {
        ...state,
        localUser: {
          ...state.localUser,
          meta: {
            ...localUserMeta,
            isVaccinated: action.state,
          },
        },
      };
    }
    case types.SET_VACCINATED_MODAL_SEEN: {
      const localUserMeta = state.localUser.meta || {};
      return {
        ...state,
        localUser: {
          ...state.localUser,
          meta: {
            ...localUserMeta,
            vaccinatedModalSeen: action.state,
          },
        },
      };
    }
    default:
      return state;
  }
}
