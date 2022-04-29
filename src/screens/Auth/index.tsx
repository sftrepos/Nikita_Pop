import React from 'react';
import ActivityIndicator from 'components/ActivityIndicator';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';

const Auth = (): React.ReactElement => {
  const theme = useTheme();

  return (
    <>
      <StatusBar theme={theme} />
      <ActivityIndicator isAbsolute />
    </>
  );
};

export default Auth;
