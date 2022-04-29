import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import TouchableScale from 'react-native-touchable-scale';
import { touchableScaleTensionProps } from 'styles/commonStyles';
import LagoonGradient from 'components/Gradients/LagoonGradient';

const styles = EStyleSheet.create({
  container: {
    width: '3 rem',
    height: '3 rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: '.1rem',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  icon: {},
});

interface IQuickSendButton {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const QuickSendButton = ({
  disabled,
  onPress,
  style,
  containerStyle,
}: IQuickSendButton): ReactElement => {
  const { colors } = useTheme();
  return (
    <TouchableScale
      {...touchableScaleTensionProps}
      style={[styles.container, containerStyle]}
      onPress={(!disabled && onPress) || undefined}>
      <LagoonGradient style={[styles.container, style]}>
        <Icon name="send" color={'white'} size={25} style={styles.icon} />
      </LagoonGradient>
    </TouchableScale>
  );
};

export default QuickSendButton;
