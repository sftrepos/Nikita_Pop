import { AuthAPI } from 'services/api';
import { getId } from 'util/selectors';
import store from 'store/index';
import { logInfo } from 'util/deviceInfo';
import Geolocation from '@react-native-community/geolocation';

export const logEvent = (
  eventName: string,
  payload: { [key: string]: unknown },
): void => {
  try {
  } catch (e) {
    logError(e);
  }
};

export const logError = (error: Error): void => {};

export const logAnalyticsEvent = async (
  log: Record<string, unknown>,
): Promise<void> => {
  try {
    const id = getId(store.getState());
    if (!id) return;
    log = {
      ...log,
      device: await logInfo.getInfo(),
    };

    const data = {
      id,
      log,
    };

    Geolocation.getCurrentPosition(
      (info) => {
        const { coords } = info;
        // const lat: string = coords.latitude.toString();
        // const lng: string = coords.longitude.toString();

        data.log = {
          ...data.log,
          gps: info,
        };

        AuthAPI.postLog(data);
      },
      (error) => {
        // if location not enabled
        AuthAPI.postLog(data);
      },
    );
    return;
  } catch (err) {
    console.error(err);
  }
};
