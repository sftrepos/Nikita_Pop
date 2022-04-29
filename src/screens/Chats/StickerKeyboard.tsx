import React, { useState, useRef, useEffect } from 'react';
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

const SEARCH_ENDPOINT = 'https://api.giphy.com/v1/stickers/search?';

const TRANDING_ENDPOINT = 'https://api.giphy.com/v1/stickers/trending?';
const LIMIT = 24;
const { height, width } = Dimensions.get('window');
const styles = EStyleSheet.create({
  flatlist: {
    width: '100%',
  },

  sticker: {
    height: height / 6,
    width: width / 3,
    marginVertical: '.18 rem',
    marginHorizontal: '.18 rem',
  },
});

type StickerKeyboardProps = {
  text: string;
  onPressSendFileMessage: (file: string) => void;
  hide: boolean;
};

const StickerKeyboard: React.FC<StickerKeyboardProps> = ({
  text,
  onPressSendFileMessage,
  hide,
}) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stickerList, setStickerList] = useState([]);
  const { colors } = useTheme();

  const { GIPHY_API } = Config;

  const renderItem = ({ item }: any) => {
    return (
      <Pressable
        onPress={() => onPressSendFileMessage(item.images.original.url)}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.sticker}
          source={{ uri: `${item.images.original.url}` }}
        />
      </Pressable>
    );
  };

  useEffect(() => {
    let url = `${TRANDING_ENDPOINT}api_key=${GIPHY_API}&limit=${LIMIT}&offset=${0}`;
    searchStickers({ url });
  }, []);

  useEffect(() => {
    let url = `${SEARCH_ENDPOINT}api_key=${GIPHY_API}&q=${text}&limit=${LIMIT}&offset=${0}`;
    text.length && searchStickers({ url });
  }, [text]);

  const searchStickers = ({ url }: { url: string }) => {
    setLoading(true);
    setPage(LIMIT);
    fetch(url)
      .then((response) => response.json())
      .then((data) => setStickerList(data.data))
      .finally(() => setLoading(false));
  };

  const searchMoreStickers = () => {
    let url = `${TRANDING_ENDPOINT}api_key=${GIPHY_API}&limit=${LIMIT}&offset=${page}`;
    if (text?.length) {
    }
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const newStickersList: any = [...stickerList, ...(data?.data ?? [])];
        setStickerList(newStickersList);
        setPage(page + data.pagination.count);
      })
      .finally(() => setLoading(false));
  };

  const keyExtractor = ({ id }: any) => {
    return `sticker-${id}`;
  };

  if (hide) return <></>;

  return (
    <View style={{ height: height / 6, justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={stickerList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          style={styles.flatlist}
          onEndReached={searchMoreStickers}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

export default StickerKeyboard;
