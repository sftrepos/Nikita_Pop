import React, { useEffect, useRef, useState } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EStyleSheet from 'react-native-extended-stylesheet';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { HugeTitle, Paragraph, Subtitle, Title3 } from 'components/Text';
import TextInput from 'components/TextInput';
import { useForm } from 'react-hook-form';
import { RegisterEmail } from 'util/validators';
import NextButton from 'screens/Register/NextButton';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
import { API, useGetUniversityInformationHook } from 'services/api';
import {
  SERVICE_ERROR,
  SERVICE_LOADED,
  SERVICE_LOADING,
  VerifyCodeSendRes,
} from 'services/types';
import { ForgotPasswordNavigationProp } from 'nav/types';
import { useDispatch } from 'react-redux';
import { registerChangePassword } from 'features/Register/RegisterActions';
import { ActivityIndicator } from 'react-native-paper';

const styles = EStyleSheet.create({
  _inset: {
    bottom: '15 rem',
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
  loader: {
    padding: '1rem',
  },
});

type FormData = {
  email: string;
};

interface ForgotPasswordProps {
  navigation: ForgotPasswordNavigationProp;
}

const ForgotPassword = ({ navigation }: ForgotPasswordProps) => {
  const { register, setValue, handleSubmit, errors, watch, unregister } =
    useForm<FormData>({
      validationSchema: RegisterEmail,
      reValidateMode: 'onChange',
    });

  const watchEmail = watch('email');
  const emailService = useGetUniversityInformationHook(watchEmail);
  const [isInactive, setInactive] = useState(false);
  const [isLoading, setLoad] = useState(false);
  const values = watch();
  const dispatch = useDispatch();
  const onSubmit = (data: FormData) => {
    setLoad(true);
    API.resendCode<VerifyCodeSendRes>({
      email: data.email,
      changePassword: true,
    })
      .then((res) => {
        if (res.sent) {
          dispatch(registerChangePassword(values.email));
          navigation.navigate('PASSWORD_VERIFY_SCREEN');
        }
      })
      .catch((err) => {
        let toastText = "We couldn't process your request.";
        if (err.response?.status == 401) {
          toastText = 'Could not find your email.';
        }
        Toast.show({
          text1: toastText,
          type: 'error',
          position: 'bottom',
        });
      })
      .finally(() => {
        setLoad(false);
      });
  };

  useEffect(() => {
    register('email');
    return () => {
      unregister('email');
    };
  }, [register]);

  const theme = useTheme();
  const { colors } = theme;
  const textInputRef = useRef<RNTextInput>(null);
  const renderInputController = () => (
    <TextInput
      inputRef={textInputRef}
      onEndEditing={() => setInactive(true)}
      label="Email"
      autoFocus
      clearButtonMode="always"
      autoCompleteType="email"
      placeholder="youremail@utexas.edu"
      keyboardType="email-address"
      textContentType="emailAddress"
      onChangeText={(v) => setValue('email', v, true)}
      value={values.email}
      returnKeyType="done"
      errors={
        (!!errors.email || emailService.status === SERVICE_ERROR) && isInactive
      }
    />
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor: colors.card }, styles.containerSafeArea]}>
      <StatusBar theme={theme} />
      <View>
        <View style={{ paddingTop: 20 }}>
          <HugeTitle style={[styles.stdPadding]} color={colors.text}>
            Enter your email
          </HugeTitle>
          <SetupSeparator theme={theme} />
          <Subtitle
            style={[styles.stdPadding, styles.stdMargin]}
            color={colors.text}>
            Trouble logging in?
          </Subtitle>
          <Subtitle
            style={[styles.stdPadding, styles.stdMargin]}
            color={colors.text}>
            We'll send you a code to reset your password!
          </Subtitle>
          <Title3
            style={[styles.stdPadding, styles.stdMargin]}
            color={colors.text}>
            Please enter your Pop account email.
          </Title3>
          {renderInputController()}
          {!!errors.email ||
            (emailService.status === SERVICE_ERROR && (
              <Paragraph style={styles.stdPadding} color={colors.notification}>
                Please enter a valid email address.
              </Paragraph>
            ))}
          {emailService.status === SERVICE_LOADING && (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
          {emailService.status === SERVICE_LOADED && (
            <View style={{ alignItems: 'center' }}>
              <Paragraph style={[styles.stdPadding]} color={colors.text}>
                {emailService.payload.name}
              </Paragraph>
              <Subtitle
                style={[styles.stdPadding, styles.textSub]}
                color={colors.border}>
                {emailService.payload.country}
              </Subtitle>
            </View>
          )}
        </View>
        <NextButton
          onPress={handleSubmit(onSubmit)}
          theme={theme}
          disabled={!!errors.email || emailService.status !== SERVICE_LOADED}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
