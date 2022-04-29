import * as types from './RegisterTypes';

export function registerUser(credentials) {
  return {
    type: types.REGISTER,
    credentials,
  };
}

export function registerSuccess(data) {
  return {
    type: types.REGISTER_SUCCESS,
    data,
  };
}

export function registerFailed(err) {
  return {
    type: types.REGISTER_FAILED,
    err,
  };
}

export function storeEmail(email) {
  return {
    type: types.REGISTER_STORE_EMAIL,
    email,
  };
}

export function activateCode(code, callback) {
  return {
    type: types.REGISTER_VERIFY_CODE,
    code,
    callback,
  };
}

export function activateCodeSuccess(data, code) {
  return {
    type: types.REGISTER_VERIFY_CODE_SUCCESS,
    data,
    code,
  };
}

export function activateCodeFailed(err) {
  return {
    type: types.REGISTER_VERIFY_CODE_FAILED,
    err,
  };
}

export function resendCode() {
  return {
    type: types.REGISTER_RESEND_CODE,
  };
}

export function resendCodeSuccess(res) {
  return {
    type: types.REGISTER_RESEND_CODE_SUCCESS,
    res,
  };
}

export function resendCodeFailure(err) {
  return {
    type: types.REGISTER_RESEND_CODE_FAILURE,
    err,
  };
}

export function registerEmail(email) {
  return {
    type: types.REGISTER_EMAIL,
    email,
  };
}

export function registerRetry() {
  return {
    type: types.REGISTER_RETRY,
  };
}

export function resumeRegistration(email) {
  return {
    type: types.REGISTER_RESUME,
    email,
  };
}

export function registerChangePassword(email) {
  return {
    email,
    type: types.REGISTER_CHANGE_PWD,
  };
}

export function registerStoreCode(code) {
  return {
    type: types.REGISTER_STORE_CODE,
    code,
  };
}
