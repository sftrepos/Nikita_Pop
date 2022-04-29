import { useDispatch, useSelector } from 'react-redux';
import AnalyticsSlice from 'features/Analytics/AnalyticsSlice';
import { getId } from '../selectors';
import { Amplitude } from '@amplitude/react-native';
import _ from 'lodash';

export type CurrentLoggers = 'amplitude';
export const DEFAULT_LOGGER = 'amplitude';

export interface ILogEvent {
  name: string;
  logger?: CurrentLoggers;
  // TODO: Make data generic over specified payload
  data?: Record<string, unknown>;
}

export interface TrackEventType extends ILogEvent {
  id?: string;
  timestamp: number;
}

export interface IUseAnalytics {
  logEvent: (params: ILogEvent, isInstant: boolean) => void;
}
export interface AnalyticsState {
  timestamp: number | null;
}

const useAnalytics = (): IUseAnalytics => {
  const dispatch = useDispatch();
  const id = useSelector(getId);

  const logEvent = (params: ILogEvent, isInstant: boolean) => {
    const data = params?.data ?? {};
    const event: TrackEventType = {
      id: id || undefined,
      name: params.name,
      logger: params.logger || DEFAULT_LOGGER,
      timestamp: Date.now(),
      ...data,
    };

    if (isInstant) {
      const amp = Amplitude.getInstance();
      const { name } = event;
      const eventProperties = { ..._.omit(event, 'name', 'logger') };
      amp.logEvent(name, eventProperties);
      //console.log('EVENT', name);
    } else {
      dispatch(AnalyticsSlice.actions.trackEvent(event));
    }
  };

  return {
    logEvent,
  };
};

export default useAnalytics;
