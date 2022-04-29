import React, { ReactElement, useEffect, useState } from 'react';
import {
  AboutUsScreenOptions,
  BrowseStackScreenOptions,
  ChangeFieldScreenOptions,
  CustomizeAvatarOptions,
  GameWidgetOptions,
  GiphyWidgetOptions,
  HeaderWithBack,
  ImageBackgroundWidgetOptions,
  InterestsWidgetOptions,
  MessagingScreenOptions,
  navigationStyles,
  ProfileEditOptions,
  QuestionOptions,
  ReportBugScreenOptions,
  SettingsStackOptions,
  TabScreenBarOptions,
  TabScreenOptions,
  ThemeScreenOptions,
  EditProfileOptions,
  OnboardScreenOptions,
  SendFeedbackScreenOptions,
  WidgetPickerScreenOptions,
  MapStackScreenOptions,
  CreatePopInOptions,
  PopInDetailsOptions,
  PopInEditLocationOptions,
  PopinDetailsScreenOptions,
  EditPopinDetailsOptions,
} from 'styles/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EStylesheet from 'react-native-extended-stylesheet';
import {
  BrowseStackParamList,
  ChatsStackParamList,
  HomeStackParamList,
  InnerStackParamList,
  MessagingStackParamList,
  ProfileEditStackParamList,
  ReceptionStackParamList,
  RequestsStackParamList,
  SettingsStackParamList,
  OnboardStackParamList,
} from 'nav/types';

import NameScreen from 'screens/Onboard/NameScreen';
import CodenameScreen from 'screens/Onboard/CodenameScreen';
import GenderScreen from 'screens/Onboard/GenderScreen';
import GradYearScreen from 'screens/Onboard/GradYearScreen';
import MajorScreen from 'screens/Onboard/MajorScreen';
import SecondMajorScreen from 'screens/Onboard/SecondMajorScreen';
import LocationScreen from 'screens/Onboard/LocationScreen';
import ContentScreen from 'screens/Onboard/ContentScreen';
import WidgetPickerScreen from 'screens/Onboard/WidgetPickerScreen';

import Browse from 'screens/Browse';
import Conversations from 'screens/Chats/ConversationsScreen';
import Requests from 'screens/Requests';
import Settings from 'screens/Settings';
import ReportBug from 'screens/ReportBug';
import AboutUs from 'screens/AboutUs';
import ProfileEdit from 'screens/Profile/ProfileEdit';
import GiphyWidget from 'components/Widgets/GiphyWidget';
import CustomizeAvatarScreen from 'screens/CustomizeAvatar/CutomizeAvatarScreen';
import ChangeFieldScreen from 'screens/Settings/ChangeFieldScreen';
import ChangePassword from 'screens/PasswordChange/ChangePassword';
import Verify from 'screens/Register/RegisterVerify';
import ImageBackgroundWidget from 'components/Widgets/ImageBackgroundWidget';
import GameWidget from 'components/Widgets/GameWidget';
import ThemeScreen from 'screens/Settings/ThemeScreen';
import Questions from 'screens/Questions';
import AddInterestsWidget from 'screens/AddInterestsWidget';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileData } from 'util/selectors';
import NationalScreen from 'screens/National/NationalScreen';
import { Text, View } from 'react-native';
import InterestSearch from 'components/Widgets/InterestSearch';
import { RootReducer } from 'store/rootReducer';
import QuizContainer from 'screens/Quiz/QuizContainer';
import routes from '../routes';
import QuizTakeContainer from 'screens/Quiz/QuizTakeContainer';
import EditProfile from 'screens/Settings/EditProfile';
import SendFeedback from 'screens/Settings/SendFeedback';
import RequestWidgetErrorModal from 'components/Modals/RequestWidgetErrorModal';
import { resetRequests } from 'features/Request/RequestActions';
import MessagesScreen from 'screens/Chats/MessagesScreen';
import NotificationSettings from 'screens/Settings/NotificationSettings';
import NumberBadge from 'components/NumberBadge';
import ShowMap from 'screens/Map/ShowMap';
import PopInDetailsScreen from 'screens/Chats/PopinDetailsScreen';
import CreatePopIn from 'screens/Map/CreatePopIn';
import PopInDetails from 'screens/Map/PopInDetails';
import EditPopInLocation from 'screens/Map/EditLocationScreen';
import EditPopinDetails from 'screens/Chats/EditPopinDetails';

const MessagingStack = createStackNavigator<MessagingStackParamList>();
const MessagingStackNavigator = (): ReactElement => {
  return (
    <MessagingStack.Navigator initialRouteName="MESSAGING_SCREEN" mode="modal">
      <MessagingStack.Screen
        name="MESSAGING_SCREEN"
        component={MessagesScreen}
        options={MessagingScreenOptions}
      />
      <MessagingStack.Screen
        name="POPIN_DETAILS_SCREEN"
        component={PopInDetailsScreen}
        options={PopinDetailsScreenOptions}
      />
      <MessagingStack.Screen
        name="POPIN_DETAILS_EDIT"
        component={EditPopinDetails}
        options={EditPopinDetailsOptions}
      />
    </MessagingStack.Navigator>
  );
};

