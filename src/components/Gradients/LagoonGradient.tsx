import React, { FunctionComponent } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LagoonGradientProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  start?: {
    x: number;
    y: number;
  };
  end?: {
    x: number;
    y: number;
  };
}

const LagoonGradient = ({
  style,
  children,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}: LagoonGradientProps): React.ReactElement => (
  <LinearGradient
    colors={['#66CAEA', '#63dfb2']}
    start={start}
    end={end}
    style={style}>
    {children}
  </LinearGradient>
);

export default LagoonGradient;
