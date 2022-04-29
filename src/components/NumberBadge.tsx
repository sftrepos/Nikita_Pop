import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  _c: {
    r1: '.9rem',
  },
  badge: {
    // height: '1.25rem',
    // width: '1.25rem',
    paddingHorizontal: '.5rem',
    paddingVertical: '.2rem',
    backgroundColor: '$mango',
    borderRadius: '1rem',
    justifyContent: 'center',
    marginLeft: '.25rem',
  },
  badgeText: {
    color: 'white',
    textAlign: 'center',
  },
});

interface NumberBadgeProps {
  number: number;
  textSize?: number;
  containerStyle?: ViewStyle;
}

const NumberBadge = React.memo<NumberBadgeProps>(
  ({ containerStyle, number, textSize }) => {
    if (number > 0)
      return (
        <View style={[styles.badge, containerStyle]}>
          <Text
            style={[
              styles.badgeText,
              { fontSize: textSize ? textSize : styles._c.r1 },
            ]}>
            {number}
          </Text>
        </View>
      );
    else return <></>;
  },
);

export default NumberBadge;