const ChatsStack = createStackNavigator<ChatsStackParamList>();
const ChatsStackNavigator = (): ReactElement => {
  return (
    <ChatsStack.Navigator>
      <ChatsStack.Screen
        name="CHATS_SCREEN"
        component={Conversations}
        options={{ title: 'Messages', headerLeft: () => <></> }}
      />
    </ChatsStack.Navigator>
  );
};

const RequestsStack = createStackNavigator<RequestsStackParamList>();
const RequestsStackNavigator = (): ReactElement => {
  return (
    <RequestsStack.Navigator mode="modal">
      <RequestsStack.Screen
        name="REQUESTS_SCREEN"
        component={Requests}
        options={{ title: 'Invites', headerLeft: () => <></> }}
      />
    </RequestsStack.Navigator>
  );
};

const ReceptionStack = createBottomTabNavigator<ReceptionStackParamList>();
const ReceptionStackNavigator = ({ route }): ReactElement => {
  const tutorialStage: number = useSelector((state) => getProfileData(state))
    ?.meta?.tutorialStage;
  const setupComplete =
    useSelector((state) => state.user.localUser?.meta?.setupComplete) || false;
  const requestCount: number = useSelector(
    (state) => state.requests.requests.length,
  );
  const numUnreadChat: number = useSelector(
    (state: RootReducer) => state.chats.numUnreadChat,
  );

  // const id: string = useSelector((state) => getId(state));
  // const newMsgCount: number = Array.from(
  //   useSelector((state) => state.chats.chats).values(),
  // ).filter(
  //   (chat) =>
  //     moment(chat.lastRead[id]).isBefore(
  //       moment(chat.messages[chat.messages.length - 1]?.createdAt),
  //     ) && id !== chat.messages?.[chat.messages.length - 1]?.user?._id,
  // ).length;

  return (
    <ReceptionStack.Navigator
      tabBarOptions={{
        labelStyle: navigationStyles.textBottomTabLabel,
        tabStyle: navigationStyles.containerBottomTabStyle,
        style: navigationStyles.containerWrapperBottomTabStyle,
      }}>
      {(tutorialStage > 5 || setupComplete) && (
        <ReceptionStack.Screen
          name="CHATS_STACK"
          component={ChatsStackNavigator}
          options={{
            title: () => (
              <View style={[styles.tabRow]}>
                <Text
                  style={[
                    styles.tabTitle,
                    route?.state?.index === 0 && styles.tabSelected,
                  ]}>
                  Messages
                </Text>
                <NumberBadge number={numUnreadChat} />
              </View>
            ),
          }}
        />
      )}
      <ReceptionStack.Screen
        name="REQUESTS_STACK"
        component={RequestsStackNavigator}
        options={{
          title: () => (
            <View style={[styles.tabRow]}>
              <Text
                style={[
                  styles.tabTitle,
                  route?.state?.index === 1 && styles.tabSelected,
                ]}>
                Invites
              </Text>
              <NumberBadge number={requestCount} />
            </View>
          ),
        }}
      />
    </ReceptionStack.Navigator>
  );
};

const ProfileEditStack = createStackNavigator<ProfileEditStackParamList>();
const ProfileEditStackNavigator = (): ReactElement => {
  return (
    <ProfileEditStack.Navigator initialRouteName="PROFILE_SCREEN">
      <ProfileEditStack.Screen
        name="PROFILE_SCREEN"
        component={ProfileEdit}
        options={ProfileEditOptions}
      />
      <ProfileEditStack.Screen
        name="GIPHY_WIDGET_SCREEN"
        component={GiphyWidget}
        options={GiphyWidgetOptions}
      />
      <ProfileEditStack.Screen
        name="CUSTOMIZE_AVATAR_SCREEN"
        component={CustomizeAvatarScreen}
        options={CustomizeAvatarOptions}
      />
      <ProfileEditStack.Screen
        name="IMAGE_BACKGROUND_WIDGET_SCREEN"
        component={ImageBackgroundWidget}
        options={ImageBackgroundWidgetOptions}
      />
      <ProfileEditStack.Screen
        name="QUESTIONS_WIDGET_SCREEN"
        component={Questions}
        options={QuestionOptions}
      />
      <ProfileEditStack.Screen
        name="GAME_WIDGET_SCREEN"
        component={GameWidget}
        options={GameWidgetOptions}
      />
      <ProfileEditStack.Screen
        name="INTERESTS_WIDGET_SCREEN"
        component={AddInterestsWidget}
        options={InterestsWidgetOptions}
      />
      <ProfileEditStack.Screen
        name="INTERESTS_SEARCH_SCREEN"
        component={InterestSearch}
        options={InterestsWidgetOptions}
      />
    </ProfileEditStack.Navigator>
  );
};

