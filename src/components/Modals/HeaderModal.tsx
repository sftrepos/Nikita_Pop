import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { SubmitHeaderButton } from 'components/HeaderButtons';
import { Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';

const styles = EStyleSheet.create({
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1 rem',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: '2rem',
    alignItems: 'center',
  },
});

interface HeaderModalProps {
  title: string;
  theme: Theme;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  onPressClose: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  hasSuccess?: boolean;
  rightLabel?: string;
}

const FilterSuccess = () => {
  const { colors } = useTheme();
  return (
    <Icon
      name="check-circle"
      size={20}
      style={styles.icon}
      color={colors.success}
    />
  );
};

const HeaderModal = React.memo<HeaderModalProps>(
  ({
    leftIcon,
    isLoading,
    title,
    style,
    theme,
    rightIcon,
    onPress,
    onPressClose,
    disabled,
    hasSuccess,
    rightLabel,
  }) => {
    const { colors } = theme;
    return (
      <View style={[styles.headerModal, style]}>
        <Pressable onPress={onPressClose}>
          {({ pressed }) => (
            <Icon
              size={25}
              name={leftIcon || 'chevron-down'}
              color={pressed ? theme.colors.border : theme.colors.text}
            />
          )}
        </Pressable>
        <View style={styles.titleContainer}>
          <Title3 color={theme.colors.text}>{title}</Title3>
          <View style={{ position: 'absolute', right: 0 }}>
            {isLoading ? (
              <ActivityIndicator size={16} color={colors.border} />
            ) : hasSuccess ? (
              <FilterSuccess />
            ) : (
              <></>
            )}
          </View>
        </View>
        {rightIcon ? (
          <Pressable onPress={onPressClose}>
            {({ pressed }) => (
              <Icon
                size={25}
                name={rightIcon}
                color={pressed ? theme.colors.border : theme.colors.text}
              />
            )}
          </Pressable>
        ) : (
          <>
            {onPress ? (
              <SubmitHeaderButton
                label={rightLabel}
                disabled={disabled}
                onPress={onPress}
              />
            ) : (
              <View style={{ width: 25, height: 25 }} />
            )}
          </>
        )}
      </View>
    );
  },
);

export default HeaderModal;
