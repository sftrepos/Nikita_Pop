import { Paragraph } from 'components/Text';
import React, { ReactElement } from 'react';
import { View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    padding: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scaleY: -1 }],
  },
  regContainer: {
    flex: 1,
    padding: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const MessagingEmptyView = ({
  message,
  isMessageScreen,
  textStyle,
}: {
  message?: string;
  isMessageScreen?: boolean;
  textStyle?: StyleProp<ViewStyle>;
}): ReactElement => {
  const {
    colors: { text, primary },
  } = useTheme();

  return (
    <View style={isMessageScreen ? styles.container : styles.regContainer}>
      {message ? (
        <Paragraph color={text} style={textStyle}>
          {message}
        </Paragraph>
      ) : (
        <ActivityIndicator color={primary} />
      )}
    </View>
  );
};

export default MessagingEmptyView;
