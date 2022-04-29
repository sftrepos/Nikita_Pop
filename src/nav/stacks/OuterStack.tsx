import {
  OuterScreenOptions,
  SwiperOnboardingOptions,
  WelcomeScreenOptions,
} from 'styles/navigation';
import React, { ReactElement } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from 'screens/Welcome';
import Login from 'screens/Login';
import ForgotPassword from 'screens/PasswordChange/ForgotPassword';
import RegisterVerify from 'screens/Register/RegisterVerify';
import PWVerify from 'screens/PasswordChange/PWVerify';
import ChangePassword from 'screens/PasswordChange/ChangePassword';
import { OuterStackParamList, RegisterStackParamList } from 'nav/types';
import IntercomScreen from 'screens/Intercom';
import SwiperScreen from 'screens/Welcome/SwiperScreens';
import EmailScreen from 'screens/Register/Email';
import PasswordScreen from 'screens/Register/Password';

const OuterStack = createStackNavigator<OuterStackParamList>();
const OuterStackNavigator = (): ReactElement => {
  return (
    <OuterStack.Navigator>
      <OuterStack.Screen
        name="WELCOME_SCREEN"
        component={Welcome}
        options={WelcomeScreenOptions}
      />
      <OuterStack.Screen
        name="TEST_SCREEN"
        component={IntercomScreen}
        options={WelcomeScreenOptions}
      />
      <OuterStack.Screen
        name="SWIPER_SCREEN"
        component={SwiperScreen}
        options={SwiperOnboardingOptions}
      />
      <OuterStack.Screen
        name="LOGIN_SCREEN"
        component={Login}
        options={OuterScreenOptions}
        initialParams={{ isPasswordChanged: false }}
      />
      <OuterStack.Screen
        name="REGISTER_STACK"
        component={RegisterStackNavigator}
        options={OuterScreenOptions}
      />
      <OuterStack.Screen
        name="FORGOT_PASSWORD_SCREEN"
        component={ForgotPassword}
        options={OuterScreenOptions}
      />
      <OuterStack.Screen
        name="REGISTER_VERIFY_SCREEN"
        component={RegisterVerify}
        options={OuterScreenOptions}
      />
      <OuterStack.Screen
        name="PASSWORD_VERIFY_SCREEN"
        component={PWVerify}
        options={OuterScreenOptions}
      />
      <OuterStack.Screen
        name="CHANGE_PASSWORD_SCREEN"
        component={ChangePassword}
        options={OuterScreenOptions}
      />
    </OuterStack.Navigator>
  );
};

const RegisterStack = createStackNavigator<RegisterStackParamList>();
const RegisterStackNavigator = (): ReactElement => {
  return (
    <RegisterStack.Navigator>
      <RegisterStack.Screen
        name="EMAIL_SCREEN"
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <RegisterStack.Screen
        name="PASSWORD_SCREEN"
        component={PasswordScreen}
        options={{ headerShown: false }}
      />
    </RegisterStack.Navigator>
  );
};

export default OuterStackNavigator;
