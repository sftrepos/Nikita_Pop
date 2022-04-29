import React, { ReactElement } from 'react';
import TouchableScale from 'react-native-touchable-scale';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { touchableScaleTensionProps } from 'styles/commonStyles';

interface ISendButton {
  isLoading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const styles = EStyleSheet.create({
  icon: {
    // transform: [{ rotateZ: '-45deg' }, { translateX: 2 }],
  },
});

const SendButton = ({
  disabled,
  isLoading,
  onPress,
  style,
}: ISendButton): ReactElement => {
  const { colors } = useTheme();
  return (
    <TouchableScale
      {...touchableScaleTensionProps}
      onPress={(!disabled && onPress) || undefined}>
      <View style={style}>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Icon
            name="send"
            color={disabled ? colors.border : colors.primary}
            size={25}
            style={styles.icon}
          />
        )}
      </View>
    </TouchableScale>
  );
};

export default SendButton;
