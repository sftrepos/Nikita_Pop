import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import { GenderScreenNavigationProp } from 'nav/types';
import OnboardWrapper from './OnboardWrapper';
import { OnboardPickerSelect } from './OnboardInputs';

import useAnalytics from 'util/analytics/useAnalytics';

const genderItems = [
  { label: 'Man', value: 'man' },
  { label: 'Woman', value: 'woman' },
  { label: 'Non-Binary', value: 'nonbinary' },
  { label: 'Prefer not to say', value: 'prefernot' },
];

interface GenderScreenProps {
  navigation: GenderScreenNavigationProp;
}

const GenderScreen = (props: GenderScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [gender, setGender] = React.useState(null as string | null);

  const patchProfile = (data: { gender: string }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));
  const analytics = useAnalytics();

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="GENDER"
      validInput={!!gender}
      onSubmit={() => {
        gender ? patchProfile({ gender }) : null;
        analytics.logEvent(
          { name: 'ONBOARDING GENDER SUBMIT', data: { gender } },
          true,
        );
      }}
      preventBack
      loading={isLoading}>
      <OnboardPickerSelect
        placeholder={{
          label: 'Gender',
          value: null,
          color: EStyleSheet.value('$grey3'),
        }}
        value={gender}
        onValueChange={(value: string | null) => setGender(value)}
        items={genderItems}
      />
    </OnboardWrapper>
  );
};

export default GenderScreen;
