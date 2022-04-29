import React, { ReactElement, useState } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

interface IIconButton {
  onPress: () => void;
  iconName: string;
  size?: number;
  iconColor?: string;
  iconBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
}

const IconButton = ({
  onPress,
  iconName,
  iconColor,
  iconBackgroundColor,
  size,
  style,
  containerStyle,
  pressedStyle,
}: IIconButton): ReactElement => {
  const { colors } = useTheme();
  const [iconPressed, setIconPressed] = useState(false);
  return (
    <View
      style={[
        iconPressed && { backgroundColor: colors.background } && pressedStyle,
        containerStyle,
      ]}>
      <Pressable onPress={onPress} style={style}>
        {({ pressed }) => {
          setIconPressed(pressed);
          return (
            <Icon
              style={{ backgroundColor: iconBackgroundColor }}
              name={iconName}
              color={iconColor}
              size={size}
            />
          );
        }}
      </Pressable>
    </View>
  );
};

export default IconButton;
