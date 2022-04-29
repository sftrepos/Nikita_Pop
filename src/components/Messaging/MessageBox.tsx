import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    padding: '1rem',
    borderRadius: 25,
  },
  textInputContainer: {
    width: '90%',
  },
});

interface IMessageBox {
  onChangeText: (input: string) => void;
  onFocus: () => void;
  values: {
    chat: string;
  };
}

const MessageBox = React.forwardRef<TextInput, IMessageBox>(({}, ref) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput ref={ref} />
    </View>
  );
});

export default MessageBox;
