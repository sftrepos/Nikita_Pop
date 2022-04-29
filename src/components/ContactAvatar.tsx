import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ExtendedTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = EStyleSheet.create({
  avatar: {
    alignSelf: 'center',
  },
  container: {
    width: '3rem',
    height: '3rem',
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  text: {
    //justifyContent: 'center',
    alignSelf: 'center',
    fontSize: '1rem',
    color: '$white',
  },
});

const backgroundColors = ['#F7CDCD', '#FF0099'];

interface ContactAvatarProps {
  text?: string;
  index?: number;
  textStyle?: ViewStyle;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ContactAvatar = React.memo<ContactAvatarProps>(
  ({ text, textStyle, onPress, containerStyle, index }) => {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={[
              styles.container,
              { backgroundColor: index % 2 == 0 ? '#F7CDCD' : '#FF0099' },
              containerStyle,
            ]}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </View>
        )}
      </Pressable>
    );
  },
);

export default ContactAvatar;
