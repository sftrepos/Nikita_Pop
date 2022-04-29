import React, { ReactElement } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Title } from 'components/Text';
import QuizCard from './QuizCard';
import { useTheme } from '@react-navigation/native';

export type TQuiz = {
  _id: string;
  graphic: string;
  title: string;
};

interface IQuizView {
  quizzes: TQuiz[];
  quiz: unknown;
  selectQuiz: () => void;
  submissions: unknown;
}

const QuizView = ({
  quizzes,
  quiz,
  selectQuiz,
  submissions,
}: IQuizView): ReactElement => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Title color={colors.text}>What's your personality like?</Title>
      <Paragraph color={colors.text} style={styles.quizDesc}>
        Welcome to Quiz! Take our quiz to find out more about your personality
        and recommended users.
      </Paragraph>
      <View style={styles.quizContainer}>
        {quizzes &&
          submissions &&
          quizzes.map((q) => (
            <QuizCard
              quizId={q._id}
              graphic={q.graphic}
              title={q.title}
              onPress={() => selectQuiz(q._id)}
              taken={submissions.find((s) => s.quizTemplate === q._id)}
            />
          ))}
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: '2rem',
    paddingHorizontal: '1.5rem',
  },
  quizContainer: {
    flexDirection: 'row',
    padding: '1rem',
  },
  quizDesc: {
    marginTop: '2rem',
  },
});

export default QuizView;
