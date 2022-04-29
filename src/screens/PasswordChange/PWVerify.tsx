import React, { ReactElement } from 'react';
import { View, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { HugeTitle, Subtitle, Title2, Title3 } from 'components/Text';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
import { API, getApiUrl } from 'services/api';
import { VerifyCodeSendRes } from 'services/types';
import { PWVerifyNavigationProp, PWVerifyRouteProp } from 'nav/types';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Axios from 'axios';
import { registerStoreCode } from '../../features/Register/RegisterActions';
import { RootReducer } from '../../store/rootReducer';
import ActionButton from '../../components/Buttons/ActionButton';
import { CustomHeaderButton } from '../../components/HeaderButtons';
import MaskedView from '@react-native-community/masked-view';
import LagoonGradient from '../../components/Gradients/LagoonGradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { OnboardTextInput } from 'screens/Onboard/OnboardInputs';

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

interface PWVerifyProps {
  navigation: PWVerifyNavigationProp;
  route: PWVerifyRouteProp;
}

const PWVerify = ({ navigation, route }: PWVerifyProps): ReactElement => {
  const dispatch = useDispatch();

  const email = useSelector((state: RootReducer) => state.register.email);

  const [loading, setLoad] = React.useState(false);
  const [validReset, setValidReset] = React.useState(null as null | boolean);
  const [otpCode, setOTPCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');

  const [resendSuccess, setResendSuccess] = React.useState(false);

  React.useEffect(() => {
    if (otpCode && (otpCode.length > 6 || !/^\d+$/.test(otpCode))) {
      setCodeError('Please enter a valid 6-digit code.');
    } else {
      setCodeError('');
    }
  }, [otpCode]);

  const resendCode = (init: boolean) => {
    const data = { email, changePassword: true };
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

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        validReset ? null : (
          <CustomHeaderButton
            name="chevron-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
    });
  }, [navigation, validReset]);

  const nextSubmit = () => {
    setLoad(true);
    Axios.post(`${getApiUrl()}/identity/code`, { email, code: otpCode })
      .then(() => {
        dispatch(registerStoreCode(otpCode));
        setValidReset(true);
        setLoad(false);
      })
      .catch((_) => {
        setValidReset(false);
        setLoad(false);
      });
  };

  const theme = useTheme();
  const { colors } = theme;

  const [buttonPress, setButtonPress] = React.useState(false);

  const actionButton = (
    <View>
      {validReset == null ? (
        <ActionButton
          label="SUBMIT"
          onPress={nextSubmit}
          containerStyle={[{ width: '50%' }, styles.center, styles.stdMargin]}
        />
      ) : (
        <ActionButton
          label="TRY AGAIN"
          onPress={() => {
            setValidReset(null);
            setOTPCode('');
          }}
          containerStyle={[{ width: '50%' }, styles.center, styles.stdMargin]}
        />
      )}
      <ActionButton
        label="RESEND LINK"
        onPressIn={() => setButtonPress(true)}
        onPressOut={() => setButtonPress(false)}
        onPress={() => {
          resendCode(false);
          setValidReset(null);
        }}
        loading={loading}
        type={buttonPress ? 'default' : 'outline'}
        gradient={buttonPress}
        textGradient={!buttonPress}
        borderColor={EStyleSheet.value('$raspberry')}
        containerStyle={[
          { width: '50%' },
          styles.center,
          buttonPress ? undefined : { borderWidth: 2 },
        ]}
        textStyle={styles.buttonText}
      />
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
          {validReset === null ? (
            <>
              <View>
                <Subtitle
                  style={[styles.stdPadding, styles.stdMargin]}
                  color={colors.text}>
                  A verification code was sent to{' '}
                  <Title3 color={colors.primary}>{email}</Title3>.
                </Subtitle>
                <Subtitle
                  style={[styles.stdPadding, styles.stdMargin]}
                  color={colors.text}>
                  Please enter it below to continue the reset process.
                </Subtitle>
                <OnboardTextInput
                  style={[styles.stdPadding, styles.stdMargin]}
                  autoFocus
                  clearButtonMode="always"
                  placeholder="123456"
                  keyboardType="numeric"
                  textContentType="oneTimeCode"
                  onChangeText={(v) => setOTPCode(v)}
                  returnKeyType="done"
                  value={otpCode}
                  error={codeError}
                />
              </View>
              {resendSuccess ? (
                <Title2 style={styles.center} color={colors.text}>
                  We've sent a new link!
                </Title2>
              ) : null}
              {actionButton}
            </>
          ) : validReset ? (
            <>
              <View style={{ paddingTop: 20 }}>
                <MaskedView
                  style={{
                    flexDirection: 'row',
                    height: 60,
                  }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon name="check" size={60} color="white" />
                    </View>
                  }>
                  <LagoonGradient style={{ flex: 1 }} />
                </MaskedView>
                <Title3
                  color={colors.text}
                  style={[styles.center, styles.stdPadding]}>
                  Yay!
                </Title3>
              </View>
              <Title3
                style={[styles.center, styles.stdPadding]}
                color={colors.text}>
                Your email address was successfully verified.
              </Title3>
              <ActionButton
                label="NEXT"
                onPress={() => navigation.navigate('CHANGE_PASSWORD_SCREEN')}
                containerStyle={[
                  { width: '50%' },
                  styles.center,
                  styles.stdMargin,
                ]}
              />
            </>
          ) : (
            <>
              <View style={{ paddingTop: 20 }}>
                <MaskedView
                  style={{
                    flexDirection: 'row',
                    height: 60,
                  }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon2 name="sms-failed" size={60} color="white" />
                    </View>
                  }>
                  <LagoonGradient style={{ flex: 1 }} />
                </MaskedView>
                <Title3 color={colors.text} style={styles.center}>
                  Oh No!
                </Title3>
              </View>
              <Title3
                style={[styles.center, styles.stdPadding]}
                color={colors.text}>
                Your email address could not be verified. Try sending the link
                again.
              </Title3>
              {actionButton}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PWVerify;