const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackNavigator = (): ReactElement => {
  return (
    <SettingsStack.Navigator initialRouteName="SETTINGS_SCREEN">
      <SettingsStack.Screen
        name="SETTINGS_SCREEN"
        component={Settings}
        options={SettingsStackOptions}
      />
      <SettingsStack.Screen
        name="THEME_SCREEN"
        component={ThemeScreen}
        options={ThemeScreenOptions}
      />
      <SettingsStack.Screen
        name="REPORT_BUG_SCREEN"
        component={ReportBug}
        options={ReportBugScreenOptions}
      />
      <SettingsStack.Screen
        name="SEND_FEEDBACK_SCREEN"
        component={SendFeedback}
        options={SendFeedbackScreenOptions}
      />
      <SettingsStack.Screen
        name="ABOUT_US_SCREEN"
        component={AboutUs}
        options={AboutUsScreenOptions}
      />
      <SettingsStack.Screen
        name="CHANGE_FIELD_SCREEN"
        component={ChangeFieldScreen}
        options={ChangeFieldScreenOptions}
      />
      <SettingsStack.Screen
        name="VERIFY_SETTINGS_SCREEN"
        component={Verify}
        options={HeaderWithBack}
      />
      <SettingsStack.Screen
        name="CHANGE_PASSWORD_SETTINGS_SCREEN"
        component={ChangePassword}
        options={{}}
      />
      <SettingsStack.Screen
        name="SETTINGS_EDIT_PROFILE_SCREEN"
        component={EditProfile}
        options={EditProfileOptions}
      />
      <SettingsStack.Screen
        name="SETTINGS_NOTIFICATIONS_SCREEN"
        component={NotificationSettings}
        options={SettingsStackOptions}
      />
      <SettingsStack.Screen
        name="SETTINGS_EDIT_PROFILE_DATA"
        component={ChangeFieldScreen}
        options={EditProfileOptions}
      />
    </SettingsStack.Navigator>
  );
};

const BrowseStack = createStackNavigator<BrowseStackParamList>();
const BrowseStackNavigator = (): ReactElement => {
  const nationalUpdateChecked: boolean = useSelector((state) =>
    getProfileData(state),
  ).meta.nationalUpdateChecked;
  return (
    <BrowseStack.Navigator mode="modal">
      <BrowseStack.Screen
        name="BROWSE_CARDS_SCREEN"
        component={nationalUpdateChecked ? Browse : NationalScreen}
        options={BrowseStackScreenOptions}
      />
    </BrowseStack.Navigator>
  );
};

const MapStack = createStackNavigator<MapStackParamList>();
const MapStackNavigator = (): ReactElement => {
  return (
    <MapStack.Navigator mode="modal">
      <MapStack.Screen
        name="MAP_TAB"
        component={ShowMap}
        options={MapStackScreenOptions}
      />
      <MapStack.Screen
        name="CREATEPOPIN_SCREEN"
        component={CreatePopIn}
        options={CreatePopInOptions}
      />
      <MapStack.Screen
        name="POPINDETAILS_SCREEN"
        component={PopInDetails}
        options={PopInDetailsOptions}
      />
      <MapStack.Screen
        name="POPIN_EDIT_LOCATION_SCREEN"
        component={EditPopInLocation}
        options={PopInEditLocationOptions}
      />
    </MapStack.Navigator>
  );
};

const QuizStackNav = createStackNavigator();
const QuizStack = () => {
  return (
    <QuizStackNav.Navigator initialRouteName={routes.QUIZ_SCREEN}>
      <QuizStackNav.Screen
        name={routes.QUIZ_SCREEN}
        component={QuizContainer}
        options={{
          header: () => null,
          title: '',
        }}
      />
      <QuizStackNav.Screen
        name={routes.QUIZ_TAKE_SCREEN}
        component={QuizTakeContainer}
        options={{
          ...HeaderWithBack,
          title: '',
          gestureEnabled: false,
        }}
      />
    </QuizStackNav.Navigator>
  );
};

