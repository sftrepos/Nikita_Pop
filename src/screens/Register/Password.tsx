import React from 'react';
import { PasswordScreenNavigationProp } from 'nav/types';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Linking,
  Pressable,
  Keyboard,
} from 'react-native';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { HugeTitle, Paragraph, Title3 } from 'components/Text';
import NextButton from './NextButton';
import { SetupSeparator } from './SetupSeparator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from 'store/rootReducer';
import { registerUser } from 'features/Register/RegisterActions';
import useAnalytics from 'util/analytics/useAnalytics';

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
    textAlign: 'center',
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
  eyeIcon: {
    marginRight: '0.5 rem',
  },
});

interface PasswordScreenProps {
  navigation: PasswordScreenNavigationProp;
}

const PasswordScreen = (props: PasswordScreenProps): React.ReactElement => {
  const analytics = useAnalytics();
  const { navigation } = props;
  const { colors } = useTheme();
  const theme = useTheme();

  const dispatch = useDispatch();

  const authenticated = useSelector(
    (state: RootReducer) => state.register.isAuthenticated,
  );
  const isLoading = useSelector(
    (state: RootReducer) => state.register.isLoading,
  );
  const formEmail = useSelector((state: RootReducer) => state.register.email);

  const [pw, setPW] = React.useState('');
  const [confirmPW, setConfirmPW] = React.useState('');
  const [error, setError] = React.useState('');
  const [error2, setError2] = React.useState('');
  const [validPW, setValidPW] = React.useState(false);
  const [pwVisible, setPWVisible] = React.useState(false);

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

  const secondInput = React.useRef<TextInput>(null);

  React.useEffect(() => {
    if (authenticated) {
      navigation.navigate('OUTER_STACK', { screen: 'REGISTER_VERIFY_SCREEN' });
    }
  }, [authenticated]);

  React.useLayoutEffect(() => {
    let valid = true;
    if (pw) {
      // HTML5 W3C Standard modified for .edu
      if (pw.length > 0 && pw.length < 8) {
        setError('Your password needs to have at least 8 characters');
        valid = false;
      } else {
        setError('');
      }
    } else {
      valid = false;
    }
    // if (confirmPW) {
    //   if (confirmPW !== pw) {
    //     setError2('Your passwords don’t match, check again!');
    //     valid = false;
    //   } else {
    //     setError2('');
    //   }
    // } else {
    //   valid = false;
    // }
    setValidPW(valid);
  }, [pw, confirmPW]);

  const onSubmit = () => {
    const credentials = {
      email: formEmail,
      password: pw,
    };
    dispatch(registerUser(credentials));
    analytics.logEvent({ name: 'ONBOARDING PASSWORD SUBMIT', data: {} }, true);
  };

  return (
    <SafeAreaView style={[{ backgroundColor: colors.card }, styles.container]}>
      <StatusBar theme={theme} />
      <ScrollView
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollViewContent}>
        <View style={{ flex: 1 }}>
          <HugeTitle style={[styles.stdPadding]} color={colors.text}>
            Create Your Account
          </HugeTitle>
          <SetupSeparator theme={theme} />
          <View style={[styles.inputsWrapper]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <Title3 style={styles.inputLabel} color={colors.text}>
                Create a password
              </Title3>
              <Pressable
                onPressIn={() => {
                  setPWVisible(true);
                }}
                onPressOut={() => setPWVisible(false)}>
                <Icon
                  style={styles.eyeIcon}
                  name={!pwVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor={EStyleSheet.value('$grey3')}
              value={pw}
              onChangeText={(s) => setPW(s)}
              style={tiStyles.textInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
              clearButtonMode="always"
              textContentType="newPassword"
              autoCompleteType="password"
              returnKeyType="done"
              secureTextEntry={!pwVisible}
            />
            {error ? (
              <Paragraph color={EStyleSheet.value('$watermelon')}>
                {error}
              </Paragraph>
            ) : null}
            {/* <Title3 style={styles.inputLabel} color={colors.text}>
              Confirm your password
            </Title3>
            <TextInput
              ref={secondInput}
              placeholder="confirm password"
              placeholderTextColor={EStyleSheet.value('$grey3')}
              style={tiStyles.textInput}
              onChangeText={(s) => setConfirmPW(s)}
              value={confirmPW}
              clearButtonMode="always"
              textContentType="newPassword"
              autoCompleteType="password"
              returnKeyType="done"
              secureTextEntry={!pwVisible}
            />
            {error2 ? (
              <Paragraph color={EStyleSheet.value('$watermelon')}>
                {error2}
              </Paragraph>
            ) : null} */}
          </View>
        </View>
        <View style={styles.center}>
          <Paragraph
            style={[styles.stdPadding, styles.stdMargin, styles.center]}
            color={EStyleSheet.value('$grey2')}>
            By registering, you are indicating that you have read and
            acknowledge the
            <Title3
              color={colors.primary}
              onPress={() => {
                Linking.openURL('https://www.popsocial.app/terms-of-service');
                analytics.logEvent(
                  { name: 'ONBOARDING TERMS OF SERVICE OPEN' },
                  true,
                );
              }}>{` Terms of Service `}</Title3>
            and
            <Title3
              onPress={() => {
                Linking.openURL('https://www.popsocial.app/privacy-policy');
                analytics.logEvent(
                  { name: 'ONBOARDING PRIVACY POLICY OPEN' },
                  true,
                );
              }}
              color={colors.primary}>{` Privacy Policy.`}</Title3>
          </Paragraph>
          <NextButton
            containerStyle={styles.nextBtn}
            disabled={!validPW}
            onPress={onSubmit}
            isLoading={isLoading}
            noIcon
          />
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('OUTER_STACK', { screen: 'LOGIN_SCREEN' });
            }}>
            <Paragraph color={colors.primary} style={styles.link}>
              Have an account?
            </Paragraph>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordScreen;
