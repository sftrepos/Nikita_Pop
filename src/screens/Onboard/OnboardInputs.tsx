import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

import { Paragraph, Title2, Title3 } from 'components/Text';

import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import { isPhoneIOS } from 'util/phone';
import { iteratorSymbol } from 'immer/dist/internal';

interface OnboardTextInputProps
  extends React.ClassAttributes<TextInput>,
    TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export const OnboardTextInput = (
  props: OnboardTextInputProps,
): React.ReactElement => {
  const { label, error, style } = props;

  const { colors } = useTheme();

  const styles = EStyleSheet.create({
    textInput: {
      width: '100%',
      color: colors.text,
      fontSize: '1 rem',
      backgroundColor: '$grey5',
      paddingVertical: '0.5 rem',
      paddingHorizontal: '1 rem',
      marginVertical: '0.5 rem',
      marginRight: 0,
      borderRadius: 12,
      elevation: 1,
      height: 40,
    },
  });

  return (
    <View style={style}>
      {label ? <Paragraph color={colors.text}>{label}</Paragraph> : null}
      <TextInput
        {...props}
        style={styles.textInput}
        placeholderTextColor={EStyleSheet.value('$grey3')}
        autoCorrect={false}
        returnKeyType="done"
      />
      {error ? (
        <Paragraph color={EStyleSheet.value('$watermelon')}>{error}</Paragraph>
      ) : null}
    </View>
  );
};

export const OnboardPickerSelect = (
  props: PickerSelectProps,
): React.ReactElement => {
  const { colors } = useTheme();

  const pickerStyle = EStyleSheet.create({
    inputIOS: {
      width: '100%',
      color: colors.text,
      fontSize: '1 rem',
      backgroundColor: '$grey5',
      paddingVertical: '0.5 rem',
      paddingHorizontal: '1 rem',
      marginVertical: '0.5 rem',
      marginRight: 0,
      borderRadius: 12,
      elevation: 1,
      height: 40,
    },
    inputAndroid: {
      width: '100%',
      color: colors.text,
      fontSize: '1 rem',
      backgroundColor: '$grey5',
      paddingVertical: '0.5 rem',
      paddingHorizontal: '1 rem',
      marginVertical: '0.5 rem',
      marginRight: 0,
      borderRadius: 12,
      elevation: 1,
      height: 40,
    },
  });

  // this is temp measure why picker is broken for rn 0.64 - https://github.com/react-native-picker/picker/issues/220
  const [androidOpenForm, setAndroidOpenForm] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState(null as string | null);

  return isPhoneIOS ? (
    <RNPickerSelect
      placeholder={{
        label: 'Year',
        value: null,
        color: EStyleSheet.value('$grey3'),
      }}
      style={pickerStyle}
      useNativeAndroidPickerStyle={false}
      textInputProps={{
        placeholderTextColor: EStyleSheet.value('$grey3'),
        autoCorrect: false,
      }}
      {...props}
    />
  ) : (
    // this is temp measure why picker is broken for rn 0.64 - https://github.com/react-native-picker/picker/issues/220
    <>
      <TouchableOpacity
        style={pickerStyle.inputAndroid}
        onPress={() => {
          setAndroidOpenForm(!androidOpenForm);
        }}>
        <Paragraph color={props.placeholder?.color}>
          {displayValue || props.placeholder?.label}
        </Paragraph>
      </TouchableOpacity>
      {androidOpenForm &&
        props.items.map((item, index) => (
          <TouchableOpacity
            style={{ paddingLeft: 10, marginBottom: 4 }}
            onPress={() => {
              props.onValueChange(item.value, index);
              setDisplayValue(props.items[index].label);
              setAndroidOpenForm(false);
            }}>
            <Title3 color={colors.text}>{item.label}</Title3>
          </TouchableOpacity>
        ))}
    </>
  );
};
