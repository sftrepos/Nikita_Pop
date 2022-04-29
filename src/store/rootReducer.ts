import { combineReducers } from 'redux';
import LoginReducer from 'features/Login/LoginReducer';
import AppReducer from 'features/App/AppReducer';
import ChatReducer from 'features/Chat/ChatReducer';
import RequestReducer from 'features/Request/RequestReducer';
import RegisterReducer from 'features/Register/RegisterReducer';
import WidgetReducer from 'features/Widgets/WidgetReducer';
import UserReducer from 'features/User/UserReducer';
import { WidgetDisplayType } from 'screens/Profile';
import { initialFilters } from 'components/Modals/FilterModal/Filter';
import AnalyticsSlice from 'features/Analytics/AnalyticsSlice';
import InterestSlice from 'features/Interests/InterestSlice';
import { AxiosError } from 'axios';
import ChatsSlice, { ChatsState } from 'features/Chats/ChatsSlice';
import ConversationSlice, {
  ConversationState,
} from 'features/Chats/ConversationSlice';
import PopInSlice, { PopinState } from 'features/Chats/PopInSlice';

export interface RootReducer {
  login: {
    user: Record<string, unknown>;
    error: Record<string, unknown>;
    failed: boolean;
    isLoading: boolean;
    isAuthenticated: boolean;
    isWaitlisted: boolean;
  };
  register: {
    isAuthenticated: boolean;
    isLoading: boolean;
    email: string;
    context: string;
    code: string;
  };
  app: {
    root: null;
    ready: boolean;
    background: boolean;
    foreground: boolean;
    theme: string;
  };
  widget: {
    addSuccess: boolean;
    widgets: WidgetDisplayType[];
    error: string;
    data: unknown[];
  };
  chats: ChatsState;
  conversation: ConversationState;
  popin: PopinState;
  requests: {
    failure: boolean;
    isLoadingMatches: false;
    isLoading: false;
    requestList: unknown[];
    error: unknown;
    acceptingRequest: Record<string, unknown>;
    successfulRequest: Record<string, unknown>;
    rejectRequest: Record<string, unknown>;
    index: number;
    isFiltersLoading: boolean;
    loadingRequests: boolean;
    requestsLoaded: boolean;
    loadingRequestsFail: boolean;
    requestIdInProgress: string | null;
    requestSuccess: boolean;
    clearDeck: boolean;
    sendRequestFailed: boolean;
    sendRequestError: AxiosError;
    redirectedToEditProfile: boolean;
  };
  user: {
    localUser: {
      meta: {
        setupComplete: boolean;
        tutorialStage: number;
      };
      avatar: string;
      card: {
        widgets: WidgetDisplayType[];
      };
    };
    error: Record<string, unknown>;
    failure: boolean;
    isFetching: boolean;
    setupComplete: boolean;
    settings: Record<string, unknown>;
    users: Record<string, unknown>;
    usersLoading: Record<string, unknown>;
    quizFetching: boolean;
    selectedQuiz: any;
    quiz: unknown;
    quizResult: any;
    quizSubmitting: boolean;
    quizSubmit: (quiz: any) => void;
    quizPersonalityRecommendationData: any;
    personalityRecommendationLoading: boolean;
  };
}

const rootReducer = combineReducers({
  login: LoginReducer,
  app: AppReducer,
  chats: ChatsSlice.reducer,
  conversation: ConversationSlice.reducer,
  popin: PopInSlice.reducer,
  requests: RequestReducer,
  register: RegisterReducer,
  widget: WidgetReducer,
  user: UserReducer,
  interests: InterestSlice,
  analytics: AnalyticsSlice.reducer,
});

export default rootReducer;
