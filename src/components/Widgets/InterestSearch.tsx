import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Title2, Paragraph } from 'components/Text';
import StatusBar from 'components/StatusBar';
import { ActivityIndicator } from 'react-native-paper';
import { PopApi } from 'services/api';
import _ from 'lodash';
import { Interest } from 'services/types';
import store from 'store/index';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import Surface from 'components/Surface';
import { getId, getStoreToken } from 'util/selectors';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { toggleInterest } from 'features/Interests/InterestSlice';
import AddInterestModal from 'components/Modals/AddInterestModal';
import { useHeaderHeight } from '@react-navigation/stack';
import { RootReducer } from 'store/rootReducer';

const styles = EStyleSheet.create({
  separator: {
    width: '100%',
    paddingLeft: '1rem',
    paddingBottom: '.25rem',
    borderBottomWidth: '.4rem',
  },
  searchInputContainer: {
    width: '95%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '1rem',
    padding: '.25rem',
    marginBottom: '1rem',
    alignSelf: 'center',
    fontSize: '1rem',
  },
  sectionTitle: {
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: '.8rem',
    color: 'gray',
  },
  searchResultContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: '1rem',
    borderBottomWidth: '.1rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: '.25rem',
  },
  searchResultList: {
    width: '100%',
    height: '90%',
    // marginBottom: '1rem',
    paddingBottom: '5rem',
  },
  addInterestButton: {
    // justifyContent: 'center',
    // alignItems: 'center',
    margin: '.5rem',
    marginLeft: '1.25rem',
  },
  activityIndicator: {
    margin: '1rem',
  },
});

const SEARCH_LIMIT = 20;