const HomeStack = createBottomTabNavigator<HomeStackParamList>();
const HomeStackNavigator = (): ReactElement => {
  const { university } = useSelector(getProfileData);
  //const profile = getSetupProfile(store.getState());

  // const req: number = useSelector((state) => state.requests.length);
  //const id = useSelector((state) => getSetupProfile(state));
  // const chats = useSelector((state: RootReducer) => state.chats.chats);
  // const newMsgCount: number = Array.from(chats.values()).filter((chat) => {
  //   return (
  //     moment(chat.lastRead[id]).isBefore(
  //       moment(chat.messages[chat.messages.length - 1]?.createdAt),
  //     ) && id !== chat.messages?.[chat.messages.length - 1]?.user?._id
  //   );
  // }).length;
  // const total: number = requestCount + newMsgCount;
  //console.info("profile", id)
  return (
    <HomeStack.Navigator
      screenOptions={TabScreenOptions}
      initialRouteName={'BROWSE_CARDS_STACK'}
      tabBarOptions={TabScreenBarOptions}>
      <HomeStack.Screen name="QUIZ_STACK" component={QuizStack} options={{}} />
      <HomeStack.Screen
        name="BROWSE_CARDS_STACK"
        component={BrowseStackNavigator}
        options={{}}
      />
      {university.name &&
      university.name == 'The University of Texas at Austin' ? (
        <HomeStack.Screen
          name="MAP_TAB"
          component={MapStackNavigator}
          options={{}}
        />
      ) : (
        <></>
      )}
      <HomeStack.Screen
        name="RECEPTION_STACK"
        component={ReceptionStackNavigator}
        options={{}}
      />
    </HomeStack.Navigator>
  );
};

const OnboardStack = createStackNavigator<OnboardStackParamList>();
const OnboardStackNavigator = (): ReactElement => {
  const profile = useSelector(getProfileData);

  return (
    <OnboardStack.Navigator>
      {profile.name ? null : (
        <OnboardStack.Screen
          name="NAME_SCREEN"
          component={NameScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.username ? null : (
        <OnboardStack.Screen
          name="CODENAME_SCREEN"
          component={CodenameScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.gender ? null : (
        <OnboardStack.Screen
          name="GENDER_SCREEN"
          component={GenderScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.university.gradDate ? null : (
        <OnboardStack.Screen
          name="GRADYEAR_SCREEN"
          component={GradYearScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.university.major ? null : (
        <OnboardStack.Screen
          name="MAJOR_SCREEN"
          component={MajorScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.university.secondMajor == '' ||
      profile.university.secondMajor ? null : (
        <OnboardStack.Screen
          name="SECONDMAJOR_SCREEN"
          component={SecondMajorScreen}
          options={OnboardScreenOptions}
        />
      )}
      {profile.hometown ? null : (
        <OnboardStack.Screen
          name="LOCATION_SCREEN"
          component={LocationScreen}
          options={OnboardScreenOptions}
        />
      )}
      <OnboardStack.Screen
        name="CONTENT_SCREEN"
        component={ContentScreen}
        options={OnboardScreenOptions}
      />
      <OnboardStack.Screen
        name="WIDGET_PICKER_SCREEN"
        component={WidgetPickerScreen}
        options={WidgetPickerScreenOptions}
      />
    </OnboardStack.Navigator>
  );
};

const InnerStack = createStackNavigator<InnerStackParamList>();
const InnerStackNavigator = (): ReactElement => {
  const dispatch = useDispatch();
  const { setupComplete } = useSelector(getProfileData).meta;

  const error = useSelector(
    (state: RootReducer) => state.requests.sendRequestError,
  );

  return (
    <>
      <InnerStack.Navigator>
        {setupComplete ? (
          <>
            <InnerStack.Screen
              name="HOME_TABS"
              component={HomeStackNavigator}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <InnerStack.Screen
              name="SETTINGS_STACK"
              component={SettingsStackNavigator}
              options={{ headerShown: false }}
            />
            <InnerStack.Screen
              name="MESSAGING_STACK"
              component={MessagingStackNavigator}
              options={{ headerShown: false }}
            />
            <InnerStack.Screen
              name="PROFILE_STACK"
              component={ProfileEditStackNavigator}
              options={{ headerShown: false }}
            />
            <InnerStack.Screen
              name="CREATEPOPIN"
              component={MapStackNavigator}
              options={{ headerShown: true }}
            />
            <InnerStack.Screen
              name="POPINDETAILS"
              component={MapStackNavigator}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <InnerStack.Screen
            name="ONBOARD_STACK"
            component={OnboardStackNavigator}
            options={{ headerShown: false }}
          />
        )}
        <InnerStack.Screen
          name="PROFILE_EDIT_STACK"
          component={ProfileEditStackNavigator}
          options={{ headerShown: false }}
        />
      </InnerStack.Navigator>
      <RequestWidgetErrorModal
        visible={error?.response?.status === 405}
        toggle={() => dispatch(resetRequests())}
      />
    </>
  );
};

export default InnerStackNavigator;

const styles = EStylesheet.create({
  tabTitle: {
    fontSize: '$fontMd',
    color: '$grey3',
  },
  tabSelected: {
    color: '$raspberry',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
