import * as types from './MapTypes';
import _ from 'lodash';

const initialState = {
  localUser: {},
  error: {},
  failure: false,
  isFetching: false,
  setupComplete: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_GROUP: {
      return {
        ...state,
        localUser: action.data,
      };
    }
    default:
      return state;
  }
}
