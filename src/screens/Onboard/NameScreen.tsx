import React from 'react';
import { NameScreenNavigationProp } from 'nav/types';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import OnboardWrapper from './OnboardWrapper';
import { TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';

import useAnalytics from 'util/analytics/useAnalytics';

interface NameScreenProps {
  navigation: NameScreenNavigationProp;
}

const NameScreen = (props: NameScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [fName, setFName] = React.useState('');
  const [lName, setLName] = React.useState('');
  const [error, setError] = React.useState('');
  const [validName, setValidName] = React.useState(false);

  const patchProfile = (data: { name: string }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));

  const checkValidName = () => {
    const testName = (s: string) => !s.length || /^[A-Za-z\s]+$/.test(s);
    if (!fName && !lName) {
      setValidName(false);
      setError('');
    } else {
      if (!testName(fName) || !testName(lName)) {
        setValidName(false);
        setError('check your spelling, no special characters or numbers');
      } else {
        if (fName.length >= 2 && lName.length >= 2) {
          setValidName(true);
        }
        setError('');
      }
    }
  };

  const analytics = useAnalytics();

  React.useLayoutEffect(() => {
    checkValidName();
  }, [fName, lName]);

  // Reimplemented OnboardTextInput here to make
  // focus/blur work properly with refs
  const secondInput = React.useRef<TextInput>(null);
  const styles = EStyleSheet.create({
    textInput: {
      width: '100%',
      color: colors.text,
      fontSize: '1 rem',
      backgroundColor: '$grey5',
      paddingVertical: '0.5 rem',
      paddingHorizontal: '1 rem',
      marginVertical: '0.5 rem',
      marginRight: 0,
      borderRadius: 12,
      elevation: 1,
      height: 40,
    },
  });

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="NAME"
      validInput={validName}
      loading={isLoading}
      onSubmit={() => {
        patchProfile({ name: `${fName.trim()} ${lName.trim()}` }),
          analytics.logEvent(
            {
              name: 'ONBOARDING NAME SUBMIT',
              data: { fullName: `${fName.trim()} ${lName.trim()}` },
            },
            true,
          );
      }}
      preventBack>
      <TextInput
        placeholder="First Name"
        placeholderTextColor={EStyleSheet.value('$grey3')}
        value={fName}
        onChangeText={(s) => setFName(s)}
        autoFocus
        style={styles.textInput}
        onSubmitEditing={() => secondInput.current?.focus()}
        blurOnSubmit={false}
        autoCompleteType="name"
        textContentType="givenName"
        returnKeyType="done"
      />
      <TextInput
        ref={secondInput}
        placeholder="Last Name"
        placeholderTextColor={EStyleSheet.value('$grey3')}
        style={styles.textInput}
        onChangeText={(s) => setLName(s)}
        value={lName}
        autoCompleteType="name"
        textContentType="familyName"
        returnKeyType="done"
      />
      {error ? <Paragraph color="red">{error}</Paragraph> : null}
    </OnboardWrapper>
  );
};

export default NameScreen;
