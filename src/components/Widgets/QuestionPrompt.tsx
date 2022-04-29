import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { questionInterface } from '../../interfaces';

interface QuestionPromptProps {
  expanded?: boolean;
  question: questionInterface;
  onConfirmPress: (question: string) => void;
  onPress: (question: string) => void;
}

const QuestionPrompt = ({
  expanded = false,
  question,
  onConfirmPress,
  onPress,
}: QuestionPromptProps): React.ReactElement => {
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    setExpand(expanded);
  }, [expanded]);

  if (expand)
    return (
      <TouchableWithoutFeedback
        onPress={() => onConfirmPress(question.question)}>
        <View style={[styles.container, styles.containerExpanded]}>
          <Text style={[styles.prompt, styles.promptExpanded]}>
            {question.question}
          </Text>
          <View style={styles.preview}>
            <Text style={styles.previewText}>Tap to confirm prompt</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  else
    return (
      <TouchableWithoutFeedback onPress={() => onPress(question.question)}>
        <View style={styles.container}>
          <Text style={styles.prompt}>{question.question}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
};

const styles = EStylesheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: '3rem',
    marginVertical: '.5rem',

    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  containerExpanded: {
    backgroundColor: '$raspberry10',
    minHeight: '8rem',
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: '1rem',
    justifyContent: 'flex-start',
    paddingVertical: '1rem',
  },
  prompt: {
    textAlign: 'center',
    fontSize: '$fontMd',
    color: 'black',
    fontWeight: '600',
  },
  promptExpanded: {
    textAlign: 'left',
  },
  preview: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: '.5rem',
    marginVertical: '1rem',
    height: '3rem',
  },
  previewText: {
    textAlign: 'left',
    color: '$grey3',
  },
});

export default QuestionPrompt;
