import { useTheme } from '@react-navigation/native';
import React, { ReactElement, useEffect, useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import SnapCarousel from 'react-native-snap-carousel';
import { DispatchGetBrowsingCards, TCard } from 'screens/Browse';
import { ISendRequest } from 'services/types';
import ActivityIndicator from 'components/ActivityIndicator';
import { width } from 'util/phone';
import Card from './Card';
import EmptyCard from './EmptyCard';

interface ICarousel {
  data: TCard[];
  sendRequest: (requestProps: ISendRequest) => void;
  isLoading: boolean;
  isLoadingBrowsing: boolean;
  requestIdInProgress: string;
  isSendRequestSuccess: boolean;
  isHomebase: boolean;
  dispatchGetBrowsingCards: (args: DispatchGetBrowsingCards) => void;
}

const styles = EStyleSheet.create({
  _measurements: {
    edgeWidth: '5rem',
  },
  slide: {
    justifyContent: 'center',
  },
});

const Carousel = ({
  data,
  sendRequest,
  isLoading,
  isLoadingBrowsing,
  requestIdInProgress,
  isSendRequestSuccess,
  isHomebase,
  dispatchGetBrowsingCards,
}: ICarousel): ReactElement => {
  const { colors } = useTheme();
  const [pg, setPg] = useState(0);
  const ITEM_WIDTH = width - styles._measurements.edgeWidth;

  useEffect(() => {
    if (pg && data && data.length > 1) {
      dispatchGetBrowsingCards({ index: pg, shownCards: data });
    }
  }, [pg]);

  const renderItem = ({ item }: { item: TCard }) => {
    return (
      <Card
        isSendRequestSuccess={isSendRequestSuccess}
        sendRequest={sendRequest}
        isLoading={isLoading && item.identityId === requestIdInProgress}
        data={item}
      />
    );
  };

  const onEndReached = () => {
    setPg(pg + 1);
  };

  if (isLoadingBrowsing && data.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {<ActivityIndicator color={colors.primary} />}
      </View>
    );
  } else if (!isLoadingBrowsing && data && data.length === 0) {
    return <EmptyCard isHomebase={isHomebase} />;
  } else {
    return (
      <SnapCarousel
        data={data}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        itemWidth={ITEM_WIDTH}
        sliderWidth={width}
        slideStyle={styles.slide}
        renderItem={renderItem}
      />
    );
  }
};

export default Carousel;
