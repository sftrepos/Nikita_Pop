import React from 'react';
import { MajorScreenNavigationProp } from 'nav/types';
import OnboardWrapper from './OnboardWrapper';
import { OnboardTextInput } from './OnboardInputs';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import { suggestMajors } from 'util/suggestion';
import SuggestionList from 'components/SuggestionList';
import EStyleSheet from 'react-native-extended-stylesheet';

import useAnalytics from 'util/analytics/useAnalytics';

interface MajorScreenProps {
  navigation: MajorScreenNavigationProp;
}

const styles = EStyleSheet.create({
  suggestionContainer: {
    maxHeight: '10 rem',
  },
});

const MajorScreen = (props: MajorScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [major, setMajor] = React.useState('');
  const [validMajor, setValidMajor] = React.useState(false);
  const [majorSuggestions, setMajorSuggestions] = React.useState(
    [] as string[],
  );
  const [error, setError] = React.useState(false);

  const patchProfile = (data: { university: { major: string } }) =>
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
      titleKey="MAJOR"
      validInput={validMajor && !!major}
      onSubmit={() => {
        validMajor ? patchProfile({ university: { major } }) : null;
        analytics.logEvent(
          { name: 'ONBOARDING MAJOR SUBMIT', data: { major } },
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
        placeholder="Major"
        autoFocus
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

export default MajorScreen;
