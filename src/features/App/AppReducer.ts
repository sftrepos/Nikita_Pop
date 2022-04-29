import {
  APP_BACKGROUND,
  APP_FOREGROUND,
  APP_READY,
  APP_RESTORE,
  APP_START,
  APP_UPDATE_THEME,
} from 'features/App/AppTypes';
import { createReducer } from 'typesafe-actions';

const initialState = {
  root: null,
  ready: false,
  background: false,
  foreground: true,
  theme: 'light',
};

const AppReducer = createReducer(initialState)
  .handleAction(APP_BACKGROUND, (state, action) => ({
    ...state,
    foreground: false,
    background: true,
  }))
  .handleAction(APP_FOREGROUND, (state, action) => ({
    ...state,
    foreground: true,
    background: false,
  }))
  .handleAction(APP_START, (state, action) => {
    return {
      ...state,
      root: action.payload,
    };
  })
  .handleAction(APP_RESTORE, (state, action) => {
    return {
      ...state,
      ready: false,
    };
  })
  .handleAction(APP_UPDATE_THEME, (state, action) => {
    return {
      ...state,
      theme: action.payload ? 'dark' : 'light',
    };
  })
  .handleAction(APP_READY, (state, action) => {
    return {
      ...state,
      ready: true,
    };
  });

export default AppReducer;
