import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

interface ProgressBarProps {
  progress: number;
  style?: StyleProp<ViewStyle>;
}

const ProgressBar = ({
  progress = 0,
  style,
}: ProgressBarProps): React.ReactElement => {
  return (
    <LinearGradient
      colors={[EStylesheet.value('$mango'), EStylesheet.value('$mangoEnd')]}
      style={[
        styles.bar,
        { width: `${Math.min(100, progress * 100)}%` },
        style,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}></LinearGradient>
  );
};

const styles = EStylesheet.create({
  bar: {
    height: '.5rem',
  },
});

export default ProgressBar;
