import React, { ReactElement, useEffect, useRef } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EStyleSheet from 'react-native-extended-stylesheet';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import { CommonActions, useTheme } from '@react-navigation/native';
import { HugeTitle, Paragraph, Subtitle } from 'components/Text';
import TextInput from 'components/TextInput';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema } from 'util/validators';
import NextButton from 'screens/Register/NextButton';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
import { API } from 'services/api';
import { ChangePasswordNavigationProp } from 'nav/types';
import { useSelector } from 'react-redux';
import { RootReducer } from '../../store/rootReducer';

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
  confirmPassword: string;
  password: string;
};

interface ChangePasswordProps {
  navigation: ChangePasswordNavigationProp;
}

const ChangePassword = ({ navigation }: ChangePasswordProps): ReactElement => {
  const {
    setValue,
    control,
    handleSubmit,
    errors,
    watch,
    register,
    unregister,
  } = useForm<FormData>({
    validationSchema: ChangePasswordSchema,
    reValidateMode: 'onChange',
  });

  const values = watch();
  const { code, email } = useSelector((state: RootReducer) => state.register);

  const onSubmit = (data: FormData) => {
    API.changePassword({ code, email, password: data.password })
      .then((_) => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'LOGIN_SCREEN', params: { isPasswordChanged: true } },
            ],
          }),
        );
      })
      .catch((_) => {
        Toast.show({
          text1: "We couldn't process your request.",
          type: 'error',
          position: 'bottom',
        });
      });
  };

  const theme = useTheme();
  const { colors } = theme;
  const confirmPasswordRef = useRef<RNTextInput>(null);
  const passwordTextInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    register('password');
    register('confirmPassword');
    return () => {
      unregister('confirmPassword');
      unregister('password');
    };
  }, [register]);

  const renderPasswordInputController = () => (
    <TextInput
      inputRef={passwordTextInputRef}
      autoFocus
      label="Password"
      theme={theme}
      clearButtonMode="always"
      autoCompleteType="password"
      placeholder="Password"
      textContentType="password"
      onSubmitEditing={() => passwordTextInputRef.current?.focus()}
      onChangeText={(value) => setValue('password', value, true)}
      returnKeyType="done"
      errors={!!errors.password}
      secureTextEntry
      value={values.password}
    />
  );

  const renderConfirmPasswordInputController = () => (
    <TextInput
      inputRef={confirmPasswordRef}
      label="Confirm password"
      theme={theme}
      clearButtonMode="always"
      autoCompleteType="password"
      placeholder="Password"
      textContentType="password"
      onChangeText={(value) => setValue('confirmPassword', value, true)}
      value={values.confirmPassword}
      returnKeyType="done"
      errors={!!errors.confirmPassword}
      secureTextEntry
    />
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor: colors.card }, styles.containerSafeArea]}>
      <StatusBar theme={theme} />
      <View style={{ paddingTop: 20 }}>
        <View>
          <HugeTitle style={[styles.stdPadding]} color={colors.text}>
            Change password
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
              Enter your new password
            </Subtitle>
          </View>
          {renderPasswordInputController()}
          {renderConfirmPasswordInputController()}
          {!!errors.password && (
            <Paragraph style={styles.stdPadding} color={colors.notification}>
              Please enter a valid password.
            </Paragraph>
          )}
          {!!errors.confirmPassword && (
            <Paragraph style={styles.stdPadding} color={colors.notification}>
              Passwords must match.
            </Paragraph>
          )}
        </View>
        <NextButton
          onPress={handleSubmit(onSubmit)}
          theme={theme}
          disabled={!!errors.password || !!errors.confirmPassword}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
