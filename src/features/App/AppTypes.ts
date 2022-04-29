import { appRestore, appStart } from 'features/App/AppActions';

export const APP_START = 'app/START';
export const APP_RESTORE = 'app/RESTORE';
export const APP_READY = 'app/READY';
export const APP_BACKGROUND = 'app/BACKGROUND';
export const APP_FOREGROUND = 'app/FOREGROUND';
export const APP_LOADING = 'app/LOADING';

export const APP_POS_OUT = 'app/OUTSIDE';
export const APP_POS_IN = 'app/INSIDE';
export const APP_POS_LOAD = 'app/LOADING';

export type AppPositions =
  | typeof APP_POS_IN
  | typeof APP_POS_LOAD
  | typeof APP_POS_OUT;

export type AppStateActions = typeof appStart | typeof appRestore;

export const APP_UPDATE_THEME = 'app/UPDATE_THEME';
