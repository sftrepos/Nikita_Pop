import React from 'react';
import { SecondMajorScreenNavigationProp } from 'nav/types';
import OnboardWrapper from './OnboardWrapper';
import { OnboardTextInput } from './OnboardInputs';

import { useDispatch, useSelector } from 'react-redux';
import { getProfileData, getUpdateProfileIsLoading } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import EStyleSheet from 'react-native-extended-stylesheet';
import SuggestionList from 'components/SuggestionList';
import { suggestMajors } from 'util/suggestion';

import useAnalytics from 'util/analytics/useAnalytics';

interface SecondMajorScreenProps {
  navigation: SecondMajorScreenNavigationProp;
}

const styles = EStyleSheet.create({
  suggestionContainer: {
    maxHeight: '8 rem',
  },
});

const SecondMajorScreen = (
  props: SecondMajorScreenProps,
): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [major, setMajor] = React.useState('');
  const [validMajor, setValidMajor] = React.useState(false);
  const [majorSuggestions, setMajorSuggestions] = React.useState(
    [] as string[],
  );
  const [error, setError] = React.useState(false);

  const patchProfile = (data: { university: { secondMajor: string } }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));
  const analytics = useAnalytics();

  React.useLayoutEffect(() => {
    if (major && majorSuggestions.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [major, majorSuggestions]);

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="SECONDMAJOR"
      validInput={validMajor}
      onSubmit={() => {
        patchProfile({ university: { secondMajor: major } });
        analytics.logEvent(
          { name: 'ONBOARDING MAJOR 2 SUBMIT', data: { major } },
          true,
        );
      }}
      skipBtn
      onSkip={() => {
        patchProfile({ university: { secondMajor: '' } });
        analytics.logEvent(
          { name: 'ONBOARDING MAJOR 2 SUBMIT', data: { major: '' } },
          true,
        );
      }}
      preventBack
      loading={isLoading}>
      <OnboardTextInput
        onChangeText={(value) => {
          setMajor(value);
          setValidMajor(false);
          setMajorSuggestions(suggestMajors(value, 3));
        }}
        value={major}
        placeholder="Second Major"
        error={
          error
            ? 'Can’t find this major, try something else for now!'
            : undefined
        }
      />
      {error ? null : (
        <SuggestionList
          data={majorSuggestions}
          skipValues={[major]}
          onPress={(value) => {
            setMajor(value);
            setValidMajor(true);
          }}
          containerStyle={styles.suggestionContainer}
        />
      )}
    </OnboardWrapper>
  );
};

export default SecondMajorScreen;
