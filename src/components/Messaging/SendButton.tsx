import React, { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SendButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}

const SendButton = ({
  label = 'SEND',
  onPress,
  disabled,
}: SendButtonProps): ReactElement => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}>
      <Icon
        name="send"
        color={
          disabled
            ? EStylesheet.value('$grey4')
            : EStylesheet.value('$raspberry70')
        }
        size={25}
      />
    </TouchableOpacity>
  );
};

const styles = EStylesheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
  },
  text: {
    color: '$lychee',
    fontSize: '$fontMd',
    fontWeight: '700',
  },
  disabled: {
    backgroundColor: '$grey4',
  },
});

export default SendButton;
