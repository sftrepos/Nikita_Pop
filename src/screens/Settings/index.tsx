import React, { ReactElement, useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Linking, ViewStyle } from 'react-native';
import EStyleSheet, { build } from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title3 } from 'components/Text';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import Separator from 'components/Separator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyleConstants from 'styles/globalStyleConstants';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import { openSettings } from 'react-native-permissions';
import { isPhoneIOS } from 'util/phone';
import { SettingsNavigationProp, SettingsRouteProp } from 'nav/types';
import { logout } from 'features/Login/LoginActions';
import { getId, getProfileData } from 'util/selectors';
import useAnalytics from 'util/analytics/useAnalytics';
import ProfileVisibility from './ProfileVisibility';
import { logInfo } from 'util/deviceInfo';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { genderMap } from './ChangeFieldScreen';

const styles = EStyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '3 rem',
    paddingHorizontal: '1 rem',
    paddingVertical: '.5 rem',
  },
  sectionSeparatorBorder: {
    borderTopWidth: EStyleSheet.hairlineWidth,
    height: 36,
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  containerLogoutButton: {
    flexDirection: 'row',
  },
  containerSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSectionTitle: {
    padding: '1 rem',
    marginTop: '.4 rem',
  },
  containerSettingRoundedItem: {
    borderRadius: 25,
    marginHorizontal: '1 rem',
  },
  textSection: {
    padding: '1 rem',
  },
  containerLogout: {
    alignSelf: 'center',
    paddingVertical: '1 rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleRoundedItemMargin: {
    marginBottom: '1 rem',
  },
  listPadding: {
    paddingBottom: '2 rem',
  },
});

interface LogoutButtonProps {
  onPress: () => void;
}

interface SettingsItem {
  onPress: () => void;
  title: string;
  icon?: string;
  style?: ViewStyle;
}

const LogoutButton = React.memo<LogoutButtonProps>(({ onPress }) => {
  const { colors } = useTheme();
  const activeTint = globalStyleConstants.tint(colors);

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.containerLogout}>
          <Paragraph color={pressed ? activeTint : colors.primary}>
            Logout
          </Paragraph>
          <Icon
            name="logout-variant"
            size={25}
            color={pressed ? activeTint : colors.primary}
          />
        </View>
      )}
    </Pressable>
  );
});

export const EntryItem = ({ onPress, icon, title, value }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.container,
          styles.containerSettingItem,
          { backgroundColor: colors.card },
        ]}>
        <View style={{ paddingRight: 10 }}>
          <Paragraph color={colors.text}>{title}</Paragraph>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            maxWidth: '70%',
          }}>
          <Paragraph
            style={{ textAlign: 'right' }}
            color={globalStyleConstants.tint(colors)}>
            {value}
          </Paragraph>
          <Icon
            name={icon || 'chevron-right'}
            size={20}
            color={globalStyleConstants.tint(colors)}
          />
        </View>
      </View>
    </Pressable>
  );
};

const RoundedItem = React.memo<SettingsItem>(
  ({ onPress, icon, title, style }) => {
    const { colors } = useTheme();
    return (
      <Pressable onPress={onPress}>
        <View
          style={[
            styles.container,
            styles.containerSettingItem,
            styles.containerSettingRoundedItem,
            { backgroundColor: colors.card },
            style,
          ]}>
          <View>
            <Paragraph color={colors.text}>{title}</Paragraph>
          </View>
          <View>
            <Icon
              name={icon || 'chevron-right'}
              size={20}
              color={globalStyleConstants.tint(colors)}
            />
          </View>
        </View>
      </Pressable>
    );
  },
);

interface SettingsProps {
  navigation: SettingsNavigationProp;
  route: SettingsRouteProp;
  dispatchLogout: () => void;
  id: string;
  profile: Record<string, unknown>;
}

