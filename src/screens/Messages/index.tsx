import React, { ReactElement, useRef, useEffect, useState } from 'react';
import {
  View,
  Pressable,
  TextInput as RNTextInput,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { MessagingNavigationProp, MessagingRouteProp } from 'nav/types';
import { Paragraph } from 'components/Text';
import { useForm } from 'react-hook-form';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { yupResolver } from '@hookform/resolvers';
import { MessageSchema } from 'util/validators';
import { Message } from 'screens/Chats/ConversationList';
import ChatBubble from 'components/Messaging/ChatBubble';
import { connect } from 'react-redux';
import { useKeyboard } from '@react-native-community/hooks';
import { getId, getStoreToken, getLocalUserData } from 'util/selectors';
import {
  updateCurrentRoomView,
  storeCachedMessages,
  reportUser,
  getChats,
  getConversation,
  unmatchChat,
  sendMessage,
} from '../../features/Chat/ChatActions';
import MessageProgressBar from 'components/MessageProgressBar/MessageProgressBar';
import { width, isAndroid, height } from 'util/phone';
import InAppReview from 'react-native-in-app-review';
import { PopAPIProtected } from 'services/api';
import { RootReducer } from 'store/rootReducer';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import useAnalytics from 'util/analytics/useAnalytics';

export interface MessagesProps {
  navigation: MessagingNavigationProp;
  route: MessagingRouteProp;
  messages: Message[];
  messagesLoading: boolean;
  handleLoadEarlier: () => void;
  chat: unknown;
  getConversation: (a, b, c: boolean) => void;
  chatId: string;
  id: string;
  localUser: Record<string, unknown>;
  loadEarlier: boolean;
  sendMessage: (message: string, id: string) => void;
  error: any;
  messageSending: boolean;
}

type FormData = {
  message: string;
};

const Messages = ({
  chat,
  messagesLoading,
  getConversation,
  chatId,
  loadEarlier,
  sendMessage,
  id,
  localUser,
  error,
  messageSending,
}: MessagesProps): ReactElement => {
  const {
    control,
    handleSubmit,
    errors,
    watch,
    reset,
    register,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(MessageSchema),
  });

  const analytics = useAnalytics();
  const otherUserId = chat?.users.find((u) => u !== id);
  const otherUser = chat?.userData[otherUserId];
  const [prevMsg, setPrevMsg] = useState<string | undefined>();

  const theme = useTheme();
  const { colors } = theme;

  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<RNTextInput>(null);
  const values = watch();

  const { keyboardShown } = useKeyboard();

  useEffect(() => {
    if (keyboardShown) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [keyboardShown]);

  useEffect(() => {
    register('chat');
  }, [register]);

  const [messages, setMessages] = useState<Array<Message>>(chat?.messages);
  const api = new PopAPIProtected();

  useEffect(() => {
    handleLoadRest();

    if (chat?.progress >= 0.66 && !localUser.meta.hasReviewed) {
      InAppReview.RequestInAppReview();
      api.putHasReviewed({ id, hasReviewed: true }).then(() => {});
    }
  }, []);

  useEffect(() => {
    setMessages(chat?.messages);
  }, [chat]);

  const handleLoadEarlier = (): void => {
    if (messages[0].index > 0)
      getConversation(chatId, chat?.messages[0].index, true);
  };

  const handleLoadRest = () => {
    getConversation(chatId, chat?.messages?.[messages.length - 1].index, false);
  };

  useEffect(() => {
    if (chat?.progress >= 0.66 && !localUser.meta.hasReviewed) {
      InAppReview.RequestInAppReview();
      api.putHasReviewed({ id, hasReviewed: true });
    }
  }, []);

  useEffect(() => {
    if (error) {
      if (prevMsg) setValue('chat', prevMsg);
    }
  }, [error]);

  const renderInputController = () => {
    return (
      <TextInput
        ref={textInputRef}
        numberOfLines={3}
        multiline
        placeholder="Type your message here..."
        onChangeText={(text) => setValue('chat', text)}
        style={[
          styles.textInputController,
          { backgroundColor: colors.background },
        ]}
        value={values.chat}
      />
    );
  };

  const disabled =
    !!errors.message || !values.chat?.length || values.chat?.length == 0;

  const renderKeyboardRightActions = () => {
    return (
      <Pressable
        onPress={() => {
          sendMessage(values.chat, chat?._id);
          setPrevMsg(values.chat);
          setValue('chat', '');
          analytics.logEvent(
            {
              name: 'CHAT MESSAGE SEND',
              data: { chatId: chat._id, message: values.chat },
            },
            true,
          );
        }}
        disabled={!values.chat?.length || values.chat?.length == 0}>
        {({ pressed }) => (
          <View style={styles.containerIcon}>
            <Icon
              name="send"
              color={disabled || pressed ? colors.border : colors.primary}
              size={25}
            />
          </View>
        )}
      </Pressable>
    );
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => (
    <>
      {item.index > 0 && index === 0 && (
        <Text style={styles.load}>Scroll Up to load Earlier Messages</Text>
      )}
      <ChatBubble
        text={item.text}
        username={id == item.user?._id ? '' : otherUser?.username}
        right={id === item.user?._id}
        borderColor={
          id !== item.user?._id ? otherUser?.avatar.faceColor : undefined
        }
      />
    </>
  );

  const [initialLoad, setInitialLoad] = useState(true);
  const onContentSizeChange = () => {
    if (!loadEarlier || initialLoad) {
      setInitialLoad(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderProgressBar = () => (
    <View style={styles.containerProgressBar}>
      <View style={styles.containerProgressBarTextWrap}>
        <View />
        <Paragraph
          color={colors.text}
          style={{ left: width * 0.44 - 10, position: 'absolute' }}>
          Unlock name
        </Paragraph>
        <Paragraph
          color={colors.text}
          style={{ position: 'absolute', right: 0 }}>
          Meetup
        </Paragraph>
      </View>
      <MessageProgressBar progress={chat?.progress} />
    </View>
  );

  return (
    <SafeAreaView style={styles.SA}>
      <StatusBar theme={theme} />
      <FlatList
        ref={flatListRef}
        onContentSizeChange={onContentSizeChange}
        data={messages}
        renderItem={renderItem}
        refreshing={messagesLoading}
        refreshControl={
          <RefreshControl
            refreshing={messagesLoading}
            onRefresh={handleLoadEarlier}
          />
        }
        style={styles.messagesContainer}
        contentContainerStyle={styles.container}
      />
      <KeyboardAccessoryView
        androidAdjustResize={isAndroid()}
        alwaysVisible
        hideBorder
        avoidKeyboard
        inSafeAreaView
        style={[styles.kbAccessoryWrapper, { backgroundColor: colors.card }]}>
        {renderProgressBar()}
        <View style={[styles.kbAccessoryContainer]}>
          <View style={[styles.textContainer]}>{renderInputController()}</View>
          {messageSending ? (
            <ActivityIndicator color={EStyleSheet.value('$raspberry')} />
          ) : (
            renderKeyboardRightActions()
          )}
        </View>
      </KeyboardAccessoryView>
      {error && (
        <Text style={styles.error}>
          There was an error sending your message. Please try again.
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  textContainer: {
    width: '90%',
  },
  textInputController: {
    maxHeight: height * 0.15,
    borderRadius: 25,
    padding: '0.5rem',
    paddingLeft: '1rem',
    marginLeft: '0.5rem',
  },
  SA: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  kbAccessoryWrapper: {},
  kbAccessoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '1 rem',
    paddingBottom: '0.5rem',
  },
  containerIcon: {
    paddingHorizontal: '1 rem',
  },
  messagesContainer: {
    flex: 1,
    paddingTop: '0.5rem',
    paddingHorizontal: '1rem',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingBottom: '0.5rem',
  },
  load: {
    fontSize: '$fontSm',
    color: '$grey4',
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  containerProgressBar: {
    justifyContent: 'center',
    padding: '0.5rem',
  },
  containerProgressBarTextWrap: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    color: '$watermelon',
    textAlign: 'center',
    fontSize: 10,
  },
});

const mapStateToProps = (state: RootReducer) => {
  const chatId = state.chats.currentRoom;

  return {
    localUser: getLocalUserData(state),
    id: getId(state),
    chat: state.chats.chats
      ? state.chats.chats.get(chatId)
        ? state.chats.chats.get(chatId)
        : null
      : null,
    token: getStoreToken(state),
    chatId,
    messagesLoading: state.chats.messagesLoading,
    loadEarlier: state.chats.loadEarlier,
    messageSending: state.chats.messageSending,
    error: state.chats.messageError,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    sendMessage: (text: string, chatId: string) =>
      dispatch(sendMessage(text, chatId)),
    getConversation: (chatId: string, offset: number, loadEarlier: boolean) =>
      dispatch(getConversation(chatId, offset, loadEarlier)),
    unmatchChat: (chatId: string) => dispatch(unmatchChat(chatId)),
    reportUser: (id: string, text: string) => dispatch(reportUser(id, text)),
    dispatchUpdateCurrentRoomView: (data: string) =>
      dispatch(updateCurrentRoomView(data)),
    getChats: (querySize: number) => dispatch(getChats(querySize)),
    storeMessages: (messages: Array<Message>) =>
      dispatch(storeCachedMessages(messages)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Messages);
