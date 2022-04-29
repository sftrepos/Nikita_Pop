import React, { ReactElement, forwardRef } from 'react';
import { ViewStyle, StyleProp, TextInput, View } from 'react-native';
import { Paragraph } from 'components/Text';
import TextIndicator, {
  getIndicatorColor,
} from 'screens/Browse/components/CarouselModal/TextIndicator';
import SendButton from 'screens/Browse/components/CarouselModal/SendButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  outerInputContainer: {
    margin: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 1,
    flexGrow: 1,
  },
  sendMessageContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendMessageText: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  containerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '1rem',
    backgroundColor: '#f1fbfd',
    borderRadius: 25,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    padding: '1rem',
  },
  sendButtonContainer: {
    // backgroundColor: 'red',
    width: '2.5rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

interface IInviteInputBox {
  text: string;
  isKbFocused: boolean;
  onKeyboardTap: () => void;
  setKbFocus: (focus: boolean) => void;
  onKeyboardFocus: () => void;
  setText: (text: string) => void;
  isLoading: boolean;
  onPressSend: () => void;
  isSendRequestSuccess: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const InviteInputBox = forwardRef<TextInput, IInviteInputBox>(
  (
    {
      text,
      isKbFocused,
      onKeyboardTap,
      setKbFocus,
      onKeyboardFocus,
      setText,
      isLoading,
      onPressSend,
      // isSendRequestSuccess,
      containerStyle,
    },
    textInputRef,
  ): ReactElement => {
    const { colors } = useTheme();
    return (
      <View
        style={[
          styles.outerInputContainer,
          { backgroundColor: colors.card },
          containerStyle,
        ]}>
        <View style={styles.sendMessageContainerRow}>
          <Paragraph color={colors.purple} style={styles.sendMessageText}>
            Send Message
          </Paragraph>
          {isKbFocused && <TextIndicator input={text} />}
        </View>
        <View
          style={[
            styles.containerInput,
            { borderColor: colors.border, backgroundColor: colors.background },
            isKbFocused && {
              borderColor: colors.primary,
              backgroundColor: colors.card,
            },
          ]}>
          <TextInput
            ref={textInputRef}
            autoFocus={isKbFocused}
            onFocus={onKeyboardTap}
            onBlur={() => setKbFocus(false)}
            onChange={onKeyboardFocus}
            placeholder="Start a conversation"
            returnKeyType="done"
            value={text}
            onChangeText={setText}
            style={[
              styles.input,
              { backgroundColor: colors.background },
              isKbFocused && {
                backgroundColor: colors.card,
              },
            ]}
            selectionColor={colors.text}
          />
          {isKbFocused && (
            <SendButton
              disabled={
                getIndicatorColor(text.length - 1) === colors.notification
              }
              style={styles.sendButtonContainer}
              isLoading={isLoading}
              onPress={onPressSend}
            />
          )}
        </View>
      </View>
    );
  },
);

export default InviteInputBox;
