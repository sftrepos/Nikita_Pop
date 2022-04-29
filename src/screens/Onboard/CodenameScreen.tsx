import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';
import { CodenameScreenNavigationProp } from 'nav/types';

import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileIsLoading, getId } from 'util/selectors';
import { updateProfile } from 'features/User/UserActions';

import { AuthAPI } from 'services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OnboardWrapper from './OnboardWrapper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  codeNameDisplay: {
    width: '100%',
    backgroundColor: '$grey5',
    paddingVertical: '0.5 rem',
    paddingHorizontal: '1 rem',
    marginVertical: '0.5 rem',
    marginRight: 0,
    borderRadius: 12,
    elevation: 1,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  undoBtn: {
    marginLeft: '1 rem',
  },
});

interface CodeNameDisplayProps {
  value: string;
  onRoll: () => void;
}

const CodeNameDisplay = React.memo<CodeNameDisplayProps>(
  ({ value, onRoll }) => {
    const { colors } = useTheme();
    return (
      <View style={styles.codeNameDisplay}>
        <Paragraph color={value ? colors.text : EStyleSheet.value('$grey3')}>
          {value ? value : 'Loading options...'}
        </Paragraph>
        <TouchableOpacity onPress={onRoll}>
          <Icon name="dice-multiple" color={colors.text} size={20} />
        </TouchableOpacity>
      </View>
    );
  },
);

interface CodenameScreenProps {
  navigation: CodenameScreenNavigationProp;
}

const CodenameScreen = (props: CodenameScreenProps): React.ReactElement => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const { colors } = useTheme();
  const [prevChoices, setPrevChoices] = React.useState([] as string[]);
  const [codeName, setCodeName] = React.useState('');
  const [codeNameChoices, setCodeNameChoices] = React.useState([] as string[]);

  const patchProfile = (data: { username: string }) =>
    dispatch(updateProfile(data));
  const id = useSelector((state) => getId(state));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));
  const analytics = useAnalytics();

  React.useLayoutEffect(() => {
    if (id && codeNameChoices.length <= 4) {
      AuthAPI.getGeneratedUsernames<string[]>({ id: id, size: 19 }).then(
        (res: string[]) => {
          const newCodeNameChoices = [...codeNameChoices, ...res];
          if (!codeName) {
            const nextName = newCodeNameChoices.shift();
            if (nextName) {
              setCodeName(nextName);
              prevChoices.push(codeName);
              setPrevChoices(prevChoices);
            }
          }
          setCodeNameChoices(newCodeNameChoices);
        },
      );
    }
  }, [codeNameChoices, id, prevChoices, codeName]);

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="CODENAME"
      validInput={!!codeName}
      onSubmit={() => {
        patchProfile({ username: codeName });
        analytics.logEvent(
          { name: 'ONBOARDING USERNAME SUBMIT', data: { codeName } },
          true,
        );
      }}
      preventBack
      loading={isLoading}>
      <CodeNameDisplay
        value={codeName}
        onRoll={() => {
          const nextChoice = codeNameChoices.shift();
          if (nextChoice) {
            prevChoices.push(codeName);
            setPrevChoices(prevChoices);
            setCodeName(nextChoice);
          }
          setCodeNameChoices(codeNameChoices);
        }}
      />
      <TouchableOpacity
        style={styles.undoBtn}
        onPress={() => {
          const name = prevChoices.pop();
          if (name) {
            setCodeNameChoices([codeName, ...codeNameChoices]);
            setCodeName(name);
          }
          setPrevChoices(prevChoices);
        }}
        disabled={prevChoices.length <= 1}>
        <Paragraph
          color={
            prevChoices.length > 1 ? colors.text : EStyleSheet.value('$grey4')
          }>
          UNDO
        </Paragraph>
      </TouchableOpacity>
    </OnboardWrapper>
  );
};

export default CodenameScreen;
