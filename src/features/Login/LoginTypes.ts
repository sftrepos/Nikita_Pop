export interface LocalUserState {
  isLoggedIn: boolean;
  session: string;
  userName: string;
}

export type Credentials = {
  email: string;
  password: string;
};

export const LOGIN = 'login/LOGIN';
export const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS';
export const LOGIN_FAILED = 'login/LOGIN_FAILED';
export const LOGOUT = 'login/LOGOUT';
export const LOGIN_TOKEN = 'login/LOGIN_TOKEN';

export const LOGIN_FORGOT_PASSWORD = 'login/FORGOT_PASSWORD';
export const LOGIN_FORGOT_PASSWORD_SUCCESS = 'login/FORGOT_PASSWORD_SUCCESS';
export const LOGIN_FORGOT_PASSWORD_FAILURE = 'login/FORGOT_PASSWORD_FAILURE';
export const LOGIN_CHANGE_PASSWORD = 'login/LOGIN_CHANGE_PASSWORD';
export const LOGIN_CHANGE_PASSWORD_SUCCESS =
  'login/LOGIN_CHANGE_PASSWORD_SUCCESS';
export const LOGIN_CHANGE_PASSWORD_FAILURE =
  'login/LOGIN_CHANGE_PASSWORD_FAILURE';
export const LOGIN_VERIFY_CODE = 'login/LOGIN_VERIFY_CODE';
export const LOGIN_VERIFY_CODE_SUCCESS = 'login/LOGIN_VERIFY_CODE_SUCCESS';
export const LOGIN_VERIFY_CODE_FAILED = 'login/LOGIN_VERIFY_CODE_FAILED';

export const LOGIN_VERIFY_CODE_FAILURE = 'login/LOGIN_VERIFY_CODE_FAILURE';
