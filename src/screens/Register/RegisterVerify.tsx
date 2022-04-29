import React, { ReactElement } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';
import { CommonActions, useTheme } from '@react-navigation/native';
import { HugeTitle, Subtitle, Title2, Title3 } from 'components/Text';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
import { API } from 'services/api';
import { VerifyCodeSendRes } from 'services/types';
import {
  RegisterVerifyNavigationProp,
  RegisterVerifyRouteProp,
} from 'nav/types';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { registerRetry } from '../../features/Register/RegisterActions';
import { RootReducer } from '../../store/rootReducer';
import { CustomHeaderButton } from '../../components/HeaderButtons';
import { getStoreToken } from 'util/selectors';
import { loginToken } from 'features/Login/LoginActions';

const styles = EStyleSheet.create({
  _inset: {
    bottom: '5 rem',
  },
  containerSafeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    marginTop: '2 rem',
    marginBottom: '1 rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  stdPadding: {
    paddingHorizontal: '1 rem',
  },
  stdMargin: {
    marginBottom: '1 rem',
  },
  returnBtn: {
    marginTop: '2 rem',
  },
  center: {
    alignSelf: 'center',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

interface RegisterVerifyProps {
  navigation: RegisterVerifyNavigationProp;
  route: RegisterVerifyRouteProp;
}

const RegisterVerify = ({
  navigation,
  route,
}: RegisterVerifyProps): ReactElement => {
  const dispatch = useDispatch();

  const email = useSelector((state: RootReducer) => state.register.email);
  const token = useSelector(getStoreToken);

  const [resendSuccess, setResendSuccess] = React.useState(false);

  React.useEffect(() => {
    // check login token every 5 seconds for authorized status
    const interval = setInterval(() => {
      dispatch(loginToken(token));
    }, 1500);
    return () => clearInterval(interval);
  }, [token]);

  const resendCode = (init: boolean) => {
    const data = { email, changePassword: false };
    API.resendCode<VerifyCodeSendRes>(data)
      .then((res) => {
        if (res.sent && !init) {
          setResendSuccess(true);
        }
      })
      .catch((_) => {
        setResendSuccess(false);
        Toast.show({
          text1: "We couldn't process your request.",
          type: 'error',
          position: 'bottom',
        });
      });
  };

  const returnPress = () => {
    dispatch(registerRetry());
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'WELCOME_SCREEN' },
          { name: 'REGISTER_STACK', params: { screen: 'EMAIL_SCREEN' } },
        ],
      }),
    );
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CustomHeaderButton
          name="chevron-left"
          onPress={() => {
            returnPress();
          }}
        />
      ),
    });
  }, [navigation]);

  const theme = useTheme();
  const { colors } = theme;

  // using ActiionButton component's MaskedView crashes Android
  // due to change of screen resulting in an uncaught NullPointerException on update
  // option to using a plain text TouchableOpacity instead
  // see: https://sentry.io/organizations/pop-social/issues/2318099543
  const actionButton = (
    <View style={styles.stdMargin}>
      <TouchableOpacity
        onPress={() => {
          resendCode(false);
        }}
        style={styles.center}>
        <Title3 color={colors.primary}>RESEND LINK</Title3>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor: colors.card }, styles.containerSafeArea]}>
      <StatusBar theme={theme} />
      <View style={{ flex: 1, paddingTop: 20 }}>
        <HugeTitle style={[styles.stdPadding]} color={colors.text}>
          Verify Your Account
        </HugeTitle>
        <SetupSeparator theme={theme} />
        <View style={styles.container}>
          <View>
            <Subtitle
              style={[styles.stdPadding, styles.stdMargin]}
              color={colors.text}>
              A verification link was sent to{' '}
              <Title3 color={colors.primary}> {email}</Title3>.{' '}
              <Subtitle
                style={[styles.stdPadding, styles.stdMargin]}
                color={colors.text}>
                Clicking it will activate your account.
              </Subtitle>
            </Subtitle>
            <Title3
              onPress={() => returnPress()}
              style={[styles.returnBtn, styles.stdPadding]}
              color={EStyleSheet.value('$grey3')}>
              {'< Go back and use a different email'}
            </Title3>
          </View>
          {resendSuccess ? (
            <Title2 style={styles.center} color={colors.text}>
              We've sent a new link!
            </Title2>
          ) : null}
          {actionButton}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterVerify;
