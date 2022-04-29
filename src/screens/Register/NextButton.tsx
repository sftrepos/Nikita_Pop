import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import ActionButton from 'components/Buttons/ActionButton';
import React from 'react';
import { Theme, useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

interface NextButtonProps {
  onPress: () => void;
  theme?: Theme;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  noIcon?: boolean;
  isLoading?: boolean;
  label?: string;
  icon?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const styles = EStyleSheet.create({
  buttonContainer: {
    paddingVertical: '1 rem',
    marginBottom: '.5rem',
  },
  button: { alignItems: 'flex-end' },
  stdPadding: {
    paddingHorizontal: '1 rem',
  },
  text: {
    letterSpacing: 3,
  },
});

const NextButton = React.memo<NextButtonProps>(
  ({
    onPress,
    label,
    noIcon,
    icon,
    theme = useTheme(),
    style,
    disabled,
    isLoading,
    containerStyle,
    textStyle,
  }) => {
    return (
      <View style={[styles.button, styles.buttonContainer, style]}>
        <ActionButton
          containerStyle={containerStyle ? containerStyle : styles.stdPadding}
          onPress={onPress}
          theme={theme}
          loading={isLoading}
          disabled={disabled}
          gradient
          rightIcon={noIcon ? undefined : icon || 'arrow-right'}
          label={label || 'Next'}
          textStyle={[styles.text, textStyle]}
        />
      </View>
    );
  },
);
export default NextButton;
