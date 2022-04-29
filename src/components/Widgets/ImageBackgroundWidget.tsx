import React, { useState, useEffect, ReactElement } from 'react';
import {
  View,
  Dimensions,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import EStyleSheet from 'react-native-extended-stylesheet';
import commonStyles from 'styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'features/User/UserActions';
import { PopApi } from 'services/api';
import { getId, getStoreToken } from 'util/selectors';
import { RootReducer } from 'store/rootReducer';
import Tabs from 'components/Tabs';

const WIDTH = Dimensions.get('window').width;

const styles = EStyleSheet.create({
  _calc: {
    h: '7.5rem',
    w: '7.5rem',
  },
  imageList: {
    flex: 1.5,
  },
  image: {
    marginVertical: '.3 rem',
    marginHorizontal: '.3 rem',
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    width: WIDTH,
    backgroundColor: 'gray',
  },
  tabView: {
    flex: 2,
    width: '100%',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: '0.5rem',
  },
  imgLoadContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

const TABS = ['Activities', 'Nature', 'Characters', 'Patterns', 'Culture'];

const ImageBackgroundWidget = (): ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { colors } = theme;
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currBackground, setCurrBackground] = useState(
    useSelector(
      (state: RootReducer) => state.user.localUser.card?.background || '',
    ),
  );
  const [images, setImages] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean[]>([]);

  const id = useSelector(getId);
  const token = useSelector(getStoreToken);

  useEffect(() => {
    PopApi.getBackgroundImages({
      params: {
        id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(({ response }) => {
      const images = response.data.data;
      const emptyImagesArr = [...Array(images.length)];
      setImages(images);
      setLoading(emptyImagesArr.fill(true));
    });
  }, []);

  const filter = _.memoize((pattern: string) =>
    images.filter((i) => i.startsWith(pattern)),
  );

  useEffect(() => {
    dispatch(updateProfile({ card: { background: currBackground } }));
  }, [currBackground]);

  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setCurrBackground(item);
        }}>
        <FastImage
          style={[
            styles.image,
            { height: styles._calc.h, width: styles._calc.w },
          ]}
          onLoadEnd={() => {
            const loadingCpy = [...loading];
            loadingCpy[index] = false;
            setLoading(loadingCpy);
          }}
          source={{
            priority: FastImage.priority.high,
            uri:
              'https://storage.googleapis.com/background_v1_thumbnail/' + item,
          }}>
          <View
            style={[
              styles.imgLoadContainer,
              loading[index] && { backgroundColor: colors.border },
            ]}
          />
        </FastImage>
      </Pressable>
    );
  };

  return (
    <>
      <View
        style={[
          commonStyles.widgetContainer,
          { backgroundColor: colors.border, width: '100%' },
        ]}>
        <FastImage
          style={{ height: '100%', width: '100%' }}
          source={{
            priority: FastImage.priority.high,
            uri:
              'https://storage.googleapis.com/background_v1c/' + currBackground,
          }}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Tabs tabs={TABS} setTab={setActiveTab} />
        <FlatList
          removeClippedSubviews={true}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.contentContainerStyle}
          data={filter(activeTab)}
          numColumns={3}
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

export default ImageBackgroundWidget;
