import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

interface ProgressBarProps {
  progress: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const ProgressBar = ({
  progress = 0,
  style,
  containerStyle,
}: ProgressBarProps): React.ReactElement => {
  return (
    <View style={[styles.emptyBar, containerStyle]}>
      <LinearGradient
        colors={[
          EStylesheet.value('$lagoonStart'),
          EStylesheet.value('$lagoonEnd'),
        ]}
        style={[
          styles.bar,
          { width: `${Math.min(100, progress * 100)}%` },
          style,
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 3, y: 0 }}
      />
    </View>
  );
};

const styles = EStylesheet.create({
  bar: {
    height: '.5rem',
    borderRadius: 10,
  },
  emptyBar: {
    backgroundColor: '$grey4',
    width: '100%',
    borderRadius: 10,
    marginVertical: '.5rem',
  },
});

export default ProgressBar;
