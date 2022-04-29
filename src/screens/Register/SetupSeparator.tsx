import React from 'react';
import { ExtendedTheme } from '@react-navigation/native';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  sep: {
    height: '0.5 rem',
    width: '3 rem',
    marginLeft: '1 rem',
    marginVertical: '1 rem',
    borderRadius: 25,
  },
});

export const SetupSeparator = React.memo(
  ({ theme }: { theme: ExtendedTheme }) => (
    <View style={[styles.sep, { backgroundColor: theme.colors.primary }]} />
  ),
);
