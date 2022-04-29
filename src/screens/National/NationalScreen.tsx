import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from 'features/Request/RequestActions';
import { getFilters, getProfileData } from 'util/selectors';
import { UpdateFilterType } from 'components/Modals/FilterModal';
import BackpackIcon from './BackpackIcon';
import SuitcaseIcon from './SuitcaseIcon';
import NextButton from '../Register/NextButton';
import { updateProfile } from 'features/User/UserActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useAnalytics from 'util/analytics/useAnalytics';

const NationalScreen = ({ navigation }) => {
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();
  const analytics = useAnalytics();

  const setFilter = (filter: UpdateFilterType) => dispatch(setFilters(filter));
  const { isFetching } = useSelector(getProfileData);
  const handleNext = () => {
    // dispatch(getC)
    dispatch(updateProfile({ meta: { nationalUpdateChecked: true } }));
    analytics.logEvent(
      { name: 'INTRO SCREEN SELECT CAMPUS NATIONAL', data: { filters } },
      true,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.view}>
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome top Pop!</Text>
            <Text style={styles.subtitle}>
              You can tap{' '}
              {
                <Icon
                  name="tune"
                  color={EStylesheet.value('$grey2')}
                  size={18}
                />
              }{' '}
              anytime to filter between students from your college and
              nationwide.
            </Text>
          </View>
          <Text style={styles.selectText}>Select a mode:</Text>
          <TouchableOpacity
            style={[
              styles.button,
              filters.isHomebase ? styles.buttonHighlight : null,
            ]}
            onPress={() => {
              setFilter({ type: 'isHomebase', filter: true });
            }}>
            <View style={styles.btnTitleContainer}>
              <Text style={styles.bubbleTitle}>CAMPUS🎉 </Text>
              <BackpackIcon active={filters.isHomebase} />
            </View>
            <Text style={styles.text}>Stay within your campus!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              !filters.isHomebase ? styles.buttonHighlight : null,
            ]}
            onPress={() => {
              setFilter({ type: 'isHomebase', filter: false });
            }}>
            <View style={styles.btnTitleContainer}>
              <Text style={styles.bubbleTitle}>NATIONAL🌎</Text>
              <SuitcaseIcon active={!filters.isHomebase} />
            </View>
            <Text style={styles.text}>
              Meet students from other universities!
            </Text>
          </TouchableOpacity>
        </View>
        <NextButton
          label="Continue"
          isLoading={isFetching}
          onPress={handleNext}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = EStylesheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: '.5rem',
    paddingHorizontal: '.5rem',
  },
  card: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
  },
  view: {
    backgroundColor: '$grey5',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1,
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '$grey3',
    borderRadius: '1rem',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: '1.5rem',
    paddingHorizontal: '1rem',
    marginVertical: '1rem',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
    flex: 1,
  },
  buttonHighlight: {
    borderColor: '$raspberry',
  },
  title: {
    fontSize: '$fontMd',
    marginBottom: '1rem',
  },
  header: {
    letterSpacing: 2,
  },
  subtitle: {
    color: '$raspberry',
  },
  text: {
    textAlign: 'left',
    color: '$grey3',
    width: '100%',
  },
  headerContainer: {
    marginVertical: '.5rem',
  },
  btnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '1rem',
  },
  bubbleTitle: {
    letterSpacing: 2,
    color: 'black',
  },
  '@media (max-width: 400)': {
    button: {
      paddingVertical: '1rem',
    },
    text: {
      textAlign: 'left',
      color: '$grey3',
      fontSize: '$fontXS',
    },
    headerContainer: {
      marginVertical: '.5rem',
    },
  },
  selectText: {
    marginTop: '1.5rem',
  },
});

export default NationalScreen;
