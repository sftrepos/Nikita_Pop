import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Pressable, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Title3 } from 'components/Text';
import Color from 'color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import LagoonGradient from '../Gradients/LagoonGradient';
import MaskedView from '@react-native-community/masked-view';

const styles = EStyleSheet.create({
  container: {
    height: '3.5 rem',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1 rem',
    borderRadius: 50,
  },
  containerRounded: {
    height: '3.5rem',
    width: '3.5rem',
  },
  innerContainer: {
    flexDirection: 'row',
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: '700',
    alignSelf: 'center',
    letterSpacing: 1,
    fontSize: '1 rem',
  },
  rightIcon: {},
});

interface ActionButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  type?: 'default' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  rightIcon?: string;
  left?: ReactNode;
  iconStyle?: StyleProp<ViewStyle>;
  gradient?: boolean;
  textGradient?: boolean;
  borderColor?: string;
}

const ActionButton = ({
  onPress,
  onPressIn,
  onPressOut,
  containerStyle,
  textStyle,
  label,
  type = 'default',
  disabled,
  loading,
  left,
  rightIcon,
  rounded,
  iconStyle,
  gradient,
  textGradient,
  borderColor,
}: ActionButtonProps): ReactElement => {
  const theme = useTheme();
  const { colors, dark } = theme;
  const colorMix = Color(colors.text).mix(Color(colors.card), 0.5).hex();
  const pressColorMix = dark
    ? Color(colors.text).fade(0.5).hex()
    : colors.border;
  const getIconColor = disabled ? colors.background : 'white';

  const renderButtonContent = (pressed: boolean) => (
    <>
      {left}
      <Title3
        style={[
          styles.label,
          disabled && { color: colors.background },
          pressed && !disabled && { color: pressColorMix },
          textStyle,
        ]}
        color={type === 'default' ? 'white' : colorMix}>
        {label}
      </Title3>
      {rightIcon && (
        <Icon
          name={rightIcon}
          color={(pressed && !disabled && pressColorMix) || getIconColor}
          size={20}
          style={[styles.rightIcon, iconStyle]}
        />
      )}
    </>
  );

  const renderButtonWithTextGradient = (pressed: boolean) => (
    <>
      <MaskedView
        style={{ flex: 1, height: '100%', flexDirection: 'column' }}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.label,
                disabled && { color: colors.background },
                pressed && !disabled && { color: pressColorMix },
                textStyle,
              ]}>
              {label}
            </Text>
          </View>
        }>
        <LagoonGradient
          style={{
            flex: 1,
          }}
        />
      </MaskedView>
    </>
  );

  if (!gradient)
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}>
        {({ pressed }) => (
          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  type === 'default' ? colors.primary : colors.card,
              },
              type === 'outline' && {
                borderWidth: 1,
                borderColor: borderColor || colors.border,
              },
              disabled && { backgroundColor: colors.border },
              rounded && styles.containerRounded,
              containerStyle,
              pressed && !disabled && { backgroundColor: pressColorMix },
            ]}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.innerContainer}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    {textGradient
                      ? renderButtonWithTextGradient(pressed)
                      : renderButtonContent(pressed)}
                  </>
                )}
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  else
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}>
        {({ pressed }) => (
          <>
            {disabled ? (
              <View
                style={[
                  styles.container,
                  { backgroundColor: colors.border },
                  rounded && styles.containerRounded,
                  containerStyle,
                ]}>
                <View style={styles.innerContainer}>
                  <>
                    {textGradient
                      ? renderButtonWithTextGradient(false)
                      : renderButtonContent(false)}
                  </>
                </View>
              </View>
            ) : (
              <LagoonGradient
                style={[
                  styles.container,
                  {
                    backgroundColor:
                      type === 'default' ? colors.primary : colors.card,
                  },
                  type === 'outline' && {
                    borderWidth: 1,
                    borderColor: borderColor || colors.border,
                  },
                  rounded && styles.containerRounded,
                  disabled && { backgroundColor: colors.border },
                  containerStyle,
                ]}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.innerContainer}>
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        {textGradient
                          ? renderButtonWithTextGradient(pressed)
                          : renderButtonContent(pressed)}
                      </>
                    )}
                  </View>
                )}
              </LagoonGradient>
            )}
          </>
        )}
      </Pressable>
    );
};

export default ActionButton;
