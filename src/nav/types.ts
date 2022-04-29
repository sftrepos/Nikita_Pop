import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Credentials } from 'features/Login/LoginTypes';
import { BrowseCard } from 'services/types';
import { MessagingNavParams } from 'screens/Chats/ConversationsScreen';

export type RootStackParamList = {
  INNER_STACK: undefined;
  OUTER_STACK: undefined;
  AUTH: undefined;
  WAITLIST: {
    data: { userCount: number; isWaitlisted: boolean };
    email: string;
  };
};

export type OuterStackParamList = {
  SWIPER_SCREEN: undefined;
  WELCOME_SCREEN: undefined;
  TEST_SCREEN: undefined;
  LOGIN_SCREEN: { isPasswordChanged: boolean };
  REGISTER_STACK: undefined;
  FORGOT_PASSWORD_SCREEN: undefined;
  REGISTER_VERIFY_SCREEN: undefined;
  PASSWORD_VERIFY_SCREEN: undefined;
  CHANGE_PASSWORD_SCREEN: undefined;
  ONBOARD_STACK: undefined;
};

export type RegisterStackParamList = {
  EMAIL_SCREEN: undefined;
  PASSWORD_SCREEN: undefined;
};

export type EmailScreenNavigationProp = StackNavigationProp<
  RegisterStackParamList,
  'EMAIL_SCREEN'
>;

export type PasswordScreenNavigationProp = StackNavigationProp<
  RegisterStackParamList,
  'PASSWORD_SCREEN'
>;

export type OnboardStackParamList = {
  CODENAME_SCREEN: undefined;
  GENDER_SCREEN: undefined;
  GRADYEAR_SCREEN: undefined;
  LOCATION_SCREEN: undefined;
  MAJOR_SCREEN: undefined;
  SECONDMAJOR_SCREEN: undefined;
  NAME_SCREEN: undefined;
  CONTENT_SCREEN: undefined;
  WIDGET_PICKER_SCREEN: undefined;
};

export type OnboardStackRouteProp = RouteProp<
  OnboardStackParamList,
  keyof OnboardStackParamList
>;

export type WaitlistNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'WAITLIST'
>;

export type WaitlistRouteProp = RouteProp<OuterStackParamList, 'WAITLIST'>;

export type LocationScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'LOCATION_SCREEN'
>;

export type MajorScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'MAJOR_SCREEN'
>;

export type SecondMajorScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'SECONDMAJOR_SCREEN'
>;

export type GradYearScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'GRADYEAR_SCREEN'
>;

export type GenderScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'GENDER_SCREEN'
>;

export type CodenameScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'CODENAME_SCREEN'
>;

export type NameScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'NAME_SCREEN'
>;

export type ContentScreenNavigationProp = StackNavigationProp<
  OnboardStackParamList,
  'CONTENT_SCREEN'
>;

export type WidgetPickerScreenNagivationProp = StackNavigationProp<
  OnboardStackParamList,
  'WIDGET_PICKER_SCREEN'
>;

export type ForgotPasswordNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'FORGOT_PASSWORD_SCREEN'
>;

export type RegisterVerifyNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'REGISTER_VERIFY_SCREEN'
>;

export type RegisterVerifyRouteProp = RouteProp<
  OuterStackParamList,
  'REGISTER_VERIFY_SCREEN'
>;

export type PWVerifyNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'PASSWORD_VERIFY_SCREEN'
>;

export type PWVerifyRouteProp = RouteProp<
  OuterStackParamList,
  'PASSWORD_VERIFY_SCREEN'
>;

export type WelcomeNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'WELCOME_SCREEN'
>;

export type ChangePasswordNavigationProp = StackNavigationProp<
  OuterStackParamList,
  'CHANGE_PASSWORD_SCREEN'
>;

export type SendFeedbackNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'SEND_FEEDBACK_SCREEN'
>;

export type SendFeedbackRouteProp = RouteProp<
  SettingsStackParamList,
  'SEND_FEEDBACK_SCREEN'
>;

export type CarouselExpandRouteProp = RouteProp<
  BrowseStackParamList,
  'BROWSE_CARDS_EXPAND_SCREEN'
>;

export type InnerStackParamList = {
  HOME_TABS: undefined;
  SETTINGS_STACK: undefined;
  PROFILE_STACK: undefined;
  PROFILE_EDIT_STACK: undefined;
  MESSAGING_STACK: { chatId: string; otherUserId: string };
  INTERCOM_SCREEN: undefined;
  WAITLIST: undefined;
  ONBOARD_STACK: undefined;
};

export type HomeStackParamList = {
  BROWSE_CARDS_STACK: undefined;
  RECEPTION_STACK: undefined;
  PROFILE_STACK: undefined;
  QUIZ_STACK: undefined;
  MAP_TAB: undefined;
  CREATEPOPIN_SCREEN: undefined;
  POPINDETAILS_SCREEN: undefined;
};

export type BrowseStackParamList = {
  BROWSE_CARDS_SCREEN: undefined;
  BROWSE_CARDS_EXPAND_SCREEN: { currentCardData: BrowseCard };
};

