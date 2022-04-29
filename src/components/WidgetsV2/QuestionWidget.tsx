import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Title2, Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  container: {
    borderRadius: 25,
    padding: '1rem',
    marginHorizontal: '1rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 1,
    flexGrow: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textQuestionResponse: {
    marginTop: '0.5rem',
    fontSize: '$fontSm',
  },
});

export type QuestionPacket = {
  question: string;
  response: string;
};

interface IQuestionWidget {
  questionWidgetData: QuestionPacket;
}

const QuestionWidget = ({
  questionWidgetData,
}: IQuestionWidget): ReactElement => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.containerHeader}>
        <Title3 color={colors.primary}>{questionWidgetData.question}</Title3>
      </View>
      <Title2
        style={styles.textQuestionResponse}
        color={colors.text}
        numberOfLines={6}>
        {questionWidgetData.response}
      </Title2>
    </View>
  );
};

export default QuestionWidget;
