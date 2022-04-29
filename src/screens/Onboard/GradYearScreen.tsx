import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GradYearScreenNavigationProp } from 'nav/types';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import OnboardWrapper from './OnboardWrapper';
import years from '../../constants/gradDates';
import { OnboardPickerSelect } from './OnboardInputs';

import useAnalytics from 'util/analytics/useAnalytics';

interface GradYearScreenProps {
  navigation: GradYearScreenNavigationProp;
}

const pickerItems = () => {
  const items = [] as Array<{ label: string; value: number }>;
  years.map((value) => {
    items.push({ label: String(value), value: value });
  });
  return items;
};

const GradYearScreen = (props: GradYearScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [gradYear, setGradYear] = React.useState(null as number | null);

  const patchProfile = (data: { university: { gradDate: number } }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));
  const analytics = useAnalytics();

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="GRADYEAR"
      validInput={!!gradYear}
      onSubmit={() => {
        gradYear ? patchProfile({ university: { gradDate: gradYear } }) : null;
        analytics.logEvent(
          { name: 'ONBOARDING GRAD YEAR SUBMIT', data: { gradYear } },
          true,
        );
      }}
      preventBack
      loading={isLoading}>
      <OnboardPickerSelect
        placeholder={{
          label: 'Year',
          value: null,
          color: EStyleSheet.value('$grey3'),
        }}
        value={gradYear}
        onValueChange={(value: number | null) => setGradYear(value)}
        items={pickerItems()}
      />
    </OnboardWrapper>
  );
};

export default GradYearScreen;
