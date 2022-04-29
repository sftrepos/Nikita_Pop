import React, { ReactElement, useState } from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
const styles = EStyleSheet.create({
  textInput: {
    flex: 1,
    includeFontPadding: false,
    padding: 0,
    paddingTop: 0,
    textAlignVertical: 'center',
    fontSize: '1.1rem',
  },
});
const MAX_LENGTH = 250,
  MAX_NUM_LINES = 5,
  DEFAULT_HEIGHT = 17;
type TInput = {
  text: string;
  onFocus: () => void;
  onChange: (text: string) => void;
};
const Input = ({ text, onFocus, onChange }: TInput): ReactElement => {
  const { colors } = useTheme();
  const [textHeight, setTextHeight] = useState(0);
  const onContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    if (!textHeight) {
      setTextHeight(e.nativeEvent.contentSize.height);
    }
  };
  return (
    <TextInput
      maxLength={MAX_LENGTH}
      autoFocus
      onFocus={onFocus}
      multiline={true}
      style={[
        styles.textInput,
        {
          color: colors.text,
          maxHeight: (textHeight || DEFAULT_HEIGHT) * MAX_NUM_LINES,
        },
      ]}
      value={text}
      onContentSizeChange={onContentSizeChange}
      onChangeText={onChange}
      placeholder={'Message'}
      placeholderTextColor={colors.gray}
    />
  );
};
export default Input;
