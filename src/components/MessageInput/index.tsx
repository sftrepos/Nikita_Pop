import React, { ReactElement, useState } from 'react';
import { View, Pressable } from 'react-native';
import Input from './Input';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { touchableScaleTensionProps } from 'styles/commonStyles';
import GifInput from 'screens/Chats/GifInput';
import StickerKeyboard from 'screens/Chats/StickerKeyboard';
import SearchInput from 'screens/Chats/SearchInput';
import useAnalytics from 'util/analytics/useAnalytics';

import { onChange } from 'react-native-reanimated';

const styles = EStyleSheet.create({
  messageInputContainer: {
    paddingVertical: '0.5rem',
    borderRadius: 25,
    flex: 1,
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '1rem',
  },
  messageInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    borderTopWidth: 1,
    paddingHorizontal: '1rem',
    paddingTop: '0.5rem',
  },
  sendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '1rem',
  },
});

type TMessageInput = {
  onChange: (text: string) => void;
  text: string;
  msgType: string;
  setMsgType: (type: string) => void;
  onPressSendMessage: (message: string) => void;
  onPressSendFileMessage: (file: string, type: string) => void;
};

const MessageInput = ({
  onChange,
  msgType,
  setMsgType,
  onPressSendMessage,
  onPressSendFileMessage,
  text,
}: TMessageInput): ReactElement => {
  const { colors } = useTheme();
  // const [msgType, setMsgType] = useState('text');
  const [gifTxt, setGifTxt] = useState('');
  const [stTxt, setSTTxt] = useState('');

  const analytics = useAnalytics();
  const handleIconPress = (icon: string) => {
    setMsgType(msgType !== icon ? icon : 'text');
  };

  return (
    <View style={{ paddingBottom: 10 }}>
      <GifInput
        hide={msgType !== 'gif'}
        onPressSendFileMessage={(file: string) =>
          onPressSendFileMessage(file, 'gif')
        }
        text={gifTxt}
      />
      <StickerKeyboard
        hide={msgType !== 'sticker'}
        onPressSendFileMessage={(file: string) =>
          onPressSendFileMessage(file, 'sticker')
        }
        text={stTxt}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.background },
        ]}>
        <View style={styles.messageInputWrapper}>
          {text === '' ? (
            <>
              <Pressable onPress={() => handleIconPress('gif')}>
                <Icon
                  name="gif"
                  size={30}
                  color={msgType === 'gif' ? colors.primary : colors.gray}
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      msgType === 'gif' ? colors.primary : colors.gray,
                    overflow: 'hidden',
                    marginHorizontal: 8,
                    height: 30,
                    width: 30,
                  }}
                />
              </Pressable>
              <Pressable onPress={() => handleIconPress('sticker')}>
                <Icon
                  name="sticker-outline"
                  size={30}
                  color={msgType === 'sticker' ? colors.primary : colors.gray}
                  style={{ marginHorizontal: 8 }}
                />
              </Pressable>
            </>
          ) : (
            <Icon
              onPress={() => onChange('')}
              name="close-circle"
              size={30}
              color={colors.primary}
            />
          )}
          <View
            style={[
              styles.messageInputContainer,
              {
                backgroundColor: colors.background,
              },
            ]}>
            <View style={styles.inputContainer}>
              <Input
                text={text}
                onFocus={() => setMsgType('text')}
                onChange={onChange}
              />
            </View>
          </View>
          <View style={styles.sendContainer}>
            <TouchableScale
              disabled={msgType === 'gif'}
              {...touchableScaleTensionProps}
              onPress={() => onPressSendMessage(text)}>
              <Icon name="send" size={30} color={colors.primary} />
            </TouchableScale>
          </View>
        </View>
      </View>

      <SearchInput
        hide={msgType === 'text'}
        placeholder={msgType === 'gif' ? 'Search GIPHY' : 'Search Stickers'}
        msgType={msgType}
        onSearch={(text: string) =>
          msgType === 'gif' ? setGifTxt(text) : setSTTxt(text)
        }
      />
    </View>
  );
};
export default MessageInput;
