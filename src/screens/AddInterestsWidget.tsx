import React, { ReactElement, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import commonStyles from 'styles/commonStyles';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Title2 } from 'components/Text';
import { API, useServiceHook } from 'services/api';
import { getStoreToken } from 'util/selectors';
import store from 'store/index';
import { ActivityIndicator } from 'react-native-paper';
import { Interest, SERVICE_LOADED } from 'services/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getProfile } from 'features/User/UserActions';
import { TealHeaderButton } from 'components/HeaderButtons';
import { ScrollView } from 'react-native-gesture-handler';
import Tabs from 'components/Tabs';
import Toast from 'react-native-toast-message';
import {
  updateInterests,
  toggleInterest,
} from 'features/Interests/InterestSlice';
import InterestBucket from 'components/Widgets/InterestBucket';
import { RootReducer } from 'store/rootReducer';

const styles = EStyleSheet.create({
  _s: {
    padding: '0.5rem',
    hpad: '1rem',
  },
  containerInterestSelection: {},
  headerRightContainer: {
    padding: '1rem',
  },
  chip: {
    padding: '0.5rem',
    paddingHorizontal: '1rem',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 1,
    marginRight: '0.75rem',
    marginBottom: '0.75rem',
  },
  sectionHeader: {
    borderTopWidth: EStyleSheet.hairlineWidth,
    padding: '1rem',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    paddingBottom: '.5rem',
    paddingLeft: '1rem',
    fontWeight: 'bold',
  },
  containerCategory: {
    paddingHorizontal: '1rem',
    paddingBottom: '1rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  containerMore: {
    padding: '0.5rem',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedInterestsContainer: {
    paddingVertical: '1rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedInterestsScrollContainer: {
    paddingLeft: '1rem',
  },
  interestCardView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxCounter: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: '0.5rem',
  },
  delete: {
    position: 'absolute',
    right: '40%',
    bottom: '5rem',
  },
  listPad: {
    paddingBottom: '5rem',
  },
});

export const categorizedInterestBuckets = {
  entertainment: ['Gaming', 'Movies', 'TV'],
  culture: ['Arts', 'Music', 'Books'],
  learning: ['Science', 'Tech', 'Business'],
  activities: ['Orgs', 'Outdoors', 'Sports'],
};

const CATEGORIES = [
  'Entertainment \u{1F389}',
  'Culture \u{1F30E}',
  'Learning \u{1F4D6}',
  'Activities \u{26BD}',
];

const MAX_INTERESTS = 10; //max interests user can have
const INITIAL_INTERESTS = 10; //initial interests loaded per category

interface IAddInterestsWidget {
  route: any;
  navigation: any;
  addSuccess: boolean;
  dispatchGetProfile: () => void;
  globalWidgets: unknown[];
  selectedInterests: Interest[];
}

