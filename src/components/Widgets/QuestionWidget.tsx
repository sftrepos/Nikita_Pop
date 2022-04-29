import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface QuestionWidgetProps {
  question: string;
  editable?: boolean;
  response?: string;
  onSubmit: (data: { question: string; response: string }) => void;
  onFocus?: () => void;
}

const QuestionWidget = ({
  question,
  editable = true,
  response,
  onSubmit,
  onFocus,
}: QuestionWidgetProps): React.ReactElement => {
  const [text, setText] = useState<string>(response || '');
  const [selected, setSelected] = useState<boolean>(false);
  const handleChange = (value: string) => {
    if (value.length < 131) {
      setText(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptContainer}>
        <Text style={styles.prompt}>{question}</Text>
        {(selected || response !== text) && (
          <TouchableOpacity
            hitSlop={{ right: 5, left: 5, top: 5, bottom: 5 }}
            onPress={() => {
              Keyboard.dismiss();
              onSubmit({ question, response: text });
            }}
            disabled={text?.length === 0}>
            <Icon
              name="send"
              size={25}
              color={
                text?.length > 0
                  ? EStylesheet.value('$raspberry70')
                  : EStylesheet.value('$grey3')
              }
            />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        onFocus={() => {
          if (onFocus) onFocus();
          setSelected(true);
        }}
        onBlur={() => setSelected(false)}
        multiline
        editable={editable}
        style={styles.preview}
        value={text}
        onChangeText={handleChange}
        placeholder={'Enter your response...'}
      />
      {selected && (
        <Text style={styles.charCount}>
          {text?.length ? 130 - text.length : 130}
        </Text>
      )}
    </View>
  );
};

const styles = EStylesheet.create({
  container: {
    borderRadius: 10,
    height: '3rem',
    marginVertical: '.5rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    backgroundColor: '$raspberry10',
    minHeight: '8rem',
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: '1rem',
    justifyContent: 'flex-start',
    paddingVertical: '1rem',
  },
  prompt: {
    fontSize: '$fontMd',
    color: 'black',
    fontWeight: '600',
    textAlign: 'left',
  },
  preview: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: '.75rem',
    marginVertical: '1rem',
    height: '10rem',
  },
  previewText: {
    textAlign: 'left',
    color: '$grey3',
  },
  charCount: {
    position: 'absolute',
    right: '2rem',
    bottom: '2.5rem',
    color: '$grey4',
  },
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doneText: {
    letterSpacing: 3,
    fontWeight: '600',
    color: '$grey4',
  },
  doneTextEnabled: {
    color: '$lagoonStart',
  },
});

export default QuestionWidget;
