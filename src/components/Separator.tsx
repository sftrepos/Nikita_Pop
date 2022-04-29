import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  separator: {
    height: EStyleSheet.hairlineWidth,
  },
});

const Separator = React.memo(() => {
  const { colors } = useTheme();
  return (
    <View style={[styles.separator, { backgroundColor: colors.border }]} />
  );
});

export default Separator;
