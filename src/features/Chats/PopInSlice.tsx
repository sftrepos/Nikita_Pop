import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ILocation = {
  address: string;
  name: string;
};

export type PopinState = {
  groupId: string;
  name: string;
  description: string;
  emoji: string;
  createdAt: Date;
  longitude: number;
  latitude: number;
  sendbirdId: string;
  location: ILocation;
  creator: string;
  loaded: boolean; // must be true for popin details screen to load
};

const initialState: PopinState = {
  groupId: '',
  name: '',
  description: '',
  emoji: '',
  createdAt: Date.now(),
  longitude: 0,
  latitude: 0,
  sendbirdId: '',
  location: {
    address: '',
    name: '',
  },
  creator: '',
  loaded: false,
} as const;

const PopInSlice = createSlice({
  name: 'popin',
  initialState: initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      // console.log('changing to', action.payload);
      state.name = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setEmoji(state, action: PayloadAction<string>) {
      state.emoji = action.payload;
    },
    setLongitude(state, action: PayloadAction<number>) {
      state.longitude = action.payload;
    },
    setLatitude(state, action: PayloadAction<number>) {
      state.latitude = action.payload;
    },
    setSendbirdId(state, action: PayloadAction<string>) {
      state.sendbirdId = action.payload;
    },
    setLocation(state, action: PayloadAction<ILocation>) {
      state.location = action.payload;
    },
    setCreatedAt(state, action: PayloadAction<Date>) {
      state.createdAt = action.payload;
    },
    setCreator(state, action: PayloadAction<string>) {
      state.creator = action.payload;
    },
    setGroupId(state, action: PayloadAction<string>) {
      state.groupId = action.payload;
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
  },
});

export default PopInSlice;
