import React, { ReactElement, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import { useTheme } from '@react-navigation/native';
import { View } from 'react-native';
import { TCard } from 'screens/Browse';
import { CardImg } from 'components/Card';
import Avatar from 'components/Avatar';
import { CardHeader } from 'components/Card/CardHeader';
import IconButton from 'components/Buttons/IconButton';
import { AuthAPI, useServiceHook } from 'services/api';
import { getId } from 'util/selectors';
import store from 'store/index';
import {
  DetailedUserCardData,
  ISendRequest,
  SERVICE_LOADED,
} from 'services/types';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store/rootReducer';
import { initialFilters } from 'components/Modals/FilterModal/Filter';
import InviteInputBox from 'screens/Browse/components/CarouselModal/InviteInputBox';
import ReportModal from 'components/Modals/ReportModal';

import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  container: {},
  avatar: {
    marginTop: '-1.0 * 8rem',
  },
  img: {
    borderRadius: 0,
    height: '10rem',
  },
  buttonClose: {
    borderRadius: 50,
    marginTop: '1rem',
    marginLeft: '1rem',
  },
  containerButtonClose: {
    position: 'absolute',
  },
  loader: {
    marginVertical: '1rem',
  },
  containerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reportIcon: {
    alignSelf: 'flex-end',
    marginRight: '1rem',
    marginTop: '0.75rem',
  },
});

interface ICarouselModal {
  isSendRequestSuccess: boolean;
  data: TCard;
  closeModal: () => void;
  sendRequest: (requestProps: ISendRequest) => void;
  isLoading: boolean;
  onKeyboardFocus: () => void;
}

const CarouselModal = ({
  data,
  onKeyboardFocus,
  isLoading,
  isSendRequestSuccess,
  closeModal,
  sendRequest,
}: ICarouselModal): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const [text, setText] = useState('');
  const [isReportModalEnabled, setIsReportModalEnabled] = useState(false);
  const [isKbFocused, setKbFocus] = useState(false);

  const {
    identityId,
    username,
    hometown,
    university,
    avatar,
    card,
    background,
  } = data;
  const { major, gradDate, name } = university;

  const analytics = useAnalytics();

  // Retrieves rest of the widgets
  const cardDetailsService = useServiceHook<
    DetailedUserCardData,
    { id: string; userId: string }
  >(AuthAPI.getSpecificUserCard, {
    id: getId(store.getState()),
    userId: identityId,
  });

  const onKeyboardTap = () => {
    onKeyboardFocus();
    setKbFocus(true);
    analytics.logEvent(
      { name: 'INVITATION MESSAGE TYPE', data: { userId: identityId } },
      true,
    );
  };

  const close = () => {
    closeModal();
  };

  const renderTopLeftIcon = () => (
    <IconButton
      style={[
        styles.buttonClose,
        {
          backgroundColor: colors.card,
        },
      ]}
      containerStyle={styles.containerButtonClose}
      size={32}
      onPress={close}
      iconName="chevron-down"
    />
  );

  const currentlyLoadedFilters = useSelector(
    (state: RootReducer) => state.requests.filters,
  );

  // Determine if the card is a "filter" or a "regular" card
  const getCurrentCardSendType = () => {
    const omittedFilters = [initialFilters, currentlyLoadedFilters].map((e) =>
      _.omit(e, 'isHomebase', 'gender'),
    );

    return _.isEqual(omittedFilters[0], omittedFilters[1])
      ? 'regular'
      : 'filter';
  };

  const onPressSend = () => {
    analytics.logEvent(
      { name: 'INVITATION SEND', data: { userId: identityId } },
      true,
    );
    const { cardNum, createdAt } = data;
    sendRequest({
      receiverId: identityId,
      message: text,
      card: {
        type: getCurrentCardSendType(),
        cardNum,
        createdAt,
      },
    });
  };

  return (
    <View style={styles.container}>
      <CardImg datasrc={background} style={styles.img} />
      {
        // Disable until API is stable
        /* <TouchableOpacity
        style={[styles.reportIcon]}
        onPress={() => {
          setIsReportModalEnabled(true);
        }}>
        <Icon
          style={styles.reportIcon}
          name="dots-horizontal"
          size={28}
          color={colors.gray}
        />
      </TouchableOpacity> */
      }
      <Avatar theme={theme} avatar={avatar} containerStyle={styles.avatar} />
      <CardHeader
        showOptions
        otherUserId={identityId}
        codename={username}
        theme={theme}
        major={major}
        gradClass={gradDate?.toString()}
        location={hometown}
        name={name}
      />
      {cardDetailsService.status === SERVICE_LOADED ? (
        <>
          {cardDetailsService.payload.card.card.widgets.map((e) => {
            return (
              <WidgetDisplay
                browseView={false}
                data={card}
                widget={{ ...e, identityId }}
                nonExpand
                style={{ flex: 1 }}
              />
              // WIDGET LIKING => <WidgetsV2.ExpandedCarouselWidget data={e} />
            );
          })}
          <InviteInputBox
            isSendRequestSuccess={isSendRequestSuccess}
            text={text}
            isKbFocused={isKbFocused}
            onKeyboardTap={onKeyboardTap}
            setKbFocus={setKbFocus}
            onKeyboardFocus={onKeyboardFocus}
            setText={setText}
            isLoading={isLoading}
            onPressSend={onPressSend}
          />
        </>
      ) : (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}
      {renderTopLeftIcon()}
      <ReportModal
        id={identityId}
        toggle={() => setIsReportModalEnabled(!isReportModalEnabled)}
        hasToggled={isReportModalEnabled}
      />
    </View>
  );
};

export default CarouselModal;
