import React, { ReactElement, useEffect, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';
import { ScrollView, View } from 'react-native';
import { Paragraph, Title, Title2 } from 'components/Text';
import commonStyles, { touchableScaleTensionProps } from 'styles/commonStyles';
import { width } from 'util/phone';
import { WaitlistNavigationProp, WaitlistRouteProp } from 'nav/types';
import { API, useServiceHook } from 'services/api';
import {
  GetUniversityWaitlistCountData,
  GetUniversityWaitlistCountRes,
  SERVICE_ERROR,
  SERVICE_INIT,
  SERVICE_LOADED,
  SERVICE_LOADING,
} from 'services/types';
import { ActivityIndicator } from 'react-native-paper';
import Share from 'react-native-share';
import { logError, logEvent } from 'util/log';
import { getStoreToken } from 'util/selectors';
import NextButton from 'screens/Register/NextButton';
import TouchableScale from 'react-native-touchable-scale';

const styles = EStyleSheet.create({
  $padding: '5rem',
  $width: width,
  container: {
    flex: 1,
  },
  text: {},
  inner: {},
  title: {
    paddingBottom: '1rem',
  },
  button: {
    alignSelf: 'center',
    padding: '3rem',
    justifyContent: 'center',
    width: '$width -$padding',
    height: '$width - $padding',
    borderWidth: '0.75rem',
    borderRadius: '$width * 0.5',
    marginVertical: '1rem',
  },
  textContainer: {
    padding: '1rem',
    paddingHorizontal: '2rem',
  },
  innerButtonText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 26,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerStatus: {
    width: '100%',
    paddingVertical: '1rem',
    alignItems: 'center',
  },
  numIndicator: {
    alignSelf: 'center',
    fontSize: '$width * 0.2 - $padding',
  },
  hr: {
    width: '80%',
    marginTop: '.5rem',
    height: EStyleSheet.hairlineWidth,
  },
  sep: {
    marginVertical: '.5rem',
  },
});

interface IWaitlist {
  navigation: WaitlistNavigationProp;
  route: WaitlistRouteProp;
  waitlistingCount?: number;
  token: string;
  universityName: string;
}

const WAITLIST_THRESHOLD = 20;
const SHARE_URL = 'https://www.popsocial.app/';

const Waitlist = ({
  navigation,
  route,
  waitlistingCount,
  token,
  universityName,
}: IWaitlist): ReactElement => {
  const theme = useTheme();
  const [count, setCount] = useState(waitlistingCount || 0);
  const { colors } = theme;

  // Get waitlist count using university
  const waitlistCountService = useServiceHook<
    GetUniversityWaitlistCountRes,
    GetUniversityWaitlistCountData
  >(
    API.getWaitlistCount,
    {
      params: { university: universityName },
    },
    [],
  );

  // Set waitlist count
  useEffect(() => {
    if (waitlistCountService.status === SERVICE_LOADED) {
      setCount(waitlistCountService.payload.count);
    }
  }, [waitlistCountService]);

  //
  //   const serviceLoadState = Array.from(services, (service) => service.status);
  //   const collapsedServiceLoadState = _.union(serviceLoadState);
  //   // All have the same load state
  //   if (collapsedServiceLoadState.length === 1) {
  //     return collapsedServiceLoadState[0];
  //   } else if (collapsedServiceLoadState.includes(SERVICE_ERROR)) {
  //     return SERVICE_ERROR;
  //   } else {
  //     return SERVICE_LOADING;
  //   }
  // };

  // Check if both services loaded, loading, or errored
  // useEffect(() => {
  //   const servicesLoaded = serviceLoader([waitlistCountService]);
  //   setAllServicesLoaded(servicesLoaded);
  // }, [waitlistCountService]);

  const onPressShare = () => {
    Share.open({
      url: SHARE_URL,
    })
      .then((res) =>
        logEvent('USER_SHARED_FROM_WAITLIST', {
          shareEvent: res,
        }),
      )
      .catch((err) => logError(err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{}}>
        <StatusBar theme={theme} />
        {waitlistCountService.status === SERVICE_LOADING ||
          (waitlistCountService.status === SERVICE_INIT && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ))}
        {waitlistCountService.status === SERVICE_ERROR && (
          <View style={commonStyles.container}>
            <Paragraph color={colors.text}>An error occurred.</Paragraph>
          </View>
        )}
        {waitlistCountService.status === SERVICE_LOADED && (
          <>
            <View
              style={[
                styles.container,
                styles.inner,
                { backgroundColor: colors.background },
              ]}>
              <View style={styles.textContainer}>
                <Title2 style={[styles.text, styles.title]} color={colors.text}>
                  {`${universityName} is on the Waitlist!`}
                </Title2>
                <Paragraph style={styles.text} color={colors.text}>
                  For a Pop experience on your campus, your school needs 20
                  people. By creating an account you've joined our waitlist for
                  your university. Share the app link below to help start the
                  process!
                </Paragraph>
                <View style={styles.sep} />
                <Paragraph style={styles.text} color={colors.text}>
                  You can still customize your profile, by tapping your profile
                  on the right bottom corner. You will be able to see other
                  students when your campus hit 20 students!
                </Paragraph>
              </View>
              <TouchableScale
                {...touchableScaleTensionProps}
                onPress={() => {
                  // Blow confetti or whatever
                }}>
                <View style={[styles.button, { borderColor: colors.primary }]}>
                  <Title style={styles.numIndicator} color={colors.primary}>
                    {WAITLIST_THRESHOLD - count}
                  </Title>
                  <Paragraph
                    style={[styles.innerButtonText]}
                    color={colors.text}>{`Students away!`}</Paragraph>
                </View>
              </TouchableScale>
              <View style={styles.containerStatus}>
                <Title2 color={colors.text}>{universityName}</Title2>
                <View style={[styles.hr, { backgroundColor: colors.text }]} />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <NextButton
                label="Share app link"
                onPress={onPressShare}
                noIcon
                theme={theme}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  token: getStoreToken(state),
  waitlistingCount: state.login.waitlistingCount,
  universityName: state.user.localUser?.university?.name ?? '',
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Waitlist);
