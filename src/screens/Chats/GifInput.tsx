import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const SEARCH_ENDPOINT = 'https://api.giphy.com/v1/gifs/search?';

const TRANDING_ENDPOINT = 'https://api.giphy.com/v1/gifs/trending?';
const LIMIT = 24;
const { height } = Dimensions.get('window');

const styles = EStyleSheet.create({
  flatlist: {
    width: '100%',
  },

  gif: {
    height: height / 6.5,
    width: height / 5.5,
    marginVertical: '.2 rem',
    marginHorizontal: '.2 rem',
    borderRadius: 8,
  },
});

type GifInputProps = {
  text: string;
  onPressSendFileMessage: (file: string) => void;
  hide: boolean;
};

const GifInput: React.FC<GifInputProps> = ({
  text,
  onPressSendFileMessage,
  hide,
}) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gifList, setGifList] = useState([]);
  const { colors } = useTheme();

  const { GIPHY_API } = Config;

  const renderItem = ({ item }: any) => {
    return (
      <Pressable
        onPress={() => onPressSendFileMessage(item.images.original.url)}>
        <FastImage
          style={styles.gif}
          source={{ uri: `${item.images.original.url}` }}
        />
      </Pressable>
    );
  };

  useEffect(() => {
    const url = `${TRANDING_ENDPOINT}api_key=${GIPHY_API}&limit=${LIMIT}&offset=${0}`;
    searchGifs({ url });
  }, []);

  useEffect(() => {
    const url = `${SEARCH_ENDPOINT}api_key=${GIPHY_API}&q=${text}&limit=${LIMIT}&offset=${0}`;
    text.length && searchGifs({ url });
  }, [text]);

  const searchGifs = ({ url }: { url: string }) => {
    setLoading(true);
    setPage(LIMIT);
    fetch(url)
      .then((response) => response.json())
      .then((data) => setGifList(data.data))
      .finally(() => setLoading(false));
  };

  const searchMoreGifs = () => {
    const url = `${TRANDING_ENDPOINT}api_key=${GIPHY_API}&limit=${LIMIT}&offset=${page}`;
    if (text?.length) {
    }
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const newGifList: any = [...gifList, ...(data?.data ?? [])];
        setGifList(newGifList);
        setPage(page + data.pagination.count);
      })
      .finally(() => setLoading(false));
  };

  const keyExtractor = ({ id }: any) => {
    return `gif-${id}`;
  };

  if (hide) return <></>;

  return (
    <View style={{ height: height / 6, justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={gifList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          style={styles.flatlist}
          onEndReached={searchMoreGifs}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

export default GifInput;
