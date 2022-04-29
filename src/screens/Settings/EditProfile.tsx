import React, { ReactElement } from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SettingsNavigationProp } from 'nav/types';
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  findNodeHandle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper';
import globalStyleConstants, {
  eStyleSheetConfig,
} from 'styles/globalStyleConstants';
import { Paragraph, Title3 } from 'components/Text';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import { TealHeaderButton, CustomHeaderButton } from 'components/HeaderButtons';
import CurrentLocationInput from 'components/CurrentLocationInput';
import SuggestionList from 'components/SuggestionList';
import strings from 'lang/en';
import { AuthAPI } from 'services/api';
import { getProfileData, getId } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';
import { suggestMajors } from 'util/suggestion';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  view: {
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: '2 rem',
    flexDirection: 'column',
  },
  settingsItemView: {
    flexDirection: 'column',
    paddingHorizontal: '2 rem',
    paddingBottom: '2 rem',
  },
  settingsItemTitleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingsItemValue: {
    paddingTop: '0.5 rem',
  },
  settingsIcon: {
    marginLeft: '1 rem',
  },
  settingsItemEditView: {
    paddingTop: '0.75 rem',
  },
  textInput: {
    width: '100%',
    backgroundColor: '$grey5',
    paddingVertical: '0.5 rem',
    paddingHorizontal: '1 rem',
    marginRight: 0,
    borderRadius: 25,
    elevation: 1,
    justifyContent: 'center',
    maxHeight: 60,
  },
  centerEditView: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  currentLocText: {
    fontSize: 14,
    textAlign: 'center',
  },

  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    paddingHorizontal: '0.5 rem',
    paddingVertical: '0.25 rem',
    backgroundColor: '$raspberry',
    marginTop: '0.25 rem',
    marginRight: '0.5 rem',
  },
  chipText: {
    maxWidth: '90%',
  },
  closeIcon: {
    paddingLeft: '1 rem',
  },
  errorText: {
    fontSize: '0.75 rem',
    paddingHorizontal: '0.75 rem',
    paddingVertical: '0.5 rem',
  },
  radioText: {
    fontSize: '0.9 rem',
  },
});

// this might exist somewhere already?
const genderMap: Record<string, string> = {
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

interface SettingsProps {
  navigation: SettingsNavigationProp;
}

interface ISettingsOption {
  active?: boolean;
  title: string;
  value: string | string[]; // support for multivalue
  uneditable?: boolean;
  children?: React.ReactNode;
  onTitlePress?: () => void;
  scrollRef?: React.RefObject<ScrollView>;
}

const SettingsOption = React.memo<ISettingsOption>(
  ({ active, title, value, uneditable, onTitlePress, children, scrollRef }) => {
    const renderValue = () => {
      if (typeof value === 'string') {
        return (
          <Paragraph
            color={
              uneditable ? globalStyleConstants.tint(colors) : colors.text
            }>
            {value}
          </Paragraph>
        );
      } else {
        return value.map((v) => {
          if (v) {
            return (
              <Paragraph
                color={
                  uneditable ? globalStyleConstants.tint(colors) : colors.text
                }>
                {v}
              </Paragraph>
            );
          }
          return null;
        });
      }
    };

    const { colors } = useTheme();

    const optionRef = React.useRef<View>(null);

    const scrollToItem = () => {
      if (optionRef && optionRef.current && scrollRef && scrollRef.current) {
        optionRef.current.measureLayout(
          findNodeHandle(scrollRef.current),
          (x, y) => {
            scrollRef.current.scrollTo({ x: 0, y: y, animated: true });
          },
          () => null,
        );
      }
    };

    return (
      <View style={styles.settingsItemView} ref={optionRef}>
        <View style={styles.settingsItemTitleView}>
          <View>
            <Title3 color={colors.text}>{title}</Title3>
          </View>
          {!uneditable ? (
            <Pressable
              onPress={
                uneditable
                  ? null
                  : () => {
                      if (onTitlePress) {
                        onTitlePress();
                      }
                      if (scrollRef) {
                        scrollToItem();
                      }
                    }
              }>
              <View style={styles.settingsIcon}>
                <Icon
                  name={active ? 'chevron-up' : 'pencil-outline'}
                  size={20}
                  color={globalStyleConstants.tint(colors)}
                />
              </View>
            </Pressable>
          ) : null}
        </View>
        {active ? null : (
          <View style={styles.settingsItemValue}>{renderValue()}</View>
        )}
        <View style={styles.settingsItemEditView}>
          {active ? children : null}
        </View>
      </View>
    );
  },
);

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
  major: false,
  location: false,
  gender: false,
};

