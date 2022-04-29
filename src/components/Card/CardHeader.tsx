import { ExtendedTheme } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Paragraph, Title } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getId } from 'util/selectors';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from 'components/Buttons/IconButton';
import { showReportBlockModal } from 'features/User/UserActions';
import ReportBlockModal from 'components/Modals/ReportModal/ReportBlockModal';
import useAnalytics from 'util/analytics/useAnalytics';
import store from 'store/index';

interface CardHeaderProps {
  codename: string;
  theme: ExtendedTheme;
  major: string;
  gradClass: string;
  location: string;
  name: string;
  secondMajor?: string;
  showOptions?: boolean;
  showEditVaccineBadge?: boolean;
  otherUserId?: string;
}

const styles = EStyleSheet.create({
  _measurements: {
    rem_1: '1rem',
    rem_15: '1.5rem',
  },
  _c: {
    hr: '.5 rem',
    r: '1 rem',
    grey: '$grey5',
  },
  headerBody: {
    alignItems: 'center',
    // marginVertical: '1 rem',
    paddingHorizontal: '.5 rem',
    // flex: 1,
  },
  headerBodyInfo: {
    alignItems: 'center',
    marginVertical: '0.5 rem',
  },
  headerInfoItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center', // commented out since long string length of location, 2 lines
  },
  iconView: {
    marginHorizontal: '.4rem',
    alignItems: 'flex-end',
    alignSelf: 'center',
    flex: 1,
  },
  locationIconView: {
    marginHorizontal: '.2rem',
    alignItems: 'flex-end',
    flex: 1,
  },
  paragraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
    textAlign: 'center',
  },
  headerBodyTextLocation: { textTransform: 'uppercase', fontWeight: '500' },
  miniHeader: {
    fontSize: '1.2 rem',
  },
  miniSubHeader: {
    fontSize: '.9 rem',
  },
  reportBlockIcon: {
    borderRadius: 50,
    backgroundColor: 'transparent',
    color: 'white',
  },
  reportBlockIconContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    right: '1rem',
    top: '-11rem',
  },
});
export const CardHeader = ({
  codename,
  theme,
  major,
  gradClass,
  location,
  avatar,
  name,
  secondMajor,
  showOptions,
  otherUserId,
  showEditVaccineBadge,
}: CardHeaderProps): ReactElement => {
  const { colors } = theme;

  // hack for appearance on iPhone SE 2nd Gen
  const screenHeight = Dimensions.get('screen').height;
  const headerFontSize = screenHeight < 700 ? styles.miniHeader : {};
  const subheaderFontSize = screenHeight < 700 ? styles.miniSubHeader : {};
  const margin =
    screenHeight < 700
      ? styles._measurements.rem_1 * 0.5
      : styles._measurements.rem_1;

  const id = getId(store.getState());
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const onPressOptions = () => {
    // dispatch(ConversationSlice.actions.setProfileOpen(false));
    dispatch(showReportBlockModal(true));
    analytics.logEvent(
      {
        name: 'CHATROOM REPORT BLOCK MODAL OPEN',
        data: { userId: otherUserId },
      },
      true,
    );
  };

  return (
    <View style={[styles.headerBody, { marginVertical: margin }]}>
      {showOptions && (
        <>
          <IconButton
            style={[styles.reportBlockIcon]}
            containerStyle={styles.reportBlockIconContainer}
            iconColor={colors.white}
            size={28}
            onPress={onPressOptions}
            // iconName="alert-octagon"
            iconName="dots-horizontal"
          />
          <ReportBlockModal otherUserId={otherUserId} type={'chat'} />
        </>
      )}
      <Title style={headerFontSize} color={colors.text}>
        {codename}
      </Title>
      <View style={styles.headerInfoItem}>
        <View style={styles.iconView}>
          <Icon name="school" size={styles._c.r} color={colors.gray} />
        </View>
        <Paragraph style={styles.paragraph} color={'#8397EA'}>
          {gradClass}
        </Paragraph>
        <View style={styles.iconView} />
      </View>
      <Paragraph style={styles.paragraph} color={colors.darkgrey}>
        {major}
        {!!secondMajor && secondMajor != 'Skip' ? ` & ${secondMajor}` : ''}
      </Paragraph>

      <View style={[styles.headerInfoItem, { marginTop: styles._c.hr }]}>
        <View style={styles.locationIconView}>
          <Icon name="map-marker" size={styles._c.r} color={colors.gray} />
        </View>
        <Paragraph
          style={[styles.paragraph, styles.headerBodyTextLocation]}
          color={'#8397EA'}>
          {location}
        </Paragraph>
        <View style={styles.locationIconView} />
      </View>
      <Paragraph style={styles.paragraph} color={colors.darkgrey}>
        {name}
      </Paragraph>
    </View>
  );
};
