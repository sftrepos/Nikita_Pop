import React, { ReactElement, useEffect, useRef } from 'react';
import { TCard } from 'screens/Browse';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import CardBody from 'screens/Browse/components/Carousel/CardBody';
import CarouselModal from 'screens/Browse/components/CarouselModal';
import { Modalize } from 'react-native-modalize';
import TouchableScale from 'react-native-touchable-scale';
import { Portal } from 'react-native-portalize';
import { touchableScaleTensionProps } from 'styles/commonStyles';
import { width } from 'util/phone';
import _ from 'lodash';
import { ISendRequest } from 'services/types';

import useAnalytics from 'util/analytics/useAnalytics';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from 'store/rootReducer';
import { resetRequests } from 'features/Request/RequestActions';
import QuickSendButton from 'components/Buttons/QuickSendButton';
import QuickInviteScreen from '../CarouselModal/QuickInviteScreen';

const styles = EStyleSheet.create({
  _measurements: {
    stdRem: '1rem',
    r15: '1.5rem',
    r: '6rem',
  },
  container: {
    alignItems: 'center',
    marginVertical: '2rem',
    borderRadius: 25,
  },
  containerInner: {
    borderRadius: 25,
  },
  modal: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  quickSendButton: {
    alignSelf: 'center',
    bottom: '-1.5rem', // half the size of QuickSendButton component size
    position: 'absolute',
  },
});

interface ICard {
  data: TCard;
  sendRequest: (requestProps: ISendRequest) => void;
  isSendRequestSuccess: boolean;
  isLoading: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const Card = ({
  data,
  sendRequest,
  isLoading,
  isSendRequestSuccess,
  containerStyle,
  type,
}: ICard): ReactElement => {
  const { colors } = useTheme();
  const modalRef = useRef<Modalize>(null);
  const quickInviteModalRef = useRef<Modalize>(null);
  const contentRef = useRef<ScrollView>(null);
  const {
    identityId,
    username,
    hometown,
    university,
    avatar,
    card,
    background,
    meta,
  } = data;
  const { major, gradDate, name } = university;

  const analytics = useAnalytics();
  const redirectedToEditProfile = useSelector(
    (state: RootReducer) => state.requests.redirectedToEditProfile,
  );
  const dispatch = useDispatch();

  let eventName = '';
  if (type == 'quiz') {
    eventName = 'QUIZ RECOMMENDATION';
  } else {
    eventName = 'CAROUSEL';
  }

  useEffect(() => {
    if (isSendRequestSuccess) {
      closeModal();
      closeQuickInviteModal();
    }
  }, [isSendRequestSuccess]);

  // a bit of a hack to close these modals when a user redirects to Profile Edit tab
  // via the RequestWidgetErrorModal button
  useEffect(() => {
    if (redirectedToEditProfile) {
      closeModal();
      dispatch(resetRequests());
    }
  }, [redirectedToEditProfile]);

  const onKeyboardFocus = () => {
    _.throttle(() => {
      contentRef.current?.scrollToEnd({ animated: true });
    }, 1000)();
  };

  //
  // Carousel Modal
  //

  const onPress = () => {
    modalRef.current?.open();
    analytics.logEvent(
      { name: `${eventName} CARD EXPAND`, data: { userId: identityId } },
      true,
    );
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  //
  // Quick Send Modal
  //

  const onPressQuickInvite = () => {
    quickInviteModalRef.current?.open();
    analytics.logEvent(
      {
        name: `${eventName} QUICK INVITE CARD EXPAND`,
        data: { userId: identityId },
      },
      true,
    );
  };

  const closeQuickInviteModal = () => {
    quickInviteModalRef.current?.close();
  };

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <TouchableScale
          hitSlop={{ bottom: styles._measurements.r15 }}
          onPress={onPress}
          {...touchableScaleTensionProps}>
          <View
            style={[
              styles.containerInner,
              {
                backgroundColor: colors.card,
                width: width - styles._measurements.stdRem * 5,
              },
            ]}>
            <CardBody
              avatar={avatar}
              username={username}
              major={major}
              gradDate={gradDate}
              hometown={hometown}
              datasrc={background}
              card={{ ...card, identityId }}
              onPress={onPress}
              name={name}
              meta={meta}
            />
          </View>
          <QuickSendButton
            onPress={onPressQuickInvite}
            containerStyle={styles.quickSendButton}
          />
        </TouchableScale>
      </View>
      <Portal>
        <Modalize
          useNativeDriver
          contentRef={contentRef}
          ref={modalRef}
          handlePosition="inside"
          adjustToContentHeight={true}
          modalStyle={[styles.modal, {}]}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: colors.card,
            },
            keyboardShouldPersistTaps: 'handled',
          }}
          onClosed={() =>
            analytics.logEvent(
              { name: `${eventName} CARD CLOSE`, data: { userId: identityId } },
              true,
            )
          }>
          <CarouselModal
            isSendRequestSuccess={isSendRequestSuccess}
            onKeyboardFocus={onKeyboardFocus}
            isLoading={isLoading}
            sendRequest={sendRequest}
            data={data}
            closeModal={closeModal}
          />
        </Modalize>
        <Modalize
          useNativeDriver
          ref={quickInviteModalRef}
          withHandle={false}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'handled',
          }}
          adjustToContentHeight={true}
          // modalTopOffset={styles._measurements.r}
          modalStyle={[styles.modal, { backgroundColor: 'transparent' }]}
          closeOnOverlayTap={true}
          onClose={() =>
            analytics.logEvent(
              {
                name: `${eventName} QUICK INVITE CARD CLOSE`,
                data: { userId: identityId },
              },
              true,
            )
          }>
          <QuickInviteScreen
            data={data}
            onClose={closeQuickInviteModal}
            isSendRequestSuccess={isSendRequestSuccess}
            onKeyboardFocus={onKeyboardFocus}
            isLoading={isLoading}
            sendRequest={sendRequest}
          />
        </Modalize>
      </Portal>
    </>
  );
};

export default Card;
