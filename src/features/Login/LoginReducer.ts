import { createReducer } from 'typesafe-actions';
import {
  LOGIN,
  LOGIN_CHANGE_PASSWORD_FAILURE,
  LOGIN_CHANGE_PASSWORD_SUCCESS,
  LOGIN_FAILED,
  LOGIN_FORGOT_PASSWORD,
  LOGIN_FORGOT_PASSWORD_FAILURE,
  LOGIN_FORGOT_PASSWORD_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_TOKEN,
  LOGIN_VERIFY_CODE,
  LOGIN_VERIFY_CODE_FAILED,
  LOGIN_VERIFY_CODE_SUCCESS,
  LOGOUT,
} from 'features/Login/LoginTypes';
import { APP_RESTORE } from 'features/App/AppTypes';
import {
  REGISTER_RESEND_CODE,
  REGISTER_RESEND_CODE_FAILURE,
  REGISTER_RESEND_CODE_SUCCESS,
  REGISTER_SUCCESS,
} from '../Register/RegisterTypes';
import { USER_GET_PROFILE_SUCCESS } from '../User/UserTypes';

const initialState = {
  user: {},
  error: {},
  isLoading: false,
  isLoadingResend: false,
  isAuthenticated: false,
  forgotPasswordEmail: null,
  initializedForgotPassword: false,
  changePasswordSuccess: null,
  code: null,
  isVerified: false,
  token: null,
  profileLoaded: false,
  profileFail: false,
  profileLoading: false,
  verifying: false,
  status: null,
  id: null,
  isWaitlisted: false,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
        failure: false,
        error: {},
        email: action.credentials.email,
      };
    case LOGIN_TOKEN:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
        failure: false,
        error: {},
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.data,
        failure: false,
        error: {},
        token: action.data.access.token,
        id: action.data.id,
        status: action.data.status,
        isWaitlisted: action.data.isWaitlisted,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        failure: true,
        error: action.err,
      };
    case LOGIN_FORGOT_PASSWORD:
      return {
        ...state,
        forgotPasswordEmail: action.email,
        changePasswordSuccess: null,
        isLoading: true,
      };
    case LOGIN_FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        error: action.err,
        isLoading: false,
      };
    case LOGIN_FORGOT_PASSWORD_SUCCESS:
      return { ...state, initializedForgotPassword: true, isLoading: false };

    case LOGIN_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordSuccess: true,
      };
    case LOGIN_CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePasswordSuccess: false,
      };
    case LOGIN_VERIFY_CODE_SUCCESS: {
      const { data, email } = action.payload;
      return {
        ...state,
        isVerified: true,
        verifying: false,
        status: 'ACTIVE',
        isAuthenticated: true,
        isWaitlisted: data.isWaitlisted,
        email,
        waitlistingCount: data.userCount,
      };
    }
    case LOGIN_VERIFY_CODE: {
      return {
        ...state,
        code: action.code,
        verifying: true,
      };
    }
    case REGISTER_RESEND_CODE:
      return {
        ...state,
        isVerified: false,
        isLoadingResend: true,
      };
    case REGISTER_RESEND_CODE_SUCCESS:
      return {
        ...state,
        isVerified: false,
        isLoadingResend: false,
      };
    case REGISTER_RESEND_CODE_FAILURE:
      return {
        ...state,
        isVerified: false,
        isLoadingResend: false,
      };
    case LOGIN_VERIFY_CODE_FAILED:
      return {
        ...state,
        isVerified: false,
        error: action.err,
        verifying: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: action.data.token,
        id: action.data.id,
      };
    case USER_GET_PROFILE_SUCCESS:
      return {
        ...state,
        profileLoaded: true,
        profileLoading: false,
        user: {
          ...action.data,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
