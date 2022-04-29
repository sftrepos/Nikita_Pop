import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Interest } from 'services/types';
import _ from 'lodash';

interface InterestState {
  selected: Interest[];
}

const initialState = { selected: [] } as InterestState;

const interestSlice = createSlice({
  name: 'INTEREST',
  initialState,
  reducers: {
    updateInterests(state, action: PayloadAction<Interest[]>) {
      state.selected = action.payload;
    },
    toggleInterest(state, action) {
      const removed = _.remove(state.selected, action.payload);
      if (removed.length == 0)
        state.selected = [...state.selected, action.payload];
    },
  },
});

export const { updateInterests, toggleInterest } = interestSlice.actions;
export default interestSlice.reducer;
