import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { Paragraph, Subtitle } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';

export const HEADER_ICON_SIZE = 32;

const styles = EStyleSheet.create({
  textSubmit: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  tealTextSubmit: {
    fontWeight: '700',
  },
});

interface HeaderButtonProps {
  name: string;
  onPress?: () => void;
  type?: string;
  iconSize?: number;
  style?: any;
}

interface SubmitHeaderButtonProps {
  label?: string;
  disabled?: boolean;
  onPress: () => void;
  style?: any;
}

export const CustomHeaderButton = React.memo<HeaderButtonProps>(
  ({ name, onPress, iconSize, type, style }) => {
    const { colors } = useTheme();

    const inactiveTint = Color(colors.text).mix(Color(colors.card), 0.5).hex();
    const activeTint = colors.primary;

    const renderIcon = (pressed: boolean) => {
      switch (type) {
        case 'ant-design':
          return (
            <AntDesignIcon
              name={name}
              size={iconSize || HEADER_ICON_SIZE}
              color={pressed ? activeTint : inactiveTint}
            />
          );
        default:
          return (
            <Icon
              name={name}
              size={iconSize || HEADER_ICON_SIZE}
              color={pressed ? activeTint : inactiveTint}
            />
          );
      }
    };

    return (
      <Pressable onPress={onPress} style={style}>
        {({ pressed }) => <>{renderIcon(pressed)}</>}
      </Pressable>
    );
  },
);

export const SubmitHeaderButton = React.memo<SubmitHeaderButtonProps>(
  ({ label, onPress, disabled }) => {
    const theme = useTheme();
    const { colors } = theme;
    return (
      <Pressable onPress={!disabled ? onPress : () => {}}>
        {({ pressed }) => (
          <Paragraph
            style={styles.textSubmit}
            color={
              !disabled
                ? pressed
                  ? colors.border
                  : colors.secondary
                : colors.border
            }>
            {label || 'Submit'}
          </Paragraph>
        )}
      </Pressable>
    );
  },
);

export const TealHeaderButton = React.memo<SubmitHeaderButtonProps>(
  ({ label, onPress, disabled }) => {
    const theme = useTheme();
    const { colors } = theme;
    return (
      <Pressable onPress={!disabled ? onPress : () => {}}>
        {({ pressed }) => (
          <Subtitle
            style={styles.tealTextSubmit}
            color={
              !disabled
                ? pressed
                  ? colors.border
                  : colors.primary
                : colors.border
            }>
            {label || 'Submit'}
          </Subtitle>
        )}
      </Pressable>
    );
  },
);