const InterestSearch = ({ navigation, route, selectedInterests }) => {
  const { category, MAX_INTERESTS } = route.params;
  const HEADER_HEIGHT = useHeaderHeight();
  const id = getId(store.getState());
  const token = getStoreToken(store.getState());
  const theme = useTheme();
  const { colors } = theme;
  const [recommended, setRecommended] = useState([]); // recommended results
  const [searched, setSearched] = useState([]); // search results
  const [currentPage, setCurrentPage] = useState(0); // search results page number
  const [searchText, setSearchText] = useState(''); // search text
  const [scrolling, setScrolling] = useState(false); // for flatlist rendering
  const [modalVisible, setModalVisible] = useState(false); // AddInterestModal
  const [listPos, setListPos] = useState(0); // for height of list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    PopApi.getRecommendedInterests({
      params: {
        interest: category,
      },
    }).then(({ response }) => {
      setRecommended(response.data.interests);
      setLoading(false);
      expandList();
    });
  }, []);

  const addCustomInterest = (name: string, categoryId: string) => {
    PopApi.addCustomInterest(
      {
        id,
        categoryId,
        title: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        if (response.error) {
          const msg = response.error.data.msg;
          if (msg) {
            Toast.show({
              text1: `${msg}`,
              type: 'error',
              position: 'bottom',
            });
          } else {
            // Usually a mongodb error
            Toast.show({
              text1: `Failed to add interest`,
              type: 'error',
              position: 'bottom',
            });
          }
        } else {
          const title = response.response.data.data.title;
          const category = response.response.data.data.categoryId;
          Toast.show({
            text1: `Successfully added ${title}`,
            type: 'success',
            position: 'bottom',
          });
          store.dispatch(toggleInterest({ title, categoryId: category }));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => onSearch(searchText, currentPage, false));
  };

  const debounceSearch = useCallback(
    _.debounce(
      (nextValue: string, page: number) => onSearch(nextValue, page, false),
      25,
    ),
    [], // will be created only once initially
  );

  const onSearch = (search: string, page: number, more: boolean) => {
    PopApi.searchInterests(
      {
        id,
        search,
        limit: SEARCH_LIMIT,
        page,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(({ response }) => {
        if (more) {
          if (response.data.results.length > 0) {
            const toInterests = response.data.results.map((item) => {
              return { title: item.title, categoryId: item.categoryId };
            });
            const newInterests = [...searched, ...toInterests];
            setSearched(newInterests);
          }
        } else {
          const toInterests = response.data.results.map((item) => {
            return { title: item.title, categoryId: item.categoryId };
          });
          setSearched(toInterests);
        }
      })
      .catch(({ error }) => {
        if (search.length > 0) {
          Toast.show({
            text1: 'Error searching interests',
            type: 'error',
            position: 'bottom',
          });
        }
      });
  };

  const onAddInterest = (interest: Interest) => {
    if (selectedInterests.length < MAX_INTERESTS) {
      store.dispatch(toggleInterest(interest));
    } else {
      const found = _.find(selectedInterests, interest);
      if (!found) {
        Toast.show({
          text1: 'Interests Full!',
          type: 'error',
          position: 'bottom',
        });
      } else {
        store.dispatch(toggleInterest(interest));
      }
    }
  };

  const renderSearchResult = ({ item }) => {
    const isSelected = _.find(selectedInterests, item);
    return (
      <Surface
        onPress={() => {
          onAddInterest(item);
        }}>
        <View
          style={[
            styles.searchResultContainer,
            {
              borderBottomColor: colors.background,
              borderLeftColor: isSelected ? colors.secondary : colors.card,
            },
          ]}>
          <View>
            <Paragraph color={colors.text} style={styles.categoryTitle}>
              {item.categoryId}
            </Paragraph>
            <Paragraph color={colors.text}>{item.title}</Paragraph>
          </View>
          <Icon
            name={isSelected ? 'checkcircle' : 'plus'}
            size={30}
            color={colors.secondary}
            style={{ margin: 0 }}
          />
        </View>
      </Surface>
    );
  };

  const expandListController = useRef(new Animated.Value(0)).current;
  const listHeight = expandListController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('screen').height - listPos - HEADER_HEIGHT], //TODO adjust this as needed
  });
  const expandList = () => {
    Animated.timing(expandListController, {
      duration: 250,
      toValue: 1,
    }).start();
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <StatusBar theme={theme} />
      <View
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setListPos(height);
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Title2 color={colors.text} style={styles.sectionTitle}>
            Search Interests
          </Title2>
          <Paragraph
            color={colors.text}
            style={{ marginRight: 5, color: 'gray' }}>
            {selectedInterests.length} / {MAX_INTERESTS}{' '}
          </Paragraph>
        </View>
        <TextInput
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.background, color: colors.text },
          ]}
          placeholder="Search"
          placeholderTextColor={colors.text}
          onChangeText={(text) => {
            setSearchText(text);
            setCurrentPage(0);
            debounceSearch(text, 0);
          }}
          clearButtonMode="always"
        />
        <View
          style={[styles.separator, { borderBottomColor: colors.background }]}>
          <Text style={{ color: 'gray' }}>
            {searchText.length > 0
              ? `Showing Results for '${searchText}'`
              : 'RECOMMENDED'}
          </Text>
        </View>
      </View>
      {loading && (
        <ActivityIndicator
          style={styles.activityIndicator}
          color={colors.secondary}
        />
      )}
      <Animated.View style={{ height: listHeight }}>
        {searchText.length > 0 ? (
          <>
            <TouchableOpacity
              style={styles.addInterestButton}
              onPress={() => {
                if (selectedInterests.length < MAX_INTERESTS) {
                  setModalVisible(true);
                } else {
                  Toast.show({
                    text1: 'Interests Full!',
                    type: 'error',
                    position: 'bottom',
                  });
                }
              }}>
              <Paragraph color={colors.secondary}>Add {searchText}</Paragraph>
            </TouchableOpacity>
            <FlatList
              style={styles.searchResultList}
              data={searched}
              extraData={selectedInterests}
              renderItem={renderSearchResult}
              onMomentumScrollBegin={() => {
                setScrolling(true);
              }} //so onEndReached isn't called on render
              onMomentumScrollEnd={() => setScrolling(false)}
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                if (scrolling) {
                  setCurrentPage(currentPage + 1);
                  onSearch(searchText, currentPage + 1, true);
                }
              }}
            />
          </>
        ) : (
          <FlatList
            style={styles.searchResultList}
            data={recommended} //interestsData.payload ??
            renderItem={renderSearchResult}
          />
        )}
      </Animated.View>
      <AddInterestModal
        visible={modalVisible}
        setVisible={setModalVisible}
        interestText={searchText}
        addInterestCallback={onAddInterest}
        categoryId={category}
        addInterest={addCustomInterest}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootReducer) => ({
  selectedInterests: state.interests.selected,
});

export default connect(mapStateToProps, null)(InterestSearch);