export type SettingsStackParamList = {
  VERIFY_SETTINGS_SCREEN: {
    email: string;
    ctx: 'CHANGE_PW' | 'REGISTER_ACC';
    title?: string;
  };
  SETTINGS_SCREEN: undefined;
  SETTINGS_EDIT_PROFILE_SCREEN: undefined;
  SETTINGS_EDIT_PROFILE_DATA: undefined;
  SEND_FEEDBACK_SCREEN: undefined;
  REPORT_BUG_SCREEN: { onPress: () => void };
  ABOUT_US_SCREEN: undefined;
  CHANGE_FIELD_SCREEN: {
    onPress: () => void;
    type: 'CHANGE_NAME' | 'CHANGE_EMAIL' | 'CHANGE_PW';
    label?: string;
    title: string;
  };
  CHANGE_PASSWORD_SETTINGS_SCREEN: undefined;
  THEME_SCREEN: undefined;
  SETTINGS_NOTIFICATIONS_SCREEN: undefined;
  // SETTINGS_EDIT_NOTIFICATION: undefined;
};

export type ThemeScreenRouteProp = RouteProp<
  SettingsStackParamList,
  'THEME_SCREEN'
>;

export type ThemeScreenScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'THEME_SCREEN'
>;

export type ChangePasswordSettingsScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'CHANGE_PASSWORD_SETTINGS_SCREEN'
>;

export type ChangeFieldScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'CHANGE_FIELD_SCREEN'
>;

export type ChangeFieldScreenRouteProp = RouteProp<
  SettingsStackParamList,
  'CHANGE_FIELD_SCREEN'
>;

export type CreatePopScreenNavigationProp = StackNavigationProp<
  MapStackParamList,
  'CREATEPOP_SCREEN'
>;

export type PopInDetailsScreenNavigationProp = StackNavigationProp<
  MapStackParamList,
  'POPDETAILS_SCREEN'
>;

export type ReportBugScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'REPORT_BUG_SCREEN'
>;

export type ReportBugScreenRouteProp = RouteProp<
  SettingsStackParamList,
  'REPORT_BUG_SCREEN'
>;

export type SettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'SETTINGS_SCREEN'
>;

export type SettingsRouteProp = RouteProp<
  SettingsStackParamList,
  'SETTINGS_SCREEN'
>;

export type ProfileStackParamList = {
  PROFILE_SCREEN: undefined;
};

export type GameWidgetType = {
  type: 'game';
  gameName: 'truthLie';
  sequence: number;
  gameData: {
    truth: string[];
    lie: string[];
  };
};

export type ProfileEditStackParamList = {
  PROFILE_SCREEN: undefined;
  GIPHY_WIDGET_SCREEN: undefined;
  CUSTOMIZE_AVATAR_SCREEN: undefined;
  IMAGE_BACKGROUND_WIDGET_SCREEN: undefined;
  GAME_WIDGET_SCREEN: {
    context: 'add' | 'edit';
    numWidgets: number;
    widget?: GameWidgetType;
    addWidget: (widget: GameWidgetType) => void;
  };
  QUESTIONS_WIDGET_SCREEN: undefined;
  INTERESTS_WIDGET_SCREEN: undefined;
};

export type GameWidgetNavigationProp = StackNavigationProp<
  ProfileEditStackParamList,
  'GAME_WIDGET_SCREEN'
>;

export type GameWidgetRouteProp = RouteProp<
  ProfileEditStackParamList,
  'GAME_WIDGET_SCREEN'
>;

export type ProfileEditNavigationProp = StackNavigationProp<
  ProfileEditStackParamList,
  'PROFILE_SCREEN'
>;

export type ProfileEditRouteProp = RouteProp<
  ProfileEditStackParamList,
  'PROFILE_SCREEN'
>;

export type ReceptionStackParamList = {
  CHATS_STACK: undefined;
  REQUESTS_STACK: undefined;
};

export type MapStackParamList = {
  CREATEPOP_SCREEN: { onPress: () => void };
  POPDETAILS_SCREEN: { onPress: () => void };
  // CHATS_STACK: undefined;
  // REQUESTS_STACK: undefined;
};

export type RequestsStackParamList = {
  REQUESTS_SCREEN: undefined;
  REQUESTS_CHAT_PREVIEW_SCREEN: undefined;
};

export type ChatsStackParamList = {
  CHATS_SCREEN: undefined;
};

export type MessagingNavigationProp = StackNavigationProp<
  MessagingStackParamList,
  'MESSAGING_SCREEN'
>;

export type MessagingRouteProp = RouteProp<
  MessagingStackParamList,
  'MESSAGING_SCREEN'
>;

export type MessagingStackParamList = {
  MESSAGING_SCREEN: MessagingNavParams;
  //MESSAGING_SCREEN: { chatId?: string; otherUser?: unknown; preview?: boolean };
  MESSAGING_REPORT_SCREEN: undefined;
  POPIN_DETAILS_SCREEN: any;
  POPIN_DETAILS_EDIT: any;
};

export type ChatsScreenNavigationProp = StackNavigationProp<
  ChatsStackParamList,
  'CHATS_SCREEN'
>;
