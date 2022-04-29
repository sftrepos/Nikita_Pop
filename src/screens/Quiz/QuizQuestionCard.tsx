import React, { useEffect, useState } from 'react';

import { TouchableOpacity, View, Text, TouchableHighlight } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FastImage from 'react-native-fast-image';
import { Subtitle, Title } from 'components/Text';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';

interface IQuizQuestion {
  desc: string;
  graphic: string;
  answers: any[];
  selected: number;
  onPress: (
    ix: number,
    key: string,
    questionKey: string,
    index: number,
  ) => void;
  questionKey: string;
  index: number;
}

const QuizQuestionCard = ({
  desc,
  graphic,
  answers,
  onPress,
  questionKey,
  index,
}: IQuizQuestion) => {
  const [selected, setSelected] = useState<number>(-1);
  // useEffect(() => {
  //   console.log("QUizQuestionCard: ", index)
  // })
  return (
    <View style={[styles.card]}>
      <Subtitle
        style={[
          styles.desc,
          {
            flex: 1,
          },
        ]}>
        {desc}
      </Subtitle>
      <View style={[{ flex: 1.5 }]}>
        <FastImage
          style={[styles.image]}
          source={{
            uri:
              'https://storage.googleapis.com/pop-app-assets/quiz/' + graphic,
          }}
        />
      </View>
      <View
        style={[
          {
            alignItems: 'center',
            flex: 2,
            justifyContent: 'space-evenly',
            width: '100%',
          },
        ]}>
        {answers &&
          answers.map((a, ix) => {
            return (
              <AnswerChoice
                selected={selected == ix}
                desc={a.desc}
                onPress={() => {
                  onPress(ix, a.key, questionKey, index);
                  setSelected(ix);
                }}
                key={a.key}
              />
            );
          })}
      </View>
    </View>
  );
};

const AnswerChoice = ({ desc, selected, onPress, key }) => {
  const { colors } = useTheme();
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.gray}
      style={[styles.answer, selected ? styles.answerSelected : null]}>
      <Text
        adjustsFontSizeToFit
        allowFontScaling
        numberOfLines={7}
        style={[{}, selected && styles.selectedTxt]}>
        {desc}
      </Text>
    </TouchableHighlight>
  );
};

const styles = EStyleSheet.create({
  card: {
    paddingVertical: '15%',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 1,
    padding: '1rem',
    borderRadius: 25,
    justifyContent: 'space-evenly',
    height: '100%',
    width: '100%',
  },
  image: {
    width: '10rem',
    height: '8rem',
    resizeMode: 'stretch',
  },
  takenIcon: {
    alignSelf: 'flex-end',
  },
  answer: {
    paddingHorizontal: '1rem',
    paddingVertical: '.5rem',
    backgroundColor: '$grey5',
    borderRadius: 10,
    width: '100%',
    height: '40%',
    justifyContent: 'center',
  },
  answerSelected: {
    backgroundColor: '$raspberry',
  },
  selectedTxt: {
    color: 'white',
  },
  desc: {
    fontWeight: '700',
  },
});

export default QuizQuestionCard;
