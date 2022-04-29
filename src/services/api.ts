import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
import { DependencyList, useEffect, useState } from 'react';
import _ from 'lodash';
import {
  ChangePassword,
  ChatSendData,
  BlockUser,
  GetQuestionsData,
  GetWidgetData,
  ISendRequest,
  RegisterSendData,
  ReportBugSendData,
  Service,
  SERVICE_ERROR,
  SERVICE_LOADED,
  SERVICE_LOADING,
  UniversityInformation,
  VerifyCode,
  VerifyCodeSendData,
  WidgetLies,
  Log,
  SERVICE_INIT,
  GetUniversityWaitlistCountData,
  IGetRequestQueue,
  DetailedUserCardData,
  HandleReportUserParams,
  PostFeedbackData,
  PersonalityRecommendataion,
  CreateGroup,
  UpdateLocation,
  JoinPopIn,
  JoinPopInParams,
} from 'services/types';
import { RegisterEmail } from 'util/validators';
import { Credentials } from 'features/Login/LoginTypes';
import store from 'store/index';
import { getStoreToken } from 'util/selectors';

enum ENV {
  dev = 'dev',
  prod = 'prod',
}

export const getApiUrl = (): string => {
  const { BACKEND_TEST, BACKEND_PROD, env } = Config;

  switch (env) {
    case ENV.dev:
      return BACKEND_TEST;
    case ENV.prod:
      return BACKEND_PROD;
    default:
      return '';
  }
};

export const getNotificationUrl = (): string => {
  const { BACKEND_TEST_NOTFN, BACKEND_PROD_NOTFN, env } = Config;

  switch (env) {
    case ENV.dev:
      return BACKEND_TEST_NOTFN;
    case ENV.prod:
      return BACKEND_PROD_NOTFN;
    default:
      return '';
  }
};

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  protected constructor(baseURL: string) {
    this.instance = Axios.create({ baseURL });
    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;
  protected _handleError = (error: Record<string, unknown>) =>
    Promise.reject(error);
}

const versionHeader = {
  version: Config.VERSION,
};

class PopAPI extends HttpClient {
  public constructor() {
    super(getApiUrl());
  }

  public authenticate = <T>(data: Credentials) =>
    this.instance.post<unknown, T>('/identity/authenticate', data, {
      headers: versionHeader,
    });

  public resendCode = <T>(data: VerifyCodeSendData) =>
    this.instance.post<unknown, T>('/identity/resendcode', data);

  public verifyCode = <T>(data: VerifyCode) =>
    this.instance.post<unknown, T>('/identity/code', data);

  public changePassword = <T>(data: ChangePassword) =>
    this.instance.post<unknown, T>('/identity/resetpassword', data);

  public verifyToken = <T>(data: { token: string }) =>
    this.instance.post<unknown, T>('/identity/verify', data);

  public tokenLogin = <T>(data: { token: string }) =>
    this.instance.post<unknown, T>('/identity/logintoken', data, {
      headers: versionHeader,
    });

  public getWidgets = <T>(data: GetWidgetData) => {
    return this.instance.get<unknown, T>(`/user/widgets`, data);
  };

  public register = <T>(data: RegisterSendData) => {
    this.instance.post<unknown, T>('/identity/create', data);
  };

  public getWaitlistCount = <T>(data: GetUniversityWaitlistCountData) =>
    this.instance.get<unknown, T>('/identity/waitlist', data);

  public getInterests = <T>(data) =>
    this.instance.post<unknown, T>('/user/v2/getInterests', data);

  public checkEmail = <T>(params: { email: string }) =>
    this.instance.get<unknown, T>('/identity/emailCheck', { params });
}

