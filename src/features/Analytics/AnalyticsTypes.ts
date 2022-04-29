export const ANALYTICS_TRACK_EVENT = 'ANALYTICS_TRACK_EVENT';

export type ScreenActionType = {
  action: string;
  time: string;
  data: Record<string, unknown>;
};

export type ScreenType = {
  screen: string;
  start: string;
  end: string;
  data: Record<string, unknown>;
  actions: ScreenActionType[];
};

export type CoordType = {
  long: number;
  lat: number;
};
