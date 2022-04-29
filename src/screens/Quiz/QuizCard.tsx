import React, { ReactElement, useEffect } from 'react';

import { TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FastImage from 'react-native-fast-image';
import { Subtitle } from 'components/Text';
import QuizTakenIcon from 'assets/vectors/QuizTakenIcon';
import { useTheme } from '@react-navigation/native';

interface IQuizCard {
  quizId: string;
  onPress: () => void;
  graphic: string;
  title: string;
  taken: boolean;
}

const QuizCard = ({
  quizId,
  onPress,
  graphic,
  title,
  taken,
}: IQuizCard): ReactElement => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      // activeOpacity={0}
      onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.takenIcon}>
          <QuizTakenIcon
            fill={
              taken
                ? EStyleSheet.value(colors.mango)
                : EStyleSheet.value('$grey4')
            }
          />
        </View>
        <FastImage
          style={styles.image}
          source={{
            uri:
              'https://storage.googleapis.com/pop-app-assets/quiz/' + graphic,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Subtitle color={colors.text} style={{}}>
          {title}
        </Subtitle>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0.5,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 1.5,
    // elevation: 1,
    padding: '1rem',
    height: '10rem',
    width: '10rem',
    borderRadius: 25,
    justifyContent: 'center',
  },
  takenIcon: {
    // backgroundColor: 'yellow',
    alignSelf: 'flex-end',
  },
  image: {
    // backgroundColor: 'red',
    flex: 1,
    width: '100%',
  },
});

export default QuizCard;
