import React, { ReactElement, RefObject } from 'react';
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  ViewStyle,
  TextInputProps as RNTextInputProps,
  StyleProp,
} from 'react-native';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  containerTextInput: {
    padding: '1 rem',
    marginHorizontal: '1 rem',

    borderRadius: 10,
    fontSize: '$fontMd',
  },
  container: {
    // borderWidth: 1,
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: '1 rem',
  },
});

interface TextInputProps {
  inputRef?:
    | string
    | ((instance: RNTextInput | null) => void)
    | RefObject<RNTextInput>
    | null
    | undefined;
  label: string;
  loading?: boolean;
  error?: Record<string, unknown>;
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder: string;
  showPassword?: boolean;
  style?: ViewStyle;
  errors?: boolean;
  multiline?: boolean;
  disabled?: boolean;
  textContentType?: string;
  defaultValue?: string;
}

const TextInput = ({
  inputRef,
  label,
  loading,
  placeholder,
  error,
  secureTextEntry,
  containerStyle,
  style,
  showPassword,
  errors,
  multiline,
  disabled,
  textContentType,
  defaultValue,
  ...inputProps
}: TextInputProps & RNTextInputProps): ReactElement => {
  const theme = useTheme();
  return (
    <View style={[styles.container, containerStyle]}>
      <RNTextInput
        textContentType={textContentType}
        ref={inputRef}
        editable={!disabled}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        accessibilityLabel={placeholder}
        placeholderTextColor={theme.colors.border}
        placeholder={placeholder}
        defaultValue={defaultValue}
        secureTextEntry={secureTextEntry && !showPassword}
        style={[
          styles.containerTextInput,
          errors && { borderWidth: 1, borderColor: theme.colors.notification },
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          },
          style,
        ]}
        multiline={multiline}
        {...inputProps}
      />
      {loading && <ActivityIndicator />}
    </View>
  );
};

export default TextInput;
