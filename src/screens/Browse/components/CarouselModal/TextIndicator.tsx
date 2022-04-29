import React, { ReactElement } from 'react';
import { Paragraph } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

interface ITextIndicator {
  input: string;
}

const styles = EStyleSheet.create({
  text: { marginHorizontal: '1rem' },
});

const MAX_LENGTH = 200;
const WARN_THRESHOLD = MAX_LENGTH - 20;

export const getIndicatorColor = (inputLength: number): string => {
  const { colors } = useTheme();
  if (inputLength < WARN_THRESHOLD) {
    return colors.success;
  } else if (inputLength < MAX_LENGTH) {
    return colors.mango;
  } else {
    return colors.notification;
  }
};

const TextIndicator = ({ input }: ITextIndicator): ReactElement => {
  return (
    <Paragraph style={styles.text} color={getIndicatorColor(input.length - 1)}>
      {MAX_LENGTH - input.length}
    </Paragraph>
  );
};

export default TextIndicator;
