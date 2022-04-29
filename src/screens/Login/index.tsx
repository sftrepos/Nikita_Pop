import React, { useEffect, useRef, useState } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { HugeTitle, Paragraph, Subtitle } from 'components/Text';
import TextInput from 'components/TextInput';
import { useForm } from 'react-hook-form';
import { LoginSchema } from 'util/validators';
import NextButton from 'screens/Register/NextButton';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
//import { useGetUniversityInformationHook } from 'services/api';
import { SERVICE_ERROR, SERVICE_LOADED, SERVICE_LOADING } from 'services/types';
import routes from 'nav/routes';
import { login } from 'features/Login/LoginActions';
import { Credentials } from 'features/Login/LoginTypes';
import { resumeRegistration } from 'features/Register/RegisterActions';
import { ActivityIndicator } from 'react-native-paper';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  _inset: {
    bottom: '20 rem',
  },
  containerSafeArea: {
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  stdPadding: {
    paddingHorizontal: '1 rem',
  },
  stdMargin: {
    marginBottom: '1 rem',
  },
  textSub: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: '0.70 rem',
  },
});

type FormData = {
  email: string;
  password: string;
};

export interface LoginProps {
  dispatchLogin: (credentials: Credentials) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: string;
  resumeRegistration: (email: string) => void;
}

const Login = ({
  navigation,
  route,
  dispatchLogin,
  isLoading,
  isAuthenticated,
  status,
  resumeRegistration,
}: LoginProps) => {
  const { setValue, errors, watch, register, handleSubmit, unregister } =
    useForm({
      validationSchema: LoginSchema,
      reValidateMode: 'onChange',
    });

  const [isInactive, setIsInactive] = useState<boolean[]>(false, false);
  const watchEmail = watch('email');
  //const emailService = useGetUniversityInformationHook(watchEmail);
  const values = watch();
  const analytics = useAnalytics();
  const onSubmit = (data: FormData) => {
    dispatchLogin(data);
    //console.log(data);
    analytics.logEvent(
      {
        name: 'LOGIN',
      },
      true,
    );
  };

  const { isPasswordChanged } = route.params;

  useEffect(() => {
    if (isPasswordChanged) {
      Toast.show({
        text1: 'Your password has been changed.',
        text2: 'Try logging in again.',
        type: 'success',
        position: 'bottom',
      });
    }
  }, [isPasswordChanged]);

  useEffect(() => {
    register('email');
    register('password');
    return () => {
      unregister('email');
      unregister('password');
    };
  }, [register]);

  useEffect(() => {
    if (isAuthenticated) {
      switch (status) {
        case 'ACTIVE': {
          navigation.navigate('HOME_TABS');
          break;
        }
        case 'PENDING': {
          resumeRegistration(values.email);
          navigation.navigate('REGISTER_VERIFY_SCREEN');
        }
      }
    }
  }, [isAuthenticated]);

  const theme = useTheme();
  const { colors } = theme;
  const emailTextInputRef = useRef<RNTextInput>(null);
  const passwordTextInputRef = useRef<RNTextInput>(null);

  const renderEmailInputController = () => (
    <TextInput
      inputRef={emailTextInputRef}
      label="Email"
      onEndEditing={() => setIsInactive((prev) => [true, prev[1]])}
      autoFocus
      clearButtonMode="always"
      autoCompleteType="email"
      placeholder="youremail@utexas.edu"
      keyboardType="email-address"
      textContentType="emailAddress"
      onChangeText={(v) => setValue('email', v, true)}
      returnKeyType="done"
      onSubmitEditing={() => passwordTextInputRef.current?.focus()}
      errors={!!errors.email && isInactive[0]}
      value={values.email}
    />
  );

  const renderPasswordInputController = () => (
    <TextInput
      inputRef={passwordTextInputRef}
      label="Password"
      onEndEditing={() => setIsInactive((prev) => [prev[0], true])}
      clearButtonMode="always"
      autoCompleteType="password"
      placeholder="Password"
      textContentType="password"
      onChangeText={(v) => setValue('password', v, true)}
      returnKeyType="done"
      errors={!!errors.password && isInactive[1]}
      secureTextEntry
      onSubmitEditing={handleSubmit(onSubmit)}
      value={values.password}
    />
  );
  return (
    <SafeAreaView
      style={[{ backgroundColor: colors.card }, styles.containerSafeArea]}>
      <StatusBar theme={theme} />
      <View style={{ paddingTop: 20 }}>
        <HugeTitle style={[styles.stdPadding]} color={colors.text}>
          Login
        </HugeTitle>
        <SetupSeparator theme={theme} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Subtitle
            style={[styles.stdPadding, styles.stdMargin]}
            color={colors.text}>
            Enter your .edu email
          </Subtitle>
          <Subtitle
            onPress={() => navigation.navigate(routes.FORGOT_PASSWORD_SCREEN)}
            style={[
              styles.stdPadding,
              styles.stdMargin,
              styles.textForgotPassword,
            ]}
            color={colors.secondary}>
            Trouble logging in?
          </Subtitle>
        </View>
        {renderEmailInputController()}
        {renderPasswordInputController()}
        <NextButton
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          theme={theme}
          // disabled={!!errors.email || emailService.status !== SERVICE_LOADED}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.login.isAuthenticated,
  status: state.login.status,
  isLoading: state.login.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLogin: (credentials: Credentials) => dispatch(login(credentials)),
  resumeRegistration: (email: string) => dispatch(resumeRegistration(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
