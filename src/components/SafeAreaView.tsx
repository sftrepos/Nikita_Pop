import React, { ReactNode } from 'react';
import { SafeAreaView as SA } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface SafeAreaViewProps {
  style?: StyleProp<ViewStyle>;
  vertical?: boolean;
  children: ReactNode;
}

const SafeAreaView = React.memo<SafeAreaViewProps>(
  ({ style, children, vertical = true, ...props }) => {
    const theme = useTheme();
    const { colors } = theme;
    return (
      <SA
        style={[
          styles.container,
          { backgroundColor: colors.background },
          style,
        ]}
        edges={vertical ? ['right', 'left'] : undefined}
        {...props}>
        {children}
      </SA>
    );
  },
);

export default SafeAreaView;
