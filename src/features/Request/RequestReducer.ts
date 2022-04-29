import _ from 'lodash';
import * as types from './RequestTypes';
import { LOGOUT } from 'features/Login/LoginTypes';
import { initialFilters } from 'components/Modals/FilterModal/Filter';
import { classDesignations } from 'util/misc';
import store from 'store/index';
import { BrowseCard } from 'services/types';

const initialState = {
  failure: false,
  isLoadingMatches: false,
  isLoading: false,
  requestList: [],
  error: {},
  sendRequestError: {},
  cards: [],
  acceptingRequest: {},
  failedRequest: {},
  successfulRequest: {},
  rejectRequest: {},
  requests: [],
  index: 0,
  filters: {
    class: [...classDesignations],
    interests: ['any'],
    isHomebase: true,
  },
  isFiltersLoading: false,
  loadingRequests: false,
  requestsLoaded: false,
  loadingRequestsFail: false,
  //id of receiver
  requestIdInProgress: null,
  requestSuccess: false,
  clearDeck: false,
  sendRequestFailed: false,
  redirectedToEditProfile: false,
};

export default function request(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST:
      return {
        ...state,
        requestIdInProgress: action.payload.receiverId,
        isLoading: true,
        sendRequestFailed: false,
        requestSuccess: false,
      };
    case types.REQUEST_RESET:
      return {
        ...state,
        isLoading: false,
        requestSuccess: false,
        sendRequestFailed: false,
        sendRequestError: {},
        redirectedToEditProfile: false,
      };
    case types.REQUEST_EDIT_REDIRECT:
      return {
        ...state,
        redirectedToEditProfile: true,
      };
    case types.REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        sendRequestFailed: true,
        sendRequestError: action.err,
      };
    case types.REQUEST_SUCCESS: {
      const newCards = state.cards.filter(
        (user) => user.identityId !== state.requestIdInProgress,
      );
      return {
        ...state,
        requestSuccess: true,
        sendRequestFailed: false,
        isLoading: false,
        cards: newCards,
      };
    }
    case types.MATCH_GET_CARDS:
      return {
        ...state,
        isLoadingMatches: true,
      };
    case types.MATCH_GET_CARDS_FAILURE:
      return {
        ...state,
        failure: true,
        clearDeck: false,
        isLoadingMatches: false,
        error: action.err,
      };
    case types.MATCH_GET_CARDS_SUCCESS: {
      const updatedCards = [...state.cards, ...action.cards];
      const cardIdMap = new Map();
      const uniqueCardList = [];
      for (let i = 0; i < updatedCards.length; ++i) {
        const currentCard = updatedCards[i];
        if (!cardIdMap.has(currentCard.identityId)) {
          cardIdMap.set(currentCard.identityId, currentCard);
          uniqueCardList.push(currentCard);
        }
      }
      return {
        ...state,
        cards: uniqueCardList,
        clearDeck: false,
        isLoadingMatches: false,
      };
    }
    case types.MATCH_CLEAR_DECK: {
      return {
        ...state,
        clearDeck: true,
        cards: [],
      };
    }
    case types.ACCEPT_REQUEST: {
      return {
        ...state,
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: true,
        },
      };
    }
    case types.ACCEPT_REQUEST_FAILURE: {
      return {
        ...state,
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: false,
        },
        failedRequest: {
          ...state.failedRequest,
          [action.requesterId]: true,
        },
      };
    }
    case types.ACCEPT_REQUEST_SUCCESS: {
      return {
        ...state,
        requests: state.requests.filter(
          (req) => req.request.id !== action.requesterId,
        ),
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: false,
        },
        successfulRequest: {
          ...state.successfulRequest,
          [action.requesterId]: true,
        },
        failedRequest: {
          ...state.failedRequest,
          [action.requesterId]: false,
        },
      };
    }
    case types.REJECT_REQUEST: {
      return {
        ...state,
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: true,
        },
      };
    }
    case types.REJECT_REQUEST_FAILURE: {
      return {
        ...state,
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: false,
        },
        failedRequest: {
          ...state.failedRequest,
          [action.requesterId]: true,
        },
      };
    }
    case types.REJECT_REQUEST_SUCCESS: {
      return {
        ...state,
        acceptingRequest: {
          ...state.acceptingRequest,
          [action.requesterId]: false,
        },
        rejectRequest: {
          ...state.rejectRequest,
          [action.requesterId]: true,
        },
        failedRequest: {
          ...state.failedRequest,
          [action.requesterId]: false,
        },
      };
    }
    case types.DISMISS_REQUEST_ERROR: {
      return {
        ...state,
        failedRequest: {
          ...state.failedRequest,
          [action.requesterId]: false,
        },
      };
    }
    case types.SET_FILTERS_DEFAULTS: {
      return {
        ...state,
        filters: {
          isHomebase: true,
          class: [...classDesignations],
          interests: ['any'],
        },
        isFiltersLoading: true,
      };
    }
    case types.SET_FILTERS: {
      const currentFilters = { ...state.filters };
      currentFilters[action.data.type] = action.data.filter;
      return {
        ...state,
        filters: currentFilters,
        isFiltersLoading: true,
      };
    }
    case types.SET_ALL_FILTERS: {
      const currentFilters = action.data;
      // console.log('currentfilters', currentFilters);
      return {
        ...state,
        filters: currentFilters,
        isFiltersLoading: true,
      };
    }
    case types.SET_FILTERS_FAILURE: {
      return {
        ...state,
        isFiltersLoading: false,
      };
    }
    case types.SET_FILTERS_SUCCESS: {
      return {
        ...state,
        isFiltersLoading: false,
      };
    }
    case types.GET_REQUESTS_SUCCESS: {
      //console.log('req', { action });
      let requests = action.users;

      requests = requests.map((req) => {
        const reqInfo = action.requestMap.find((r) => r.id === req.identityId);
        const sharedInterests = _.intersectionBy(
          req.interest,
          action.interests,
          'title',
        ).concat(_.intersectionBy(req.interest, action.interests, 'topic'));
        return {
          ...req,
          ...reqInfo,
          sharedInterests,
        };
      });
      // temp solution to handle corrupted data in requests[i].message and userInfo
      const newRequestList = [];
      for (let i = 0; i < requests.length; ++i) {
        if (requests[i].userInfo) {
          newRequestList.push(requests[i]);
        }
      }
      requests = newRequestList;
      return {
        ...state,
        requests,
        requestsLoaded: true,
        loadingRequests: false,
        loadingRequestsFail: false,
      };
    }
    case types.GET_REQUESTS:
      return { ...state, loadingRequests: true, loadingRequestsFail: false };
    case types.GET_REQUESTS_FAILURE:
      return {
        ...state,
        loadingRequestsFail: true,
        loadingRequests: false,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
