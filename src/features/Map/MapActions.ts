import * as types from './MapTypes';

export function createPopIn(params: any) {
  return {
    type: types.CREATE_GROUP,
    params,
  };
}
