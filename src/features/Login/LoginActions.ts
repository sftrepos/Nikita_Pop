import { createAction } from 'typesafe-actions';
import {
  LOGIN,
  LOGIN_CHANGE_PASSWORD,
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
  LOGIN_VERIFY_CODE_FAILURE,
  LOGIN_VERIFY_CODE_SUCCESS,
  LOGOUT,
} from 'features/Login/LoginTypes';

export function login(credentials) {
  return {
    type: LOGIN,
    credentials,
  };
}

export function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
}

export function loginFailed(err) {
  return {
    type: LOGIN_FAILED,
    err,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function forgotPassword(email) {
  return {
    type: LOGIN_FORGOT_PASSWORD,
    email,
  };
}

export function forgotPasswordSuccess(email) {
  return {
    type: LOGIN_FORGOT_PASSWORD_SUCCESS,
    email,
  };
}

export function forgotPasswordFailure(err) {
  return {
    type: LOGIN_FORGOT_PASSWORD_FAILURE,
    err,
  };
}

export function changePassword({ password }) {
  return {
    type: LOGIN_CHANGE_PASSWORD,
    password,
  };
}

export function changePasswordSuccess() {
  return {
    type: LOGIN_CHANGE_PASSWORD_SUCCESS,
  };
}

export function changePasswordFailure() {
  return {
    type: LOGIN_CHANGE_PASSWORD_FAILURE,
  };
}

export function verifyCode(code) {
  return {
    type: LOGIN_VERIFY_CODE,
    code,
  };
}
export function verifyCodeSuccess(payload) {
  return {
    type: LOGIN_VERIFY_CODE_SUCCESS,
    payload,
  };
}
export function verifyCodeFailure(err) {
  return {
    type: LOGIN_VERIFY_CODE_FAILURE,
    err,
  };
}

export function loginToken(token) {
  return {
    type: LOGIN_TOKEN,
    token,
  };
}
