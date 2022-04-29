import React, { ReactElement, useState } from 'react';
import { View, Alert, TextInput, Dimensions, Pressable } from 'react-native';
import {
  ChangeFieldScreenNavigationProp,
  ChangeFieldScreenRouteProp,
} from 'nav/types';
import SafeAreaView from 'components/SafeAreaView';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Subtitle, Title3 } from 'components/Text';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileData, getId } from 'util/selectors';
import Toast from 'react-native-toast-message';
import { TealHeaderButton, CustomHeaderButton } from 'components/HeaderButtons';
import { RadioButton } from 'react-native-paper';
import { eStyleSheetConfig } from 'styles/globalStyleConstants';
import { updateProfile } from 'features/User/UserActions';
import CurrentLocationInput from 'components/CurrentLocationInput';
import { AuthAPI } from 'services/api';
import SuggestionList from 'components/SuggestionList';
import { suggestMajors } from 'util/suggestion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';

export interface ChangeFieldScreenProps {
  navigation: ChangeFieldScreenNavigationProp;
  route: ChangeFieldScreenRouteProp;
}

// this might exist somewhere already?
export const genderMap: Record<string, string> = {
  man: 'Man',
  woman: 'Woman',
  nonbinary: 'Non-Binary',
  prefernot: 'Prefer not to say',
};

// this might exist somewhere already?
const newGenderMap: Record<string, string> = {
  man: 'Man',
  woman: 'Woman',
  nonbinary: 'Non-Binary',
  prefernot: 'Prefer not to say',
  male: 'Man',
  female: 'Woman',
};

const styles = EStyleSheet.create({
  SA: {},
  body: {
    flex: 1,
    padding: '1.5rem',
  },
  heading: {
    fontSize: '1.1rem',
    marginTop: '1.5rem',
    marginBottom: '.7rem',
  },
  stdPadding: {
    padding: '1 rem',
  },
  containerTextInput: {
    padding: '.8 rem',
    // marginHorizontal: '1 rem',
    borderRadius: 15,
    fontSize: '$fontMd',
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  currentLocText: {
    fontSize: 14,
    textAlign: 'center',
  },
  chipView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: '0.25 rem',
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 25,
    paddingHorizontal: '.9 rem',
    paddingVertical: '0.5 rem',
    backgroundColor: '$raspberry',
    marginTop: '0.5 rem',
    marginRight: '0.5 rem',
  },
  chipText: {
    maxWidth: '90%',
  },
  closeIcon: {
    paddingLeft: '1 rem',
  },
  errorText: {
    paddingHorizontal: '0.75 rem',
    paddingVertical: '0.5 rem',
  },
});

interface IChipView {
  values: Array<string | undefined>;
  onPop: (index: number) => void;
}
const ChipView = React.memo<IChipView>(({ values, onPop }) => {
  return (
    <View style={styles.chipView}>
      {values.map((major, idx) =>
        major ? (
          <View style={styles.chip}>
            <Paragraph numberOfLines={1} color="white" style={styles.chipText}>
              {major}
            </Paragraph>
            <Pressable onPress={() => onPop(idx)} style={styles.closeIcon}>
              <Icon size={20} name="close" color="white" />
            </Pressable>
          </View>
        ) : null,
      )}
    </View>
  );
});

const defaultActiveOpts = {
  name: false,
  gender: false,
  major: false,
  location: false,
};

