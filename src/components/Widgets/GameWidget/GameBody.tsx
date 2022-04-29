import React, { ReactElement, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import { GameWidgetNavigationProp, GameWidgetType } from 'nav/types';
import GameLie from 'components/Widgets/GameWidget/GameLie';
import { getId, getStoreToken } from 'util/selectors';
import { AuthAPI } from 'services/api';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { TealHeaderButton } from 'components/HeaderButtons';
import { GameSubmissionParam } from 'components/Widgets/GameWidget/index';

const styles = EStyleSheet.create({
  input: {
    backgroundColor: 'white',
    padding: '0.5rem',
    paddingHorizontal: '1rem',
    marginVertical: '0.5rem',
    borderRadius: 25,
  },
  textTitle: {
    fontWeight: '500',
  },
});

interface IGameBody {
  navigation: GameWidgetNavigationProp;
  isCtxEdit: boolean;
  widget?: GameWidgetType;
  onSubmit: (gameSubmission: GameSubmissionParam) => void;
}

type Lie = { statement: string };

const NUM_LIES_AMT = 20;

const GameBody = ({
  navigation,
  widget,
  isCtxEdit,
  onSubmit,
}: IGameBody): ReactElement => {
  const { colors } = useTheme();
  const [input, setInput] = useState(
    isCtxEdit && widget ? widget.gameData.truth[0] : '',
  );
  const [lies, setLies] = useState<Lie[]>([]);
  const [liesTotalIdx, setLiesTotalIdx] = useState(2);
  const [lieBoxesPos, setLieBoxesPos] = useState([0, 1]);
  const [lie1, setLie1] = useState('');
  const [lie2, setLie2] = useState('');
  const id = useSelector(getId);
  const token = useSelector(getStoreToken);

  useEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingRight: 30,
      },
      headerRight: () => (
        <TealHeaderButton
          label="Done"
          onPress={() => {
            onSubmit({ truth: input, lie1, lie2 });
          }}
        />
      ),
    });
  }, [navigation, input, lie1, lie2]);

  const callGetLieAPI = async () => {
    const params = {
      numLies: NUM_LIES_AMT,
      id,
      token,
    };

    const res: Lie[] = await AuthAPI.getWidgetsLies({ params });
    return res;
  };

  const getLies = (init: boolean, updateIdx: number) => {
    callGetLieAPI()
      .then((liesRes) => {
        setLies(liesRes);
        if (init && widget && isCtxEdit) {
          setLie1(widget.gameData.lie[0]);
          setLie2(widget.gameData.lie[1]);
        } else if (init) {
          setLie1(liesRes[lieBoxesPos[0]].statement);
          setLie2(liesRes[lieBoxesPos[1]].statement);
        } else {
          if (updateIdx === 0) {
            setLie1(liesRes[lieBoxesPos[0]].statement);
          } else {
            setLie2(liesRes[lieBoxesPos[1]].statement);
          }
        }
      })
      .catch((err) => {
        console.info('fetch_lies_err', err);
        Toast.show({
          text1: 'Something went wrong!',
          type: 'error',
          position: 'bottom',
        });
      });
  };

  useEffect(() => {
    getLies(true, 0);
  }, []);

  const onPressLie = (lieBox: number) => {
    if (liesTotalIdx >= NUM_LIES_AMT) {
      getLies(false, lieBox);
      setLiesTotalIdx(1);
      setLieBoxesPos([0, 1]);
    } else {
      const newLieBox = lieBoxesPos;
      let newLieTotal = liesTotalIdx;
      newLieTotal++;
      setLiesTotalIdx(newLieTotal);
      newLieBox[lieBox] = liesTotalIdx;
      setLieBoxesPos(newLieBox);
      const newLie = lies[lieBoxesPos[lieBox]].statement;
      if (lieBox === 0) {
        setLie1(newLie);
      } else {
        setLie2(newLie);
      }
    }
  };

  return (
    <View>
      <Paragraph style={styles.textTitle} color={colors.text}>
        One Truth
      </Paragraph>
      <TextInput
        onChangeText={setInput}
        value={input}
        maxLength={50}
        style={styles.input}
        placeholder={!isCtxEdit ? 'Tell us a unique truth...' : undefined}
      />
      <Paragraph color={colors.text}>Two Lies</Paragraph>
      <GameLie onPressLie={onPressLie} id={0}>
        {lie1}
      </GameLie>
      <GameLie onPressLie={onPressLie} id={1}>
        {lie2}
      </GameLie>
    </View>
  );
};

export default GameBody;
