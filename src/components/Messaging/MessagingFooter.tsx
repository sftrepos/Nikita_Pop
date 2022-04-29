import React, { ReactElement } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';

const MessagingFooter = ({
  isLoadingMore,
}: {
  isLoadingMore: boolean;
}): ReactElement | null => {
  const { colors } = useTheme();
  if (!isLoadingMore) {
    return null;
  }

  return (
    <View
      style={{
        padding: 10,
        width: '100%',
      }}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
};

export default MessagingFooter;
