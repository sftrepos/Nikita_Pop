import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import { WidgetDisplayType, WidgetPlainType } from 'screens/Profile';

export const SERVICE_INIT = 'SERVICE_INIT';
export const SERVICE_LOADING = 'SERVICE_LOADING';
export const SERVICE_LOADED = 'SERVICE_LOADED';
export const SERVICE_ERROR = 'SERVICE_ERROR';

export type ServiceStatus =
  | typeof SERVICE_LOADED
  | typeof SERVICE_LOADING
  | typeof SERVICE_INIT
  | typeof SERVICE_ERROR;

export interface ServiceInit {
  status: typeof SERVICE_INIT;
}

export interface ServiceLoading {
  status: typeof SERVICE_LOADING;
}

export interface ServiceLoaded<T> {
  status: typeof SERVICE_LOADED;
  payload: T;
}

export interface ServiceError {
  status: typeof SERVICE_ERROR;
  error: Error;
}

export interface QuestionType {
  _id: string;
  question: string;
  popularity: number;
}

export interface InterestType {
  _id: string;
  popularity: number;
  related: string[];
  categoryId: string;
  title: string;
}

export interface GetQuestionsResponseType {
  _id: string;
  item: QuestionType[];
}

export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;

export interface UniversityData {
  gradDate: number;
  major: string;
  name: string;
  secondMajor: string;
}

export interface VerifyTokenReq {
  token: string;
}

export interface VerifyTokenRes {
  id: string;
  university: string;
  access: string;
  isAccess: boolean;
  iat: number;
  exp: number;
  status: string; // "ACTIVE"
}

export interface UniversityInformation {
  domains: string[];
  name: string;
  country: string;
}

export interface VerifyCodeSendData {
  email: string;
  password?: string;
  changePassword?: boolean;
}

export interface VerifyCodeSendRes {
  sent: boolean;
}

export interface RegisterSendData {
  email: string;
  password: string;
  deviceId: string;
}

export interface GetUniversityWaitlistCountData {
  params: {
    university: string;
  };
}

export interface GetUniversityWaitlistCountRes {
  count: number;
  msg: string;
}

export interface VerifyCodeRes {
  verified: boolean;
}

export interface VerifyCode {
  code: string;
}

export interface ChangePassword {
  email: string;
  code: string;
  password: string;
}

export interface ChangePasswordRes {
  message: string;
}

export type Token = {
  exp: number;
  token: string;
};

export interface LoginData {
  token: string;
  user: Record<string, unknown>;
  id: string;
  status: string;
}

export interface ChatSendData {
  params: {
    querySize: number;
    id: string;
  };
}

export interface IRequestItem {
  username: string;
  name: string;
  avatar: string;
  timestamp: string;
  message: string;
  widgets: WidgetDisplayType[];
  hometown: string;
  university: UniversityData;
  identityId: string;
}

export interface GetQuestionsData {
  params: {
    id: string;
  };
}

export interface PostFeedbackData {
  id: string;
  data: {
    subject: string;
    description: string;
  };
}

export type SendRequestCardType = {
  type: 'filter' | 'super' | 'regular';
  cardNum: number;
  createdAt: string;
};

export interface IGetRequestQueue {
  params: {
    id: string;
  };
}

export interface ISendRequest {
  receiverId: string;
  message: string;
  card: SendRequestCardType;
}

export interface GetWidgetData {
  params: {
    id: string;
    histmax?: number;
  };
}

export interface GetWidgetResponseData {
  onCard: WidgetDisplayType[];
}

export type HandleReportUserParams = {
  type: 'chat' | 'carousel';
  description: string;
  reportedId: string;
};

export interface ReportBugSendData {
  id: string;
  data: {
    subject: string;
    details: string;
    timestamp: number;
    userId: string;
    deviceId: string;
    deviceInfo: Record<string, unknown>;
    appInfo: {
      version: string;
      build: string;
    };
  };
}

export interface GetInterestResponseData {}

export interface DetailedUserCardData {
  msg: string;
  card: {
    university: UniversityData;
    card: {
      widgets: WidgetDisplayType[];
      background: string;
    };
    _id: string;
    identityId: string;
    username: string;
    hometown: string;
    avatar: CustomAvatarProps;
  };
}

export interface WidgetLies {
  params: {
    id: string;
    numLies: number;
  };
}

type GetSpecificUserQueryType = {
  identityId: {
    $id: string;
  };
};

export interface CreateGroup {
  name: string;
  description: string;
  emoji: string;
  creator: string;
  members: [string];
  location: {
    point: {
      type: string;
      coordinates: [number];
    };
    name: string;
    address: string;
  };
}
export interface GetSpecificUserData {
  token: string;
  id: string;
  query: GetSpecificUserQueryType;
  fields: [
    'avatar',
    'identityId',
    'interest',
    'question',
    'username',
    'name',
    'gender',
    'hometown',
    'university',
    'personality',
  ];
}

export interface Widget {
  //unfinished
  data: {
    id: string;
  };
}

export interface Interest {
  title: string;
  categoryId: string;
}

export interface Card {
  interests?: Interest[];
  type: WidgetPlainType;
  _id: string;
  sequence: number;
}

export interface BrowseCard {
  fake: boolean;
  identityId: string;
  username: string;
  timestamp: Date;
  hometown: string;
  university: UniversityData;
  avatar: CustomAvatarProps;
  card: Card;
  sharedInterests: Interest[];
  background: string;
  points: number;
  type: 'regular' | 'super';
  createdAt: Date;
  cardNum: number;
}

export interface Log {
  id: string;
  action: string;
  body: Record<string, unknown>;
  targetParam: string;
  targetType: string;
  targets: [Record<string, unknown>];
  service: string;
  timestamp: Date;
  details: string;
  location: {
    range: [number];
    country: string;
    region: string;
    eu: string;
    timezone: string;
    city: string;
    ll: [number];
    metro: number;
    area: number;
  };
  coordinates: {
    coordinates: [number];
    type: string;
  };
}

export interface Location {
  location: { lat: number; lng: number };
  accuracy: number;
}

export interface ChatUser {
  university: UniversityData;
  interest: Interest[];
  card: Card;
  _id: string;
  identityId: string;
  avatar: CustomAvatarProps;
  name: string;
  username: string;
  hometown: string;
  timestamp: number;
}

export interface PersonalityRecommendataion {
  users: [
    {
      university: UniversityData;
      card: Card;
      identityId: string;
      avatar: CustomAvatarProps;
      timestamp: number;
      username: string;
      interests: Interest[];
      hometown: string;
      sharedInterest: string[];
      background: string;
      points: number;
      type: string;
      createdAt: string;
    },
  ];
  type: string;
  personality: string;
  msg: string;
}

export interface BlockUser {
  blockedUser: string;
}

export interface UpdateLocation {
  identityId: string;
  lat: number;
  lng: number;
}

export interface JoinPopIn {
  id: string;
  members: [string];
  type: 'join';
}

export interface JoinPopInParams {
  popInId: string;
}