const AddInterestsWidget = ({
  route,
  navigation,
  addSuccess,
  dispatchGetProfile,
  addError,
  globalWidgets,
  selectedInterests,
}: IAddInterestsWidget): ReactElement => {
  const getInterestDataFromStore = (structure?: boolean) => {
    if (globalWidgets) {
      for (const widget of globalWidgets) {
        if (widget.type === 'interests') {
          if (structure) {
            return widget;
          }
          return widget.interests;
        }
      }
    }
    return [];
  };

  const { addWidget, numWidgets } = route.params;
  const theme = useTheme();
  const { colors } = theme;
  const [bucket, setBucket] = useState('entertainment');

  //all loaded interest categories
  const [allInterests, setAllInterests] = useState([]);
  const [bucketInterests, setBucketInterests] = useState([]);

  const interestsData = useServiceHook(API.getInterests, {
    token: getStoreToken(store.getState()),
    limit: INITIAL_INTERESTS,
  });

  useEffect(() => {
    store.dispatch(updateInterests(getInterestDataFromStore()));
  }, [globalWidgets]);

  useEffect(() => {
    if (interestsData.status == SERVICE_LOADED) {
      setAllInterests(interestsData.payload[0]);
    }
  }, [interestsData]);

  useEffect(() => {
    mapData(allInterests, bucket);
  }, [bucket, allInterests]);

  const showMore = (category: string) => {
    const find = _.find(bucketInterests, { title: category });
    if (find) {
      const page = find.data.length / INITIAL_INTERESTS;
      //check if page is whole number
      if (page % 1 == 0) {
        const body = {
          token: getStoreToken(store.getState()),
          categories: [category],
          limit: INITIAL_INTERESTS,
          page, //TODO
        };
        API.getInterests(body).then((response) => {
          const append = response[0][category];
          if (append.length) {
            const newInterests = allInterests;
            newInterests[category].push(...append);
            setAllInterests(newInterests);
            mapData(allInterests, bucket);
            return true;
          } else {
            Toast.show({
              text1: 'End of category reached',
              type: 'success',
              position: 'bottom',
            });
          }
        });
      } else {
        Toast.show({
          text1: 'End of category reached',
          type: 'success',
          position: 'bottom',
        });
      }
    }
    return false;
  };

  const mapData = (payload, bucket: string) => {
    const categories = Object.keys(payload);
    const mappedBucket = [
      { t: 'entertainment', data: [] },
      { t: 'culture', data: [] },
      { t: 'learning', data: [] },
      { t: 'activities', data: [] },
    ];
    categories.map((category) => {
      const foundBucket = _.findKey(
        categorizedInterestBuckets,
        (catBucketObj) => catBucketObj.includes(category),
      );
      mappedBucket.map((bucketObj) => {
        if (bucketObj.t === foundBucket) {
          bucketObj.data.push({
            data: payload[category],
            title: category,
          });
        }
      });
    });
    const a = _.find(mappedBucket, (o) => o.t === bucket)?.data ?? [];
    setBucketInterests(a);
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

  const renderItem = ({ item }) => {
    return (
      <InterestBucket
        navigation={navigation}
        MAX_INTERESTS={MAX_INTERESTS}
        onAddInterest={onAddInterest}
        showMore={showMore}
        item={item}
      />
    );
  };

  const InterestList = ({ name }) => {
    const bucket = name.toLowerCase();
    return (
      <View style={[styles.listPad, { backgroundColor: colors.card, flex: 1 }]}>
        {interestsData.status === SERVICE_LOADED ? (
          <>
            <FlatList
              style={{ width: '100%' }}
              data={bucketInterests}
              renderItem={renderItem}
            />
          </>
        ) : (
          <View style={[commonStyles.container, { marginTop: 100 }]}>
            <ActivityIndicator color={colors.secondary} />
          </View>
        )}
      </View>
    );
  };

  const onPressSubmit = (ints) => {
    const interests = [...ints];
    const newWidget = {
      type: 'interests',
      interests,
      sequence: numWidgets,
      isNewData: true,
    };
    if (getInterestDataFromStore().length) {
      addWidget(newWidget, true);
    } else {
      addWidget(newWidget);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingRight: styles._s.hpad,
      },
      headerRight: () => (
        <TealHeaderButton
          onPress={() => onPressSubmit(selectedInterests)}
          label="Done"
        />
      ),
    });
  }, [selectedInterests]);

  const renderInterestChips = ({ item }) => {
    return (
      <Pressable onPress={() => store.dispatch(toggleInterest(item))}>
        {({ pressed }) => (
          <View
            style={[
              styles.chip,
              styles.selectedChip,
              pressed
                ? { backgroundColor: colors.border }
                : { backgroundColor: colors.secondary },
            ]}>
            <Icon
              name="close"
              size={16}
              style={{ marginRight: styles._s.padding }}
              color="white"
            />
            <Paragraph color="white">{item.title}</Paragraph>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[{ backgroundColor: colors.card }]}>
      <StatusBar theme={theme} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Title2
          color={colors.text}
          style={[styles.sectionTitle, { paddingBottom: 0 }]}>
          Your interests
        </Title2>
        <Paragraph
          color={colors.text}
          style={{ marginRight: 5, color: 'gray' }}>
          {selectedInterests.length} / {MAX_INTERESTS}{' '}
        </Paragraph>
      </View>

      <View
        style={[styles.selectedInterestsContainer, { alignSelf: 'center' }]}>
        <ScrollView
          style={styles.selectedInterestsScrollContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentInset={{ right: 10 }}>
          <FlatList
            style={{ width: '100%' }}
            data={selectedInterests}
            renderItem={renderInterestChips}
            scrollEnabled={false}
            numColumns={5}
          />
        </ScrollView>
      </View>
      <Title2 color={colors.text} style={styles.sectionTitle}>
        Browse categories
      </Title2>
      <Tabs
        tabs={Object.keys(categorizedInterestBuckets)}
        tabAlias={CATEGORIES}
        setTab={(title: string) => {
          setBucket(title);
        }}
      />
      <ScrollView>
        <View style={{ height: '100%' }}>
          <InterestList name={bucket} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootReducer) => ({
  globalWidgets: state.widget.widgets,
  addSuccess: state.widget.addSuccess,
  addError: state.widget.error,
  selectedInterests: state.interests.selected,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchGetProfile: () => dispatch(getProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddInterestsWidget);
