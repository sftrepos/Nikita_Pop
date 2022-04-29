import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = EStyleSheet.create({
  messageInputContainer: {
    paddingVertical: '0.5rem',
    paddingHorizontal: '1rem',
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
  },
});

type SearchInputProps = {
  placeholder: string;
  msgType?: string;
  onSearch: (text: string) => void;
  hide: boolean;
};
const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder,
  hide,
  msgType,
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState<string>('');
  const inputRef = useRef();

  useEffect(() => {
    inputRef?.current?.clear();
  }, [msgType]);

  if (hide) return <></>;
  return (
    <View
      style={[
        styles.messageInputContainer,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <View style={[styles.inputContainer, { borderColor: colors.gray }]}>
        <Icon
          onPress={() => onSearch(text)}
          name="search"
          size={20}
          color={colors.gray}
          style={{ padding: 10 }}
        />
        <TextInput
          placeholder={placeholder}
          value={text}
          ref={inputRef}
          returnKeyType="search"
          autoFocus={true}
          onChangeText={setText}
          style={{ width: '75%' }}
          onEndEditing={() => onSearch(text)}
        />
        <Icon
          onPress={() => inputRef?.current?.clear()}
          name="times"
          size={20}
          color={colors.gray}
          style={{ padding: 10 }}
        />
      </View>
    </View>
  );
};
export default SearchInput;