const ChangeFieldScreen = ({
  navigation,
  route,
}: ChangeFieldScreenProps): ReactElement => {
  const { type } = route.params.params;
  const theme = useTheme();
  const { colors } = theme;

  const dispatch = useDispatch();

  const [activeOpts, setActiveOpts] =
    React.useState<Record<string, boolean>>(defaultActiveOpts);
  const editing = Object.values(activeOpts).reduce((a, b) => a || b);

  const profile = useSelector((state) => getProfileData(state));
  const id = useSelector((state) => getId(state));
  const patchProfile = (data) => dispatch(updateProfile(data));

  // Name
  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState('');

  // Gender
  const [genderRadioValue, setGenderRadioValue] = useState(profile.gender);

  // Major
  const [majorInputValue, setMajorInputValue] = React.useState();
  const [major, setMajor] = React.useState<string | undefined>(
    profile.university.major,
  );
  const [major2, setMajor2] = React.useState<string | undefined>(
    profile.university.secondMajor,
  );
  const [majorACChoices, setMajorACChoices] = React.useState([] as string[]);
  const [majorError, setMajorError] = React.useState('');

  // Location
  const [locInputValue, setLocInputValue] = React.useState(profile.hometown);
  const [validLoc, setValidLoc] = React.useState(true);
  const [locACChoices, setLocACChoices] = React.useState([] as string[]);
  const [locError, setLocError] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getTitle(type),
    });
  }, []);

  React.useLayoutEffect(() => {
    if (major && major !== '' && major2 && major2 !== '' && majorInputValue) {
      setMajorError('2 majors max. Remove one to add another.');
    } else if (majorInputValue && majorACChoices.length === 0) {
      setMajorError('No results found. Try another name?');
    } else {
      setMajorError('');
    }
  }, [major, major2, majorInputValue, majorACChoices]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingRight: 15,
      },
      headerRight: editing
        ? () => (
            <TealHeaderButton
              label="Save"
              onPress={() => {
                let error = false;
                let body = {};
                if (activeOpts.location) {
                  if (!validLoc) {
                    setLocError(
                      'Please input a valid location from the suggestions.',
                    );
                    error = true;
                  }
                  body = { ...body, hometown: locInputValue };
                }
                if (activeOpts.gender) {
                  body = { ...body, gender: genderRadioValue };
                }

                if (activeOpts.name) {
                  if (name === '') {
                    setNameError('Please enter your name.');
                    error = true;
                  }
                  body = { ...body, name };
                }
                if (activeOpts.major) {
                  if (!major) {
                    setMajorError(
                      'Please input at least one major before proceeding.',
                    );
                    error = true;
                  }
                  body = {
                    ...body,
                    university: {
                      major: major,
                      secondMajor: major2,
                    },
                  };
                }
                if (error) {
                  return;
                }
                if (!_.isEmpty(body)) {
                  patchProfile(body);
                }
                setActiveOpts(defaultActiveOpts);
                Toast.show({
                  text1: 'Profile updated',
                  position: 'bottom',
                  type: 'success',
                });
                navigation.pop();
              }}
            />
          )
        : undefined,
    });
  }, [
    editing,
    name,
    locInputValue,
    genderRadioValue,
    major,
    major2,
    activeOpts,
  ]);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CustomHeaderButton
          name="chevron-left"
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
    });
  }, [editing]);

  // useCallback prevents the fn from rerendering to ensure
  // debounce works properly
  const getPlaces = React.useCallback(
    _.debounce((value: string) => {
      if (value.trim() === '') {
        setLocACChoices([]);
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
            setLocACChoices(choices);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 200),
    [],
  );

  const getTitle = (title: string) => {
    switch (title) {
      case 'CHANGE_PW':
        return 'Your Password';
      case 'CHANGE_EMAIL':
        return 'Your Email';
      case 'CHANGE_NAME':
        return 'Your Name';
      case 'CHANGE_MAJOR':
        return 'Your Major';
      case 'CHANGE_GENDER':
        return 'Your Gender';
      case 'CHANGE_LOCATION':
        return 'Your Location';
      default:
        return 'Edit Profile';
    }
  };

  const renderBody = () => {
    switch (type) {
      case 'CHANGE_PW':
        return (
          <View style={styles.body}>
            <Paragraph style={styles.stdPadding} color={colors.text}>
              In order to change your password, you must confirm your current
              email address.
            </Paragraph>
          </View>
        );
      case 'CHANGE_EMAIL':
        return (
          <View style={styles.body}>
            <Subtitle color="gray">
              Please also enter your Pop password. We’ll send you an email to
              confirm your new email address.
            </Subtitle>
            <Paragraph style={styles.heading}>
              Enter your school email
            </Paragraph>
            <TextInput
              style={[
                styles.containerTextInput,
                { backgroundColor: colors.background },
              ]}
              placeholder="School email"
            />
            <Paragraph style={styles.heading}>Confirm your password</Paragraph>
            <TextInput
              style={[
                styles.containerTextInput,
                { backgroundColor: colors.background },
              ]}
              placeholder="Password"
            />
          </View>
        );
      case 'CHANGE_NAME':
        return (
          <View style={styles.body}>
            <Subtitle color="gray">Enter your real name.</Subtitle>
            <Paragraph style={styles.heading}>Name</Paragraph>
            <TextInput
              style={[
                styles.containerTextInput,
                { backgroundColor: colors.background },
              ]}
              defaultValue={profile.name}
              placeholder="Firstname Lastname"
              onChangeText={(text) => {
                setName(text);
                setNameError('');
                setActiveOpts({ ...activeOpts, name: true });
              }}
            />
            {nameError !== '' && (
              <Paragraph style={styles.errorText} color="red">
                {nameError}
              </Paragraph>
            )}
          </View>
        );
      case 'CHANGE_GENDER':
        return (
          <View style={styles.body}>
            <Subtitle color="gray">Choose your gender.</Subtitle>
            <Paragraph style={[styles.heading]}>Gender</Paragraph>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setGenderRadioValue(newValue);
                setActiveOpts({ ...activeOpts, gender: true });
              }}
              value={genderRadioValue}>
              {Object.entries(genderMap).map(([key, value]) => {
                return (
                  <Pressable
                    style={styles.radioBtn}
                    onPress={() => {
                      setGenderRadioValue(key);
                      setActiveOpts({ ...activeOpts, gender: true });
                    }}>
                    <RadioButton.Android value={key} />
                    <Paragraph
                      color={eStyleSheetConfig.$grey2}
                      style={styles.radioText}>
                      {value}
                    </Paragraph>
                  </Pressable>
                );
              })}
            </RadioButton.Group>
          </View>
        );

      case 'CHANGE_MAJOR':
        return (
          <View style={[styles.body]}>
            <Subtitle color="gray">Enter your major(s).</Subtitle>
            <TextInput
              style={[
                styles.containerTextInput,
                { backgroundColor: colors.background, marginVertical: 15 },
              ]}
              value={majorInputValue}
              placeholder="Major"
              onChangeText={(value: string) => {
                setMajorInputValue(value);
                setMajorACChoices(suggestMajors(value));
              }}
              clearButtonMode="always"
            />
            <ChipView
              values={[major, major2]}
              onPop={(idx) => {
                setActiveOpts({ ...activeOpts, major: true });
                if (idx == 0) {
                  setMajor('');
                  if (major2) {
                    setMajor(major2);
                    setMajor2('');
                  }
                } else if (idx == 1) {
                  setMajor2('');
                }
              }}
            />
            {majorError ? (
              <Paragraph style={styles.errorText} color="red">
                {majorError}
              </Paragraph>
            ) : (
              <SuggestionList
                data={majorACChoices}
                onPress={(opt) => {
                  if (!major) {
                    setActiveOpts({ ...activeOpts, major: true });
                    setMajor(opt);
                    setMajorInputValue('');
                    setMajorACChoices([]);
                  } else if (!major2) {
                    setActiveOpts({ ...activeOpts, major: true });
                    setMajor2(opt);
                    setMajorInputValue('');
                    setMajorACChoices([]);
                  }
                }}
                skipValues={[major, major2]}
                containerStyle={{ maxHeight: Dimensions.get('screen').height }}
              />
            )}
          </View>
        );

      case 'CHANGE_LOCATION':
        return (
          <View style={styles.body}>
            <Subtitle color="gray">Enter your new location.</Subtitle>
            <View>
              <TextInput
                style={[
                  styles.containerTextInput,
                  { backgroundColor: colors.background, marginVertical: 15 },
                ]}
                value={locInputValue}
                onChangeText={(value: string) => {
                  setLocError('');
                  setLocInputValue(value);
                  // setActiveOpts({ ...activeOpts, location: true });
                  getPlaces(value);
                  setValidLoc(!!locACChoices.includes(value));
                }}
                clearButtonMode="always"
              />
              <CurrentLocationInput
                onFinishGetLocation={(location: string) => {
                  setActiveOpts({ ...activeOpts, location: true });
                  setLocInputValue(location);
                  setValidLoc(true);
                }}
                textStyle={styles.currentLocText}
                noIcon
                customText="USE MY CURRENT LOCATION"
              />
            </View>
            {locError ? (
              <Paragraph style={styles.errorText} color="red">
                {locError}
              </Paragraph>
            ) : (
              <SuggestionList
                data={locACChoices}
                onPress={(value) => {
                  setActiveOpts({ ...activeOpts, location: true });
                  setLocInputValue(value);
                  setValidLoc(true);
                }}
                containerStyle={{ maxHeight: Dimensions.get('screen').height }}
                skipValues={validLoc ? [locInputValue] : undefined}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.SA, { backgroundColor: colors.card }]}>
      <StatusBar theme={theme} />
      {renderBody()}
    </SafeAreaView>
  );
};

export default ChangeFieldScreen;
