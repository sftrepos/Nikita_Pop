import React from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import { LocationScreenNavigationProp } from 'nav/types';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading, getId } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import CurrentLocationInput from 'components/CurrentLocationInput';
import SuggestionList from 'components/SuggestionList';
import { AuthAPI } from 'services/api';

import OnboardWrapper from './OnboardWrapper';
import { OnboardTextInput } from './OnboardInputs';

import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  currentLocText: {
    fontSize: 14,
    textAlign: 'center',
  },
  suggestionContainer: {
    maxHeight: '10 rem',
  },
});

interface LocationScreenProps {
  navigation: LocationScreenNavigationProp;
}

const LocationScreen = (props: LocationScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [location, setLocation] = React.useState('');
  const [validLoc, setValidLoc] = React.useState(false);
  const [locSuggestions, setLocSuggestions] = React.useState([] as string[]);

  const id = useSelector((state) => getId(state));
  const patchProfile = (data: { hometown: string }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));
  const analytics = useAnalytics();

  // useCallback prevents the fn from rerendering to ensure
  // debounce works properly
  const getPlaces = React.useCallback(
    _.debounce((value: string) => {
      if (value.trim() === '') {
        console.log(value);
        setLocSuggestions([]);
      } else {
        AuthAPI.getLocationAutocomplete({ id, params: value })
          .then((resp) => {
            if (
              resp.data?.predictions.length === 0 &&
              resp.data?.status === 'OVER_QUERY_LIMIT'
            ) {
              return;
            }
            const choices = resp.data?.predictions.map(
              ({ description }) => description,
            );
            setLocSuggestions(choices.slice(0, 3));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 200),
    [],
  );

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="LOCATION"
      validInput={validLoc && !!location}
      onSubmit={() => {
        validLoc ? patchProfile({ hometown: location }) : null;
        analytics.logEvent(
          { name: 'ONBOARDING LOCATION SUBMIT', data: { location } },
          true,
        );
      }}
      preventBack
      loading={isLoading}>
      <OnboardTextInput
        onChangeText={(value) => {
          setLocation(value);
          setValidLoc(false);
          getPlaces(value);
        }}
        value={location}
        placeholder="City, State"
        autoFocus
      />
      {!location ? (
        <CurrentLocationInput
          onFinishGetLocation={(location: string) => {
            setLocation(location);
            setValidLoc(true);
          }}
          textStyle={styles.currentLocText}
          noIcon
          customText="USE MY CURRENT LOCATION"
        />
      ) : null}
      <SuggestionList
        data={locSuggestions}
        onPress={(value) => {
          setLocation(value);
          setValidLoc(true);
        }}
        skipValues={validLoc ? [location] : undefined}
        containerStyle={styles.suggestionContainer}
      />
    </OnboardWrapper>
  );
};

export default LocationScreen;
