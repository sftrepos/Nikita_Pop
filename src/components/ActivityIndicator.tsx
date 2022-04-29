import React, { ReactElement } from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  indicator: {
    padding: 16,
  },
});

export interface ActivityIndicatorProps {
  isAbsolute?: boolean;
  [x: string]: unknown;
}

const ActivityIndicator = ({
  isAbsolute,
  ...rest
}: ActivityIndicatorProps): ReactElement => (
  <RNActivityIndicator
    style={[styles.indicator, isAbsolute && commonStyles.absolute]}
    {...rest}
  />
);

export default ActivityIndicator;