export class PopAPIProtected extends HttpClient {
  public constructor() {
    super(getApiUrl());
    this._initializeRequestInterceptor();
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError,
    );
  };

  private _handleRequest = async (config: AxiosRequestConfig) => {
    const token = getStoreToken(store.getState());
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  };

  public getBrowseCards = <T>(config) => {
    return this.instance.put<unknown, T>('/match/v5/list', config);
  };

  public getInterests = <T>(data) =>
    this.instance.post<unknown, T>('/user/v2/getInterests', data);

  public getChats = <T>(config: ChatSendData) =>
    this.instance.get<unknown, T>('/chat/v2/chats', config);

  public reportBug = <T>(data: ReportBugSendData) =>
    this.instance.post<unknown, T>('/user/feedback', data);

  public getQuestions = <T>(data: GetQuestionsData) =>
    this.instance.get<unknown, T>('/user/registration/questions', data);

  public postFeedback = <T>(data: PostFeedbackData): Promise<unknown> =>
    this.instance.post<unknown, T>('/user/feedback', data);

  public sendRequest = <T>(data: ISendRequest) =>
    this.instance.post<unknown, T>('/match/v3/request', data);

  public getRequestsQueue = <T>(data: IGetRequestQueue) =>
    this.instance.get<unknown, T>('/user/v2/requestQueue', data);

  public getWidgetsLies = <T>(params: WidgetLies) => {
    return this.instance.get<unknown, T>('/user/widgets/lies', params);
  };

  public getBadgeCount = <T>(params: { id: string }) =>
    this.instance.get<unknown, T>('/chat/badgeCount', { params });

  public getSpecificUserCard = <T>(params?: { id: string; userId: string }) =>
    this.instance.get<DetailedUserCardData, T>(`/user/card`, { params });

  public blockUser = <Res>(params: BlockUser): Promise<Res> =>
    this.instance.post<BlockUser, Res>(`/user/blockUser`, { params });

  public reportUser = <Res>(params: HandleReportUserParams): Promise<Res> =>
    this.instance.post<HandleReportUserParams, Res>('/user/reportUser', {
      params,
    });

  public postLog = <Res>(data: Log): Promise<Res> => {
    return this.instance.post<Log, Res>('/admin/mobile/log', data);
  };

  public putHasReviewed = <T>(data: { id: string; hasReviewed: boolean }) =>
    this.instance.put<unknown, T>('/user/hasReviewed', data);

  public addWidget = <T>(data) =>
    this.instance.post<unknown, T>('/user/widgets', data);

  public getLocationAutocomplete = <T>(params: {
    id: string;
    params: string;
  }) => this.instance.get<unknown, T>('/user/places/auto', { params });

  public getLocationInfo = <T>(params: { lat: string; lng: string }) =>
    this.instance.get<unknown, T>('/user/places/location', { params });

  public getGeneratedUsernames = <T>(params: { id: string; size?: number }) =>
    this.instance.get<string[], T>('/user/usernames', { params });

  public hideProfile = <T>(data: { id: string; hideProfile: boolean }) =>
    this.instance.put<unknown, T>('/user/settings/carousel', data);
}

export const API = new PopAPI();
export const AuthAPI = new PopAPIProtected();

export const useGetUniversityInformationHook = (
  email?: string,
): Service<UniversityInformation> => {
  const [result, setResult] = useState<Service<UniversityInformation>>({
    status: SERVICE_INIT,
  });

  const validate = () => {
    RegisterEmail.validate({ email })
      .then((_) => {
        setResult({ status: SERVICE_LOADING });
        fetch(`${getApiUrl()}/identity/university/${email}`)
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              throw response.error;
            }
            setResult({ status: SERVICE_LOADED, payload: response });
          })
          .catch((error) => setResult({ status: SERVICE_ERROR, error }));
      })
      .catch((_) => {});
  };

  useEffect(() => {
    if (email && email?.length < 5) {
      _.throttle(validate, 500)();
    } else {
      _.debounce(validate, 500)();
    }
  }, [email]);

  return result;
};

export const useServiceHook = <T, R>(
  apiServiceRoute: (data?: R) => Promise<T>,
  data?: R,
  deps?: DependencyList,
): Service<T> => {
  const [result, setResult] = useState<Service<T>>({
    status: SERVICE_INIT,
  });

  useEffect(() => {
    setResult({ status: SERVICE_LOADING });
    apiServiceRoute(data)
      .then((response) => {
        setResult({ status: SERVICE_LOADED, payload: response });
      })
      .catch((error) => {
        setResult({ status: SERVICE_ERROR, error });
      });
  }, deps || []);

  return result;
};

// 1.67

export function axiosPut(path, body, options) {
  return Axios.put(path, body, options)
    .then((response) => ({ response }))
    .catch((error) => ({ error: error.response }));
}

export function axiosDelete(path, config) {
  return Axios.delete(path, config)
    .then((response) => ({ response }))
    .catch((error) => ({ error: error.response }));
}

export function axiosPatch(path, config, options) {
  return Axios.patch(path, config, options)
    .then((response) => ({ response }))
    .catch((error) => ({ error: error.response }));
}

export function axiosPost(path, body, options) {
  //console.log('.,,.,..,....,,.<><', path, body, options);

  return Axios.post(path, body, options)
    .then((response) => ({ response }))
    .catch((error) => ({ error: error.response }));
}

export function axiosGet(path, params) {
  return Axios.get(path, params)
    .then((response) => ({ response }))
    .catch((error) => ({ error: error.response }));
}

