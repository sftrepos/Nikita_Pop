import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Subtitle, Title, Title3 } from 'components/Text';
import { Switch, View } from 'react-native';
import { AuthAPI } from 'services/api';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getId, getProfileData } from 'util/selectors';
import { hideProfile } from 'features/User/UserActions';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  container: {
    padding: '1 rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    paddingTop: '.5 rem',
    fontSize: '.75 rem',
    fontWeight: '400',
  },
  textContainer: {
    width: '75%',
  },
});

const data = {
  title: 'Profile visibility',
  desc: 'Turning your profile visibility off will hide your card from new users. This will not affect your current matches.',
};

interface IProfileVisibility {}
const ProfileVisibility = React.memo<IProfileVisibility>(({}) => {
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const analytics = useAnalytics();

  const id = useSelector((state) => getId(state));
  const profile = useSelector((state) => getProfileData(state));
  const [isEnabled, setIsEnabled] = useState(profile.meta.hideProfile);

  const handleHideProfile = (state: boolean) => {
    const data = {
      id: id,
      hideProfile: state,
    };
    AuthAPI.hideProfile(data)
      .then((res) => {
        // console.log("Back! res ", res)
      })
      .catch((err) => {
        // console.log("Back! err ", err)
      });
    dispatch(hideProfile(state));
    setIsEnabled(state);
    analytics.logEvent(
      {
        name: 'SETTINGS SCREEN PROFILE VISIBILITY EDIT',
        data: { hideProfile: state },
      },
      true,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Title3 style={styles.title} color={colors.text}>
          {data.title}
        </Title3>
        <Subtitle style={styles.subtitle} color={colors.gray}>
          {data.desc}
        </Subtitle>
      </View>
      <Switch
        trackColor={{ false: 'lightgray', true: colors.primary }}
        // thumbColor={isEnabled ? colors.white : colors.white}
        ios_backgroundColor="lightgray"
        onValueChange={handleHideProfile}
        value={isEnabled}
      />
    </View>
  );
});

export default ProfileVisibility;