const Settings = ({
  navigation,
  route,
  dispatchLogout,
  id,
  profile,
}: SettingsProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const analytics = useAnalytics();

  const profileState = useSelector((state) => getProfileData(state));

  const secondMajor =
    profileState.university.secondMajor !== undefined &&
    profileState.university.secondMajor !== ''
      ? ` & ${profileState.university.secondMajor}`
      : '';
  const majorDisplay = `${profileState.university.major}` + `${secondMajor}`;

  const handleLogout = () => {
    dispatchLogout();
    analytics.logEvent(
      {
        name: 'LOGOUT',
      },
      true,
    );
  };

  const { setupComplete } = profile.meta;

  const onPressEmail = () => {
    navigation.navigate('SETTINGS_EDIT_PROFILE_DATA', {
      params: { type: 'CHANGE_EMAIL' },
    });
  };

  const onPressFullName = () => {
    navigation.navigate('SETTINGS_EDIT_PROFILE_DATA', {
      params: { type: 'CHANGE_NAME' },
    });
  };

  const onPressGender = () => {
    navigation.navigate('SETTINGS_EDIT_PROFILE_DATA', {
      params: { type: 'CHANGE_GENDER' },
    });
  };

  const onPressMajor = () => {
    navigation.navigate('SETTINGS_EDIT_PROFILE_DATA', {
      params: { type: 'CHANGE_MAJOR' },
    });
  };

  const onPressLocation = () => {
    navigation.navigate('SETTINGS_EDIT_PROFILE_DATA', {
      params: { type: 'CHANGE_LOCATION' },
    });
  };

  const [buildNumber, setBuildNumber] = useState('0');
  useEffect(() => {
    setBuildNumber(DeviceInfo.getBuildNumber());
  }, []);

  return (
    <SafeAreaView>
      <StatusBar theme={theme} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.listPadding}>
        <Separator />
        <ProfileVisibility />
        <Separator />

        <Title3 style={styles.textSectionTitle} color={colors.text}>
          Notifications
        </Title3>
        <Separator />
        <EntryItem
          onPress={() => {
            navigation.navigate('SETTINGS_NOTIFICATIONS_SCREEN');
            // if (isPhoneIOS) {
            //   Linking.openURL('app-settings:').finally();
            // } else {
            //   openSettings().finally();
            // }
            analytics.logEvent(
              {
                name: 'NOTIFICATION SETTINGS EDIT',
              },
              true,
            );
          }}
          title="Push Notifications"
        />
        <Separator />

        <Title3 style={styles.textSectionTitle} color={colors.text}>
          Account Information
        </Title3>
        <Separator />
        {setupComplete ? (
          <>
            <EntryItem
              onPress={onPressFullName}
              title="Name"
              value={profileState.name}
            />
            {/* <Separator />
            <EntryItem onPress={onPressEmail} title="Email" /> */}
            <Separator />
            <EntryItem
              onPress={onPressGender}
              title="Gender"
              value={genderMap[profileState.gender]}
            />
            <Separator />
            <EntryItem
              onPress={onPressMajor}
              title="Major"
              value={majorDisplay}
            />
            <Separator />
            <EntryItem
              onPress={onPressLocation}
              title="Location"
              value={profileState.hometown}
            />
            <Separator />
          </>
        ) : null}
        {/*<EntryItem*/}
        {/*  onPress={() => {*/}
        {/*    navigation.navigate('THEME_SCREEN');*/}
        {/*  }}*/}
        {/*  title="Theme"*/}
        {/*/>*/}

        <Title3 style={styles.textSectionTitle} color={colors.text}>
          Legal
        </Title3>
        <RoundedItem
          onPress={() => {
            Linking.openURL('https://www.popsocial.app/s/privacy.pdf');
            analytics.logEvent(
              {
                name: 'PRIVACY PAGE OPEN',
              },
              true,
            );
          }}
          title="Privacy Policy"
          style={styles.singleRoundedItemMargin}
        />
        <RoundedItem
          onPress={() => {
            Linking.openURL('https://www.popsocial.app/s/terms.pdf');
            analytics.logEvent(
              {
                name: 'CONTENT POLICY PAGE OPEN',
              },
              true,
            );
          }}
          title="Content Policy"
          style={styles.singleRoundedItemMargin}
        />
        <RoundedItem
          onPress={() => {
            {
              navigation.navigate('ABOUT_US_SCREEN');
              analytics.logEvent(
                {
                  name: 'ABOUT US PAGE OPEN ',
                },
                true,
              );
            }
          }}
          title="About Us"
          style={styles.singleRoundedItemMargin}
        />
        <Separator />
        <Title3 style={styles.textSectionTitle} color={colors.text}>
          Contact Pop
        </Title3>
        <RoundedItem
          style={styles.singleRoundedItemMargin}
          onPress={() => {
            navigation.navigate('REPORT_BUG_SCREEN', { onPress: () => {} });
            analytics.logEvent(
              {
                name: 'REPORT BUG PAGE OPEN',
              },
              true,
            );
          }}
          title="Submit a Report"
        />
        <RoundedItem
          onPress={() => {
            navigation.navigate('SEND_FEEDBACK_SCREEN');
            analytics.logEvent(
              {
                name: 'FEEDBACK PAGE OPEN',
              },
              true,
            );
          }}
          title="Send Feedback"
        />
        <LogoutButton onPress={handleLogout} />
        <Paragraph style={styles.textSection} color={colors.text}>
          {Config.env === 'prod'
            ? `Build ${Config.VERSION} (${buildNumber})`
            : `DEV Build ${Config.VERSION} (${buildNumber})`}
        </Paragraph>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (store) => ({
  id: getId(store),
  profile: getProfileData(store),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
