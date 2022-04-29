import React, { ReactElement, useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Subtitle, Title } from 'components/Text';
import ActionButton from 'components/Buttons/ActionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WelcomeNavigationProp } from 'nav/types';
import LinearGradient from 'react-native-linear-gradient';
import PopTitleLogoWhite from 'assets/vectors/PopTitleLogoWhite';
import { isAndroid } from 'util/phone';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

const styles = EStyleSheet.create({
  _inset: {
    bottom: '2 rem',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textPadding: {
    paddingHorizontal: '1 rem',
  },
  textMargin: {
    marginBottom: '1 rem',
  },
  textBot: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: '1.5 * 1rem',
  },
  textTop: {
    fontSize: '1.5 * 1rem',
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
  login: {
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});

interface WelcomeProps {
  navigation: WelcomeNavigationProp;
}

const Welcome = ({ navigation }: WelcomeProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const loggingIn: boolean = useSelector((state) => state.login.isLoading);
  const authenticated: boolean = useSelector(
    (state) => state.login.isAuthenticated,
  );

  useEffect(() => {
    if (authenticated) {
    }
  }, [authenticated]);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isAndroid() ? 'dark-content' : 'light-content'}
        theme={theme}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#66CAEA', '#63DFB2']}
        style={[styles.container]}>
        <View />
        <View />
        <View style={[styles.logo]}>
          <PopTitleLogoWhite />
        </View>
        <View>
          {Config.env === 'dev' ? (
            <Title style={styles.textTop} color="white">
              DEVELOPMENT
            </Title>
          ) : (
            <>
              <Subtitle
                style={[styles.textPadding, styles.textTop]}
                color="white">
                {`this is where you`}
              </Subtitle>
              <Subtitle
                style={[styles.textPadding, styles.textBot]}
                color="white">
                make friends
              </Subtitle>
            </>
          )}
        </View>
        <View
          style={{
            paddingBottom: Math.max(insets.bottom, styles._inset.bottom),
          }}>
          {/*<ActionButton*/}
          {/*  containerStyle={styles.textMargin}*/}
          {/*  onPress={() => navigation.navigate('TEST_SCREEN')}*/}
          {/*  label="TEST"*/}
          {/*/>*/}
          {!loggingIn ? (
            <>
              <ActionButton
                textStyle={{ color: '#66CAEA' }}
                onPress={() => navigation.navigate('SWIPER_SCREEN')}
                label="Create an Account"
                type="outline"
                containerStyle={[
                  styles.textMargin,
                  { width: '80%', alignSelf: 'center', borderRadius: 20 },
                ]}
              />
              <Pressable
                onPress={() => {
                  navigation.navigate('LOGIN_SCREEN', {
                    isPasswordChanged: false,
                  });
                }}>
                <Paragraph style={styles.login} color="white">
                  Or log in to your account
                </Paragraph>
              </Pressable>
            </>
          ) : (
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={{ marginBottom: 30 }}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Welcome;
