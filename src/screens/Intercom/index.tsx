import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import IntercomContainer from './IntercomContainer';

const Intercom = ({ navigation }) => {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <StatusBar theme={theme} />
      <IntercomContainer />
    </SafeAreaView>
  );
};

export default Intercom;