export const PopApi = {
  register(data) {
    return axiosPost(`${getApiUrl()}/identity/create`, data);
  },

  getChats(params) {
    return axiosGet(`${getApiUrl()}/chat/v2/chats`, params);
  },

  getUsers(params, config) {
    return axiosPost(`${getApiUrl()}/user/getusers`, params, config);
  },

  getUser(params) {
    return axiosGet(`${getApiUrl()}/user/chatroomProfile`, params);
  },

  getUsernames(params) {
    return axiosGet(`${getApiUrl()}/user/usernames`, params);
  },

  setSnoozeSetting(params) {
    return axiosPost(`${getApiUrl()}/user/settings/snooze`, params);
  },

  getProfile(params, headers) {
    return axiosPost(`${getApiUrl()}/user/profile`, params, headers);
  },

  updateProfile(params, config) {
    return axiosPatch(`${getApiUrl()}/user/profile`, params, config);
  },

  getConversation(params, config) {
    return axiosGet(`${getApiUrl()}/chat/v2/conversation`, params, config);
  },

  sendMessage(params, config) {
    return axiosPost(`${getApiUrl()}/chat/messages/send/v2`, params, config);
  },
  rollNewUsername(params) {
    return axiosPost(`${getApiUrl()}/user/username/randomize`, params);
  },

  unmatchChat(params, headers) {
    return axiosPost(`${getApiUrl()}/chat/v2/archivechat`, params, headers);
  },

  sendRequest(params) {
    return axiosPost(`${getApiUrl()}/match/v3/sendRequest`, params);
  },

  getStatusMatch(params, config) {
    return axiosPut(`${getApiUrl()}/match/v6/list`, params, config);
  },

  acceptRequest(params, headers) {
    return axiosPost(`${getApiUrl()}/match/v3/acceptRequest`, params, headers);
  },

  getRequests(params, headers) {
    return axiosPost(`${getApiUrl()}/user/getrequestusers`, params, headers);
  },

  rejectRequest(params, headers) {
    return axiosPost(`${getApiUrl()}/match/rejectrequest`, params, headers);
  },

  addWidget(params, headers) {
    return axiosPost(`${getApiUrl()}/user/widgets`, params, headers);
  },

  getWidgets(params, headers) {
    return axiosGet(`${getApiUrl()}/user/widgets`, { params, headers });
  },

  getBackgroundImages(config) {
    return axiosGet(`${getApiUrl()}/user/storage/background`, config);
  },
  getQuizzes(config) {
    return axiosGet(`${getApiUrl()}/user/quizzes`, config);
  },
  getQuiz(config) {
    return axiosGet(`${getApiUrl()}/user/quiz`, config);
  },
  submitQuiz(params, headers) {
    return axiosPost(`${getApiUrl()}/user/quiz`, params, headers);
  },
  getRecommendedInterests(params) {
    return axiosGet(
      `https://recommended-interests-5auj4keuuq-uc.a.run.app/getrecommendedinterests`,
      params,
    );
  },

  addCustomInterest(params, headers) {
    return axiosPost(`${getApiUrl()}/user/v2/interests`, params, headers);
  },

  searchInterests(params, headers) {
    return axiosPost(`${getApiUrl()}/user/interest/search`, params, headers);
  },

  getPersonalityRecommendation(config) {
    return axiosGet(`${getApiUrl()}/match/personalityRecommendation`, config);
  },

  // groups
  getGroup(id, config) {
    return axiosGet(`${getApiUrl()}/groups/${id}`, config);
  },

  createGroup(params, headers) {
    return axiosPost(`${getApiUrl()}/groups/`, params, headers);
  },

  updateGroup(id, params, headers) {
    return axiosPut(`${getApiUrl()}/groups/${id}`, params, headers);
  },

  deleteGroup(id, params) {
    return axiosDelete(`${getApiUrl()}/groups/${id}`, params);
  },

  groupInvite(id, params, headers) {
    return axiosPut(`${getApiUrl()}/groups/${id}/members`, params, headers);
  },

  groupLeave(id, params, member) {
    return axiosDelete(`${getApiUrl()}/groups/${id}/members/${member}`, params);
  },

  // popins
  getPopIn(id, config) {
    return axiosGet(`${getApiUrl()}/events/${id}`, config);
  },

  updatePopIn(id, params, headers) {
    return axiosPut(`${getApiUrl()}/events/${id}`, params, headers);
  },

  deletePopIn(id, params) {
    return axiosDelete(`${getApiUrl()}/events/${id}`, params);
  },

  popInInvite(id, params, headers) {
    return axiosPut(`${getApiUrl()}/events/${id}/members`, params, headers);
  },

  popInLeave(id, params, member) {
    return axiosDelete(`${getApiUrl()}/events/${id}/members/${member}`, params);
  },

  reportPopIn(id, params, headers) {
    return axiosPost(`${getApiUrl()}/events/${id}/report`, params, headers);
  },

  updateIsVaccinated(params, headers) {
    return axiosPut(`${getApiUrl()}/user/isVaccinated`, params, headers);
  },

  updateVaccinatedModalSeen(params, headers) {
    return axiosPut(`${getApiUrl()}/user/vaccinatedModalSeen`, params, headers);
  },

  createPopIn(params, body, headers) {
    return axiosPost(`${getApiUrl()}/events/?id=${params?.id}`, body, headers);
  },

  joinPopIn(params: JoinPopInParams, body: JoinPopIn, headers) {
    return axiosPut(
      `${getApiUrl()}/events/${params?.popInId}/v2/members`,
      body,
      headers,
    );
  },

  updateLocation(params: UpdateLocation, headers) {
    return axiosPost(`${getApiUrl()}/popins/updateLocation`, params, headers);
  },
};
