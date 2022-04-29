import React, { ReactElement, ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

interface ISurface {
  children: ReactNode;
  onPress: () => void;
  pressableProps?: PressableProps;
  containerStyle?: StyleProp<ViewStyle>;
}

const styles = EStyleSheet.create({
  buttonContainer: {},
});

/**
 * Wrapper around the Pressable API.
 */
const Surface = ({
  onPress,
  children,
  pressableProps,
  containerStyle,
}: ISurface): ReactElement => {
  const theme = useTheme();
  const onPressIn = () => {};

  const buttonContainerActive = {};
  return (
    <Pressable {...pressableProps} onPressIn={onPressIn} onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.buttonContainer,
            containerStyle,
            pressed && buttonContainerActive,
          ]}>
          {children}
        </View>
      )}
    </Pressable>
  );
};

export default Surface;
