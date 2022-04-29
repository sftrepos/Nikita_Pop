import React, { useState, useEffect, ReactElement } from 'react';
import {
  View,
  Pressable,
  Dimensions,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';
import { SbMessage } from 'screens/Chats/MessagesScreen';
import { GroupChannel, Reaction, UserMessage, Member } from 'sendbird';
import reactions, { reaction } from 'constants/reactions';
import store from 'store/index';
import ChatBubble from 'components/Messaging/ChatBubble';
import ConversationSlice from 'features/Chats/ConversationSlice';
import { useSelector } from 'react-redux';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import { List } from 'react-native-paper';
import { getId, getStoreToken } from 'util/selectors';
import Input from 'components/MessageInput/Input';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  container: {
    flex: 0,
    // height: Dimensions.get('screen').height / 4,
    borderRadius: 20,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingHorizontal: '1rem',
  },
  emojiContainer: {
    flex: 0,
    flexDirection: 'row',
    marginVertical: '1rem',
    paddingHorizontal: '1rem',
  },
  emojiListPanelContainer: {
    flex: 0,
    flexDirection: 'column',
    marginVertical: '1rem',
    paddingHorizontal: '1rem',
  },
  emojiHorizontalScrollview: {
    marginBottom: '1rem',
  },
  emojiButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: '.3rem',
  },
  emoji: {
    fontSize: '2rem',
  },
  emojiBG: {
    borderRadius: 100,
    padding: '.4rem',
    // borderWidth: 1,
  },
  emojiBGSelected: {
    backgroundColor: '$raspberry10',
    borderWidth: 1,
    borderColor: '$raspberry70',
  },
  panelItem: {
    // flex: 1,
    // alignSelf: 'start',
    padding: '1rem',
  },
  options: {
    flex: 1,
  },
  bubble: {
    paddingHorizontal: '1rem',
  },
  avatar: {
    padding: 0,
    height: 50,
    width: 50,
  },
  optionBG: {
    padding: '.5rem',
    textAlign: 'left',
    fontSize: '1.1rem',
  },
  optionRCButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '$raspberry70',
    // borderRadius: 30,
    marginHorizontal: '1rem',
    marginVertical: '.3rem',
    // flexDirection: 'row',
  },
});

interface IReactionPanel {
  isList: boolean;
  visible: boolean;
  close: () => void;
  doReaction: (item: reaction) => void;
  doReply: (item: SbMessage) => void;
  highlighted: Array<Reaction>;
  selectedMessage: SbMessage;
  onPressUser?: (uid: string) => void;
  conversation: GroupChannel;
}

// The reaction panel displayed in chat
// Can switch between reaction selection view and list of user reactions
const ReactionPanel = ({
  isList,
  visible,
  close,
  doReaction,
  doReply,
  highlighted,
  selectedMessage,
  onPressUser,
  conversation,
}: IReactionPanel): ReactElement => {
  const theme = useTheme();
  const id = getId(store.getState());
  const otherUsers = useSelector(
    (state) => state.conversation.otherUser,
  ) as Member[];

  const { colors } = theme;
  const right = selectedMessage.isUserMessage()
    ? (selectedMessage as UserMessage).sender.userId === id
    : false;

  const [currentReaction, setCurrentReaction] = useState(highlighted[0]);

  useEffect(() => {
    if (highlighted.length > 0) {
      setCurrentReaction(highlighted[0]);
    }
  }, [highlighted]);

  const renderUser = (item: Member) => {
    const { userId, nickname, metaData } = item as Member;
    const { avatar, name } = metaData as MetaData;

    let avatarJs = undefined;
    if (avatar) {
      avatarJs = JSON.parse(avatar);
    }

    return (
      <List.Item
        style={[styles.list, { backgroundColor: colors.card }]}
        title={nickname}
        titleStyle={{ color: colors.text }}
        descriptionStyle={{ color: colors.gray }}
        onPress={() => {
          onPressUser && onPressUser(userId);
        }}
        left={() => {
          if (avatarJs) {
            return (
              <CustomAvatar
                {...avatarJs}
                customAvatarContainerStyle={styles.avatar}
                scale={0.25}
              />
            );
          } else {
            return <></>;
          }
        }}
      />
    );
  };

  // conditional rendering of either reaction selection or user reaction list
  const reactionBody = () => {
    if (isList) {
      return (
        <View style={[styles.emojiListPanelContainer]}>
          <ScrollView horizontal style={styles.emojiHorizontalScrollview}>
            {highlighted.map((item) => {
              return (
                <Pressable
                  style={[styles.emojiButton, { marginHorizontal: 4 }]}
                  onPress={() => {
                    setCurrentReaction(item);
                  }}>
                  <View
                    style={[
                      styles.emojiBG,
                      currentReaction?.key === item.key
                        ? styles.emojiBGSelected
                        : { backgroundColor: colors.background },
                    ]}>
                    <Text style={styles.emoji}>
                      {reactions.find((el) => el.key === item.key)?.unicode}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView>
            {currentReaction &&
              currentReaction.userIds.map((userId) => {
                const sbUser = otherUsers.find((el) => el.userId === userId);
                // TODO name/nickname selection
                return <>{sbUser && renderUser(sbUser)}</>;
              })}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.emojiContainer}>
          {reactions.map((item) => {
            const userHighlighted = highlighted.find(
              (el) => el.key === item.key,
            );

            return (
              <Pressable
                style={[styles.emojiButton]}
                onPress={() => {
                  doReaction(item);
                }}>
                <View
                  style={[
                    styles.emojiBG,
                    userHighlighted?.userIds.find((el) => el === id)
                      ? styles.emojiBGSelected
                      : { backgroundColor: colors.background },
                  ]}>
                  <Text style={styles.emoji}>{item.unicode}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        close();
      }}>
      <Pressable style={{ flex: 1 }} onPress={() => close()} />
      {selectedMessage.isUserMessage() && (
        <Pressable
          style={[{ flex: 0, flexDirection: 'row' }, styles.bubble]}
          onPress={() => close()}>
          <ChatBubble
            item={selectedMessage}
            right={right}
            text={(selectedMessage as UserMessage).message}
            username="test"
          />
        </Pressable>
      )}

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            height: isList
              ? Dimensions.get('screen').height / 2
              : Dimensions.get('screen').height / 4,
          },
        ]}>
        {reactionBody()}

        {/* options */}
        {!isList && (
          <>
            {/* <Pressable
              style={[styles.optionRCButton]}
              onPress={() => {
                doReply(selectedMessage);
              }}>
              <Text style={styles.optionBG}>Reply</Text>
            </Pressable> */}
            <Pressable
              style={[styles.optionRCButton]}
              onPress={() => {
                close();
                Clipboard.setString((selectedMessage as UserMessage).message);
                Toast.show({
                  text1: 'Copied to clipboard!',
                  type: 'success',
                  position: 'bottom',
                });
              }}>
              <Text style={styles.optionBG}>Copy</Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
};

export default ReactionPanel;
