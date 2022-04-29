import React from 'react';
import { EmailScreenNavigationProp } from 'nav/types';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { HugeTitle, Paragraph, Subtitle, Title3 } from 'components/Text';
import NextButton from './NextButton';
import { SetupSeparator } from './SetupSeparator';
import { SERVICE_ERROR, SERVICE_LOADED, SERVICE_LOADING } from 'services/types';
import { API, useGetUniversityInformationHook } from 'services/api';
import ActivityIndicator from 'components/ActivityIndicator';
import { useDispatch } from 'react-redux';
import { storeEmail } from 'features/Register/RegisterActions';
import useAnalytics from 'util/analytics/useAnalytics';
import { Amplitude } from '@amplitude/react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  _inset: {
    bottom: '2 rem',
  },
  kbView: {
    flex: 1,
  },
  stdPadding: {
    paddingHorizontal: '1 rem',
  },
  stdMargin: {
    marginBottom: '1 rem',
  },
  center: {
    alignItems: 'center',
  },
  nextBtn: {
    paddingHorizontal: '20%',
    marginTop: 'auto',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingTop: '2 rem',
  },
  inputsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: '1 rem',
    justifyContent: 'center',
  },
  inputLabel: {
    marginTop: '1 rem',
  },
  link: {
    textDecorationLine: 'underline',
  },
  emailVerificationView: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '1 rem',
  },
});

interface EmailScreenProps {
  navigation: EmailScreenNavigationProp;
}

const EmailScreen = (props: EmailScreenProps): React.ReactElement => {
  const { navigation } = props;

  const { colors } = useTheme();
  const theme = useTheme();

  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [error2, setError2] = React.useState('');
  const [validEmail, setValidEmail] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const tiStyles = EStyleSheet.create({
    textInput: {
      width: '100%',
      color: colors.text,
      fontSize: '1 rem',
      backgroundColor: '$grey5',
      paddingVertical: '0.5 rem',
      paddingHorizontal: '1 rem',
      marginVertical: '0.5 rem',
      marginRight: 0,
      borderRadius: 12,
      elevation: 1,
      height: 40,
    },
  });

  const firstInput = React.useRef<TextInput>(null);
  const secondInput = React.useRef<TextInput>(null);

  const emailService = useGetUniversityInformationHook(email);

  React.useLayoutEffect(() => {
    setValidEmail(
      emailService.status === SERVICE_LOADED &&
        email.trim().toLocaleLowerCase() ===
          confirmEmail.trim().toLocaleLowerCase(),
    );
  }, [emailService.status, email, confirmEmail]);

  React.useEffect(() => {
    if (!firstInput.current?.isFocused()) {
      if (email) {
        // HTML5 W3C Standard modified for .edu
        const emailRegExp = RegExp(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9^.]+(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.edu$/i,
        );
        if (!email.trim().match(emailRegExp)) {
          setError('Make sure you enter a university (.edu) email');
        } else {
          setError('');
        }
      }
    } else {
      setError('');
    }
    if (confirmEmail.length > 0) {
      if (
        email.trim().toLocaleLowerCase() !==
        confirmEmail.trim().toLocaleLowerCase()
      ) {
        setError2('Your email doesn’t match');
      } else {
        setError2('');
      }
    } else {
      setError2('');
    }
  }, [email, confirmEmail, isFocused]);

  const analytics = useAnalytics();

  const onSubmit = () => {
    console.log('submitting');
    setIsLoading(true);

    API.checkEmail({ email })
      .then(() => {
        const amp = Amplitude.getInstance();
        amp.setUserProperties({ 'university.name': emailService.payload.name });
        analytics.logEvent(
          {
            name: 'ONBOARDING EMAIL SUBMIT',
            data: {
              email,
            },
          },
          true,
        );
        navigation.push('PASSWORD_SCREEN');
        setIsLoading(false);
      })
      .catch(() => {
        setValidEmail(false);
        setError('Email already in use. Try logging in instead?');
        setIsLoading(false);
      });
    dispatch(storeEmail(email));
  };

  return (
    <SafeAreaView style={[{ backgroundColor: colors.card }, styles.container]}>
      <StatusBar theme={theme} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollViewContent}>
        <View style={{ flex: 1 }}>
          <HugeTitle style={[styles.stdPadding]} color={colors.text}>
            Create Your Account
          </HugeTitle>
          <SetupSeparator theme={theme} />
          <View style={[styles.inputsWrapper]}>
            <Title3 style={styles.inputLabel} color={colors.text}>
              Enter your school email
            </Title3>
            <TextInput
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              ref={firstInput}
              placeholder="school email"
              placeholderTextColor={EStyleSheet.value('$grey3')}
              value={email}
              onChangeText={(s) => setEmail(s)}
              style={tiStyles.textInput}
              onSubmitEditing={() => secondInput.current?.focus()}
              blurOnSubmit={false}
              clearButtonMode="always"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
              returnKeyType="done"
              autoCapitalize="none"
            />
            {error ? (
              <Paragraph color={EStyleSheet.value('$watermelon')}>
                {error}
              </Paragraph>
            ) : null}
            <Title3 style={styles.inputLabel} color={colors.text}>
              Confirm your email
            </Title3>
            <TextInput
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              ref={secondInput}
              placeholder="confirm email"
              placeholderTextColor={EStyleSheet.value('$grey3')}
              style={tiStyles.textInput}
              onChangeText={(s) => setConfirmEmail(s)}
              value={confirmEmail}
              clearButtonMode="always"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
              returnKeyType="done"
              onSubmitEditing={() => onSubmit}
              autoCapitalize="none"
            />
            {error2 ? (
              <Paragraph color={EStyleSheet.value('$watermelon')}>
                {error2}
              </Paragraph>
            ) : null}
          </View>
        </View>
        <View style={styles.emailVerificationView}>
          {emailService.status === SERVICE_ERROR && (
            <Paragraph style={styles.stdPadding} color={colors.notification}>
              We couldn't match your email to a university.
            </Paragraph>
          )}
          {emailService.status === SERVICE_LOADING && (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
          {emailService.status === SERVICE_LOADED && (
            <>
              <Subtitle
                style={[styles.stdPadding, styles.textSub]}
                color={EStyleSheet.value('$grey2')}>
                Nice! you have been verified as a student of
              </Subtitle>
              <Title3 style={[styles.stdPadding]} color={colors.primary}>
                {emailService.payload.name}
              </Title3>
            </>
          )}
        </View>
        <View style={[styles.center, styles.stdMargin]}>
          <NextButton
            containerStyle={styles.nextBtn}
            disabled={!validEmail}
            onPress={onSubmit}
            noIcon
            isLoading={isLoading}
          />
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('OUTER_STACK', { screen: 'LOGIN_SCREEN' })
            }>
            <Paragraph color={colors.primary} style={styles.link}>
              Have an account?
            </Paragraph>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailScreen;
