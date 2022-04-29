import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  FlatList,
  Image,
  TextInput,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import commonStyles from 'styles/commonStyles';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@react-navigation/native';
import { CustomHeaderButton, TealHeaderButton } from 'components/HeaderButtons';
import { defaultNavigationOptions } from 'styles/navigation';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import { WidgetType } from 'features/Widgets/WidgetTypes';
import { widgetDelete, widgetEdit } from 'features/Widgets/WidgetActions';
import useAnalytics from 'util/analytics/useAnalytics';

//move to services/api
const SEARCH_ENDPOINT = 'https://api.giphy.com/v1/gifs/search?';
const LIMIT = 25;

const styles = EStyleSheet.create({
  //replace with rem
  _s: {
    hpad: '1rem',
  },
  flatlist: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    height: '7.5 rem',
    width: '7.5 rem',
    marginVertical: '.3 rem',
    marginHorizontal: '.3 rem',
    borderRadius: 10,
  },
  mainGif: {
    flex: 6,
    width: '100%',
  },
  searchContainer: {
    flex: 2,
    width: '100%',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  gifCaption: {
    flex: 1,
    fontSize: 20,
    width: '100%',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  searchInputContainer: {
    width: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '1 rem',
    paddingHorizontal: '1rem',
    padding: '.25rem',
  },
  emptyText: {
    fontSize: '1.5 rem',
  },
});

const DEFAULT_URL =
  'https://www.publicdomainpictures.net/pictures/200000/t2/plain-gray-background.jpg';

const GiphyWidget = ({
  route,
  navigation,
  dispatchDeleteWidget,
  dispatchEditWidget,
  globalWidgets,
}) => {
  const analytics = useAnalytics();
  const getGifDataFromStore = () => {
    const currentGifs: WidgetType[] = [];
    if (globalWidgets) {
      globalWidgets.forEach((widget, idx) => {
        if (widget.type === 'gif') {
          currentGifs.push(widget);
        }
      });
    }
    return currentGifs;
  };
  //pass in add function
  const { addWidget, numWidgets, context, widget } = route.params;
  const theme = useTheme();
  const { colors } = theme;
  const [gifList, setGifList] = useState([]);
  const initialGif =
    context == 'edit' ? 'https://media1.giphy.com' + widget.gif : DEFAULT_URL;
  const [selectedGif, setSelectedGif] = useState(initialGif);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState('Happy');
  const [captionText, setCaptionText] = useState(
    context == 'edit' ? widget.caption : '',
  );
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      ...defaultNavigationOptions,
      headerRightContainerStyle: {
        paddingRight: styles._s.hpad,
      },
      headerLeft: () => (
        <CustomHeaderButton
          name="chevron-left"
          onPress={() => navigation.pop()}
        />
      ),
      headerRight: () => (
        <TealHeaderButton
          label="Done"
          onPress={() => {
            if (selectedGif === DEFAULT_URL) {
              Toast.show({
                text1: 'Please choose a gif.',
                type: 'error',
                position: 'bottom',
              });
            } else if (captionText.length == 0) {
              Toast.show({
                text1: 'Please enter a caption.',
                type: 'error',
                position: 'bottom',
              });
            } else {
              if (context === 'edit') {
                const newWidget = {
                  type: 'gif',
                  gif: selectedGif.split('giphy.com')[1],
                  caption: captionText,
                };
                dispatchEditWidget({ ...newWidget, sequence: widget.sequence });
              } else {
                onAddWidget();
              }

              navigation.pop();
            }
          }}
        />
      ),
    });
  }, [navigation, selectedGif, captionText]);

  useEffect(() => {
    searchMoreGifs();
  }, []);

  const renderItem = ({ item }) => {
    //return gif
    return (
      // <ShimmerPlaceHolder
      //   style={[styles.gif, { backgroundColor: '#F7CDCD' }]}
      //   visible={!loading}>
      <Pressable
        onPress={() => {
          setSelectedGif(item.images.original.url);
        }}>
        <FastImage
          style={styles.gif}
          source={{ uri: `${item.images.original.url}` }}
        />
      </Pressable>
      // </ShimmerPlaceHolder>
    );
  };

  const SearchBar = () => {
    return (
      <TextInput
        style={[
          styles.searchInputContainer,
          { backgroundColor: colors.background, color: colors.text },
        ]}
        placeholder="Search"
        placeholderTextColor={colors.text}
        //value={searchText}
        onSubmitEditing={searchGifs}
      />
    );
  };

  const onAddWidget = () => {
    addWidget({
      type: 'gif',
      sequence: numWidgets,
      gif: selectedGif.split('giphy.com')[1],
      caption: captionText,
      isNewData: true,
    });
  };
  const { GIPHY_API } = Config;

  const deleteWidget = () => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatchDeleteWidget(getGifDataFromStore());
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  //move to services/api
  const searchGifs = (text) => {
    //onAddWidget(); //TODO move to a button
    setLoading(true);
    setPage(LIMIT);
    flatListRef.current?.scrollToOffset({ offset: 0 });
    const query = text.nativeEvent.text;
    analytics.logEvent(
      { name: 'GIF WIDGET SEARCH', data: { search: query } },
      true,
    );
    setSearchText(query);
    fetch(
      `${SEARCH_ENDPOINT}api_key=${GIPHY_API}&q=${query}&limit=${LIMIT}&offset=${0}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setGifList(data.data);
      })
      .finally(() => setLoading(false));
  };

  const searchMoreGifs = () => {
    //check if end reached
    setLoading(true);
    fetch(
      `${SEARCH_ENDPOINT}api_key=${GIPHY_API}&q=${searchText}&limit=${LIMIT}&offset=${page}`,
    )
      .then((response) => response.json())
      .then((data) => {
        const newGifList = [...gifList, ...(data?.data ?? [])];
        setGifList(newGifList);
        setPage(page + data.pagination.count);
        //setGifList([...gifList, data.data]);
      })
      .finally(() => setLoading(false));
  };

  const keyExtractor = ({ id }) => {
    return `gif-${id}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={commonStyles.widgetOuterContainer}>
        <View style={commonStyles.widgetContainer}>
          <Image style={styles.mainGif} source={{ uri: selectedGif }} />
          <TextInput
            style={[styles.gifCaption, { backgroundColor: colors.card }]}
            maxLength={30}
            placeholder="Add a caption"
            placeholderTextColor={colors.text}
            defaultValue={context == 'edit' ? widget.caption : ''}
            onChangeText={(text) => {
              setCaptionText(text);
            }}
          />
        </View>
      </View>
      <View style={[styles.searchContainer]}>
        <SearchBar />
        {gifList.length == 0 && (
          <View style={{ flex: 1 }}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No Results
            </Text>
          </View>
        )}
        <FlatList
          data={gifList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={false}
          numColumns={3}
          ref={flatListRef}
          style={styles.flatlist}
          onEndReached={() => {
            searchMoreGifs();
          }} //do something
          onEndReachedThreshold={0.1}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  globalWidgets: state.widget.widgets,
  addSuccess: state.widget.addSuccess,
  addError: state.widget.error,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDeleteWidget: (payload, ctx: string) =>
    dispatch(widgetDelete(payload, ctx)),
  dispatchEditWidget: (payload: WidgetType) => dispatch(widgetEdit(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GiphyWidget);
