import React, { ReactElement } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

const Message = (): ReactElement => {
  return <View style={[styles.container]}></View>;
};

export default Message;
