import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackEventType, DEFAULT_LOGGER } from 'util/analytics';

const initialState = {
  buffer: {
    identityId: '',
    device: {
      build: '',
      version: '',
      deviceId: '',
      systemVersion: '',
      carrier: '',
      deviceName: '',
      manufacturer: '',
      headphones: '',
      powerState: {
        lowerPowerMode: '',
        batteryLevel: '',
        batteryState: '',
      },
    },
    start: '',
    end: '',
    ip: '',
    coordinates: {
      long: undefined,
      lat: undefined,
    },
    screens: [],
    events: {},
  },
};

const AnalyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    onMount: (state, action) => {
      const { payload } = action;
      const { info } = payload;
      return { ...state, buffer: { ...state.buffer, device: info } };
    },
    trackEvent: (state, action: PayloadAction<TrackEventType>) => {
      // const { payload } = action;
      // const events = state.buffer.events;
      // if (!payload.data) {
      //   if (events.has(payload.name)) {
      //     let currentEvent = events.get(payload.name);
      //     events.set(payload.name, ++currentEvent);
      //   } else {
      //     events.set(payload.name, 0);
      //   }
      // } else {
      //   const currentEvent = events.get(payload.name);
      //   const combinedData = {
      //     data: payload.data,
      //     timestamp: payload.timestamp,
      //     logger: payload.logger || DEFAULT_LOGGER,
      //   };

      //   if (!currentEvent) {
      //     const eventData = [combinedData];
      //     events.set(payload.name, eventData);
      //   } else {
      //     events.set(payload.name, [...currentEvent, combinedData]);
      //   }
      // }

      return {
        ...state,
        buffer: {
          ...state.buffer,
        },
      };
    },
  },
});

export default AnalyticsSlice;
