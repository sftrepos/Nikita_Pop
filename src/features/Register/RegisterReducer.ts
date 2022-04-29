import * as types from './RegisterTypes';
import { LOGOUT } from 'features/Login/LoginTypes';
import { CHANGE_PW, REGISTER_ACC } from 'screens/Register/RegisterVerify';

const initialState = {
  user: {},
  error: {},
  isLoading: false,
  isAuthenticated: false,
  hasEmail: false,
  isVerified: false,
  verifying: false,
  email: null,
  context: REGISTER_ACC,
  token: null,
  code: null,
};

export default function register(state = initialState, action) {
  switch (action.type) {
    case types.REGISTER:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
        failure: false,
        error: {},
        email: action.credentials.email,
      };
    case types.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: {
          ...action.data,
        },
        failure: false,
        error: action.err,
        token: action.data.token,
      };
    case types.REGISTER_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        failure: true,
        error: action.err,
      };
    case types.REGISTER_EMAIL:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        hasEmail: true,
        user: {
          ...action.email,
        },
      };
    case types.REGISTER_STORE_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case types.REGISTER_RESEND_CODE:
      return {
        ...state,
        isVerified: false,
      };
    case types.REGISTER_VERIFY_CODE: {
      return {
        ...state,
        verifying: true,
      };
    }
    case types.REGISTER_VERIFY_CODE_SUCCESS:
      return {
        ...state,
        isVerified: true,
        code: action.code,
        verifying: false,
        token: action.data.token,
      };
    case types.REGISTER_VERIFY_CODE_FAILED:
      return {
        ...state,
        isVerified: false,
        error: action.err,
        verifying: false,
      };
    case types.REGISTER_RESUME: {
      return {
        ...state,
        email: action.email,
      };
    }
    case types.REGISTER_CHANGE_PWD: {
      return {
        ...state,
        email: action.email,
        context: CHANGE_PW,
      };
    }
    case types.REGISTER_STORE_CODE: {
      return {
        ...state,
        code: action.code,
      };
    }
    case types.REGISTER_RETRY:
      return initialState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
