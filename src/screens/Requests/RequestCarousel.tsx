import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Carousel from 'react-native-snap-carousel';
import { useTheme } from '@react-navigation/native';
import { width } from 'util/phone';
import commonStyles from 'styles/commonStyles';
import { Paragraph } from 'components/Text';
import RequestCarouselItem from 'screens/Requests/RequestCarouselItem';
import ActionButton from 'components/Buttons/ActionButton';
import useAnalytics from 'util/analytics/useAnalytics';

export const styles = EStyleSheet.create({
  _s: {
    width: '5rem',
  },
  container: {
    flex: 1,
  },
  refresh: {
    color: '$raspberry',
    textAlign: 'center',
    marginVertical: '1rem',
  },
  slideStyle: {
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderItemWithIcon: {},
  textWithIconWrap: {
    flexDirection: 'row',
  },
  cardBody: {
    paddingVertical: '1rem',
  },
  pagination: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    padding: '1rem',
  },
  facadeInputBox: {
    paddingHorizontal: '1rem',
    padding: '0.5rem',
  },
  send: {
    alignSelf: 'center',
    padding: '0.5rem',
    paddingLeft: '1rem',
  },
  rowTextIconWrap: {},
  rowText: {
    paddingLeft: '0.25rem',
  },
  wrapCardHeaderMiddle: {
    flex: 1,
    paddingLeft: '0.5rem',
  },
  italicText: {
    marginBottom: '0.5rem',
    fontStyle: 'italic',
  },
  locationWrapper: {
    marginLeft: '1rem',
  },
  emptyText: {
    color: '$grey3',
    marginBottom: '1rem',
  },
  emptyButtonText: {
    fontStyle: 'normal',
    textAlign: 'center',
    fontSize: '$fontMd',
    letterSpacing: 2,
    fontWeight: '500',
    marginHorizontal: '2rem',
  },
});

type IRequest = unknown[];

interface IRequestCarouselProps {
  requests: IRequest;
  navigation: any;
  deleteRequest: (id: string) => void;
  acceptRequest: (id: string, msg: string) => void;
  fetchRequests: () => void;
}

const EmptyList = ({ onPress }: { onPress: () => void }): ReactElement => (
  <View style={[commonStyles.container, { width: width - styles._s.width }]}>
    <Text style={styles.emptyText}>No invites yet, Check back later!</Text>
    <ActionButton
      onPress={onPress}
      onPressIn={onPress}
      label={'Check Again'}
      type="default"
      gradient
      textStyle={styles.emptyButtonText}
    />
  </View>
);

interface RequestCarouselPaginationProps {
  requestsLength: number;
  activeIndex: number;
}

const RequestCarouselPagination = ({
  requestsLength,
  activeIndex,
}: RequestCarouselPaginationProps): ReactElement => {
  const { colors } = useTheme();
  return (
    <View style={[styles.pagination]}>
      <Paragraph
        style={[styles.italicText, { color: colors.gray }]}
        color={colors.text}>{`Invite ${
        activeIndex + 1
      } of ${requestsLength}`}</Paragraph>
    </View>
  );
};

const RequestCarousel = ({
  requests = [],
  navigation,
  acceptRequest,
  deleteRequest,
  fetchRequests,
}: IRequestCarouselProps): ReactElement => {
  const analytics = useAnalytics();
  const theme = useTheme();
  const { colors } = theme;
  const [activeIndex, setActiveIndex] = useState(0);

  const renderEmpty = () => (
    <EmptyList
      onPress={fetchRequests}
      onPressIn={analytics.logEvent(
        { name: 'INVITATION REFRESH', data: {} },
        true,
      )}
    />
  );

  const onAcceptRequest = (id: string, msg: string) => {
    acceptRequest(id, msg);
  };

  const renderItem = ({ item, index }) => {
    return (
      <RequestCarouselItem
        acceptRequest={onAcceptRequest}
        deleteRequest={deleteRequest}
        item={item}
        index={index}
      />
    );
  };

  const carouselRef = useRef<Carousel<IRequest>>(null);

  const onSnapToItem = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Carousel
        ref={carouselRef}
        slideStyle={styles.slideStyle}
        itemWidth={width - styles._s.width}
        sliderWidth={width}
        ListEmptyComponent={renderEmpty}
        data={requests}
        onSnapToItem={onSnapToItem}
        renderItem={renderItem}
      />
      {!!requests.length && (
        <RequestCarouselPagination
          requestsLength={requests.length}
          activeIndex={activeIndex}
        />
      )}
    </View>
  );
};

export default RequestCarousel;