const EditProfile = ({ navigation }: SettingsProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();

  const profile = useSelector((state) => getProfileData(state));
  const id = useSelector((state) => getId(state));
  const patchProfile = (data) => dispatch(updateProfile(data));

  const [activeOpts, setActiveOpts] =
    React.useState<Record<string, boolean>>(defaultActiveOpts);
  const editing = Object.values(activeOpts).reduce((a, b) => a || b);

  const [locInputValue, setLocInputValue] = React.useState(profile.hometown);
  const [validLoc, setValidLoc] = React.useState(true);
  const [locACChoices, setLocACChoices] = React.useState([] as string[]);
  const [locError, setLocError] = React.useState('');

  const [majorInputValue, setMajorInputValue] = React.useState('');
  const [major, setMajor] = React.useState<string | undefined>(
    profile.university.major,
  );
  const [major2, setMajor2] = React.useState<string | undefined>(
    profile.university.secondMajor,
  );
  const [majorACChoices, setMajorACChoices] = React.useState([] as string[]);
  const [majorError, setMajorError] = React.useState('');

  const [genderRadioValue, setGenderRadioValue] = React.useState(
    profile.gender,
  );

  const scrollViewRef = React.useRef(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CustomHeaderButton
          name="chevron-left"
          onPress={() => {
            if (editing) {
              Alert.alert(
                'You currently have pending changes',
                'Are you sure you want to leave?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Leave',
                    onPress: () => navigation.pop(),
                  },
                ],
              );
            } else {
              navigation.pop();
            }
          }}
        />
      ),
    });
  }, [editing]);

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
                console.log(activeOpts);
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
                  console.log(body);
                  patchProfile(body);
                }
                setActiveOpts(defaultActiveOpts);
                Toast.show({
                  text1: 'Updating your profile...',
                  position: 'bottom',
                  type: 'info',
                });
              }}
            />
          )
        : undefined,
    });
  }, [
    navigation,
    editing,
    locInputValue,
    genderRadioValue,
    major,
    major2,
    activeOpts,
  ]);

  React.useLayoutEffect(() => {
    if (major !== '' && major2 !== '' && majorInputValue) {
      setMajorError('2 majors max. Remove one to add another.');
    } else if (majorInputValue && majorACChoices.length === 0) {
      setMajorError('No results found. Try another name?');
    } else {
      setMajorError('');
    }
  }, [major, major2, majorInputValue, majorACChoices]);

  // useCallback prevents the fn from rerendering to ensure
  // debounce works properly
  const getPlaces = React.useCallback(
    _.debounce((value: string) => {
      if (value.trim() === '') {
        console.log(value);
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

  const handleTitlePress = (option: string) => {
    setActiveOpts({ ...activeOpts, [option]: !activeOpts[option] });
    if (activeOpts[option]) {
      switch (option) {
        case 'location':
          setLocInputValue(profile.hometown);
          break;
        case 'major':
          setMajorInputValue('');
          setMajor(profile.university.major);
          setMajor2(profile.university.secondMajor);
          break;
        case 'gender':
          setGenderRadioValue(profile.gender);
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.view}>
      <StatusBar theme={theme} />
      <KeyboardAvoidingView>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollView}
          nestedScrollEnabled>
          <SettingsOption
            title="Username"
            value={profile.username}
            uneditable
          />
          <SettingsOption
            active={activeOpts.major}
            title="Major"
            value={[profile.university.major, profile.university.secondMajor]}
            onTitlePress={() => handleTitlePress('major')}
            scrollRef={scrollViewRef}>
            <View style={styles.centerEditView}>
              <TextInput
                style={styles.textInput}
                value={majorInputValue}
                onChangeText={(value: string) => {
                  setMajorInputValue(value);
                  setMajorACChoices(suggestMajors(value));
                }}
                clearButtonMode="always"
              />
              <ChipView
                values={[major, major2]}
                onPop={(idx) => {
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
                      setMajor(opt);
                      setMajorInputValue('');
                      setMajorACChoices([]);
                    } else if (!major2) {
                      setMajor2(opt);
                      setMajorInputValue('');
                      setMajorACChoices([]);
                    }
                  }}
                  skipValues={[major, major2]}
                />
              )}
            </View>
          </SettingsOption>
          <SettingsOption
            active={activeOpts.location}
            title="Location"
            value={profile.hometown}
            onTitlePress={() => handleTitlePress('location')}
            scrollRef={scrollViewRef}>
            <View style={styles.centerEditView}>
              <View>
                <TextInput
                  style={styles.textInput}
                  value={locInputValue}
                  onChangeText={(value: string) => {
                    setLocError('');
                    setLocInputValue(value);
                    setValidLoc(!!locACChoices.includes(value));
                    getPlaces(value);
                  }}
                  clearButtonMode="always"
                />
              </View>
              <CurrentLocationInput
                onFinishGetLocation={(location: string) => {
                  setLocInputValue(location);
                  setValidLoc(true);
                }}
                textStyle={styles.currentLocText}
                noIcon
                customText="USE MY CURRENT LOCATION"
              />
              {locError ? (
                <Paragraph style={styles.errorText} color="red">
                  {locError}
                </Paragraph>
              ) : (
                <SuggestionList
                  data={locACChoices}
                  onPress={(value) => {
                    setLocInputValue(value);
                    setValidLoc(true);
                  }}
                  skipValues={validLoc ? [locInputValue] : undefined}
                />
              )}
            </View>
          </SettingsOption>
          <SettingsOption
            active={activeOpts.gender}
            title="Gender"
            value={newGenderMap[profile.gender]}
            onTitlePress={() => handleTitlePress('gender')}
            scrollRef={scrollViewRef}>
            <RadioButton.Group
              onValueChange={(newValue) => setGenderRadioValue(newValue)}
              value={genderRadioValue}>
              {Object.entries(genderMap).map(([key, value]) => {
                return (
                  <View style={styles.radioBtn}>
                    <RadioButton.Android value={key} />
                    <Paragraph
                      color={eStyleSheetConfig.$grey2}
                      style={styles.radioText}>
                      {value}
                    </Paragraph>
                  </View>
                );
              })}
            </RadioButton.Group>
          </SettingsOption>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
