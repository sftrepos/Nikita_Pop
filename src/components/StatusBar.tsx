import React from 'react';
import { StatusBar as StatusBarRN, StatusBarStyle } from 'react-native';
import { ExtendedTheme } from '@react-navigation/native';

interface StatusBarProps {
  theme: ExtendedTheme;
  barStyle?: StatusBarStyle;
  backgroundColor?: string;
}

const StatusBar = React.memo<StatusBarProps>(
  ({ theme, barStyle, backgroundColor }) => {
    const themeColor = theme.dark ? 'dark' : 'light';
    if (!barStyle) {
      barStyle = 'light-content';
      if (themeColor === 'light') {
        barStyle = 'dark-content';
      }
    }
    return (
      <StatusBarRN
        backgroundColor={backgroundColor ?? theme.colors.background}
        barStyle={barStyle}
        animated
      />
    );
  },
);

export default StatusBar;
