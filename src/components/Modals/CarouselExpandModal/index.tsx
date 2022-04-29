import React, { ReactElement, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  BrowseCard,
  DetailedUserCardData,
  SERVICE_LOADED,
} from 'services/types';
import { CardImg } from 'components/Card';
import Avatar from 'components/Avatar';
import { CardHeader } from 'components/Card/CardHeader';
import { AuthAPI, useServiceHook } from 'services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { height, isAndroid } from 'util/phone';
import { getId } from 'util/selectors';
import store from 'store/index';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { NotifierWrapper } from 'react-native-notifier';
import { WidgetDisplayType } from 'screens/Profile';

export const CARD_HEIGHT = height - Math.ceil(height * 0.2);

const styles = EStyleSheet.create({
  _s: {
    marginBottom: '1rem',
  },
  container: {
    flex: 1,
  },
  img: {
    height: 200,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  avatar: {
    marginTop: '-1.0 * 6rem',
  },
  buttonRequest: {
    width: '4rem',
    height: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  containerText: {
    marginVertical: '1rem',
  },
  dialog: {
    margin: '1rem',
  },
  transform: {
    transform: [{ rotateZ: '-45deg' }, { translateX: 4 }],
  },
  expdCard: {
    marginBottom: '1rem',
  },
});

interface CarouselIconProps {
  onPress: () => void;
  theme: Theme;
  style?: StyleProp<ViewStyle>;
  errors?: boolean;
  isLoading: boolean;
  disabled: boolean;
  icon: string;
}

export const CarouselIcon = ({
  onPress,
  theme,
  isLoading,
  disabled,
  style,
  icon,
  errors,
}: CarouselIconProps): ReactElement => {
  const { colors } = theme;
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.buttonRequest,
            {
              backgroundColor:
                errors || isLoading
                  ? colors.border
                  : pressed
                  ? colors.border
                  : colors.primary,
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Icon style={style} name={icon} color="white" size={36} />
          )}
        </View>
      )}
    </Pressable>
  );
};

interface CarouselExpandModelProps {
  data: BrowseCard;
  onPressClose: () => void;
  scrollTo?: (xVal: number, yVal: number) => void;
  fake?: boolean;
  yCoordinate?: number;
  sendRequest: (message: string, widget: WidgetDisplayType) => void;
}

const CarouselExpandModal = ({
  data,
  onPressClose,
  scrollTo,
  fake,
  yCoordinate,
  sendRequest,
}: CarouselExpandModelProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  const {
    background,
    avatar,
    username,
    university,
    hometown,
    identityId,
    card,
  } = data;
  const { major, gradDate, name, secondMajor } = university;

  const getCardService = fake
    ? null
    : useServiceHook<DetailedUserCardData, { id: string; userId: string }>(
        AuthAPI.getSpecificUserCard,
        {
          id: getId(store.getState()),
          userId: identityId,
        },
        [data],
      );

  const [yCoord, setYCoord] = useState(yCoordinate);
  const [newYCoordinate, setNewYCoordinate] = useState(0);

  return (
    <NotifierWrapper>
      <>
        <CardImg style={styles.img} datasrc={background} />
        <Avatar
          onPress={() => {}}
          theme={theme}
          avatar={avatar}
          containerStyle={styles.avatar}
        />
        {isAndroid && (
          <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <Icon
              name="chevron-down"
              onPress={() => {
                onPressClose();
              }}
              size={35}
              color={colors.text}
            />
          </View>
        )}

        <CardHeader
          codename={username}
          theme={theme}
          major={major}
          gradClass={gradDate?.toString()}
          location={hometown}
          name={name}
          secondMajor={secondMajor}
        />
        <View style={{ height: 20 }}></View>
        {!fake &&
          getCardService?.status === SERVICE_LOADED &&
          getCardService.payload.card.card.widgets.map((e, i) => {
            return (
              <View
                style={styles.expdCard}
                onLayout={({
                  nativeEvent: {
                    layout: { x, y, width, height },
                  },
                }) => {
                  setNewYCoordinate(y);
                }}>
                <WidgetDisplay
                  sendRequest={sendRequest}
                  style={{}}
                  widget={e}
                  isExpandedCard={true}
                  scrollTo={scrollTo}
                  yCoordinate={newYCoordinate}
                  data={data}
                />
              </View>
            );
          })}
        {fake && (
          <WidgetDisplay
            widget={card}
            // isExpandedCard={true}
            scrollTo={scrollTo}
          />
        )}

        <View></View>
      </>
    </NotifierWrapper>
  );
};

export default CarouselExpandModal;
