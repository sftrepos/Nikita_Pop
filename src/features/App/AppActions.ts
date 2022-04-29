import { createAction } from 'typesafe-actions';
import {
  APP_START,
  APP_RESTORE,
  AppPositions,
  APP_READY,
  APP_UPDATE_THEME,
} from 'features/App/AppTypes';

export const appStart = createAction(
  APP_START,
  ({ root }: { root: AppPositions }) => root,
)();
export const appRestore = createAction(APP_RESTORE)();
export const appReady = createAction(APP_READY)();
export const appUpdateTheme = createAction(
  APP_UPDATE_THEME,
  ({ isDarkModeEnabled }) => isDarkModeEnabled,
)();
