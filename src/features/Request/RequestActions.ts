import * as types from './RequestTypes';
import { IFilters, UpdateFilterType } from 'components/Modals/FilterModal';
import { Card, ISendRequest } from 'services/types';
import { AxiosError } from 'axios';

export function setFilters(data: UpdateFilterType) {
  return {
    type: types.SET_FILTERS,
    data,
  };
}

export function setAllFilters(data: IFilters) {
  // console.log('filters', data);
  return {
    type: types.SET_ALL_FILTERS,
    data,
  };
}

export function getCards(pg: number, shownCards) {
  return {
    type: types.MATCH_GET_CARDS,
    pg,
    shownCards,
  };
}

export function clearDeck() {
  return {
    type: types.MATCH_CLEAR_DECK,
  };
}

export function getCardsSuccess(cards: Card[], pg: number) {
  return {
    type: types.MATCH_GET_CARDS_SUCCESS,
    cards,
    pg,
  };
}

export function getCardsFailure(err) {
  return {
    type: types.MATCH_GET_CARDS_FAILURE,
    err,
  };
}

export function sendRequest({ receiverId, message, card }: ISendRequest): {
  type: typeof types.REQUEST;
  payload: ISendRequest;
} {
  return {
    type: types.REQUEST,
    payload: {
      receiverId,
      message,
      card,
    },
  };
}

export function sendRequestFailure(err: AxiosError) {
  return {
    type: types.REQUEST_FAILURE,
    err,
  };
}

export function sendRequestSuccess(data) {
  return {
    type: types.REQUEST_SUCCESS,
    data,
  };
}

export function acceptRequest(requesterId, msg) {
  return {
    type: types.ACCEPT_REQUEST,
    requesterId,
    msg,
  };
}

export function acceptRequestSuccess(data, requesterId) {
  return {
    type: types.ACCEPT_REQUEST_SUCCESS,
    data,
    requesterId,
  };
}

export function acceptRequestFailure(error, requesterId) {
  return {
    type: types.ACCEPT_REQUEST_FAILURE,
    error,
    requesterId,
  };
}

export function dismissRequestFailure(requesterId) {
  return {
    type: types.DISMISS_REQUEST_ERROR,
    requesterId,
  };
}

export function rejectRequest(requesterId) {
  return {
    type: types.REJECT_REQUEST,
    requesterId,
  };
}
export function rejectRequestSuccess(data, requesterId) {
  return {
    type: types.REJECT_REQUEST_SUCCESS,
    data,
    requesterId,
  };
}

export function rejectRequestFailure(error, requesterId) {
  return {
    type: types.REJECT_REQUEST_FAILURE,
    error,
    requesterId,
  };
}

export function getRequests() {
  return {
    type: types.GET_REQUESTS,
  };
}

export function getRequestsSuccess(users, requestMap = [], interests = []) {
  return {
    type: types.GET_REQUESTS_SUCCESS,
    users,
    requestMap,
    interests,
  };
}

export function getRequestsFailure(error) {
  return {
    type: types.GET_REQUESTS_FAILURE,
  };
}

export function resetRequests() {
  return {
    type: types.REQUEST_RESET,
  };
}

export function requestEditRedirect() {
  return {
    type: types.REQUEST_EDIT_REDIRECT,
  };
}
