import React, { ReactElement, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import TextInput from 'components/TextInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IRequestChatPreview {
  navigation: any;
}

const styles = EStyleSheet.create({
  sa: {
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapChat: {
    flex: 1,
    paddingTop: '.25rem',
  },
  viewKB: {
    flexGrow: 1,
    paddingBottom: '2.5rem',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: '1rem',
  },
  messagesContentContainer: {},
  kbAccessoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '1 rem',
  },
});

const RequestChatPreview = ({
  navigation,
}: IRequestChatPreview): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  const renderItem = () => {
    return <View></View>;
  };

  const flatListRef = useRef<FlatList>(null);
  const onContentSizeChange = () => {};

  const renderInputController = () => {
    return (
      <TextInput
        theme={theme}
        label="Message"
        placeholder="Type your message here..."
        style={[styles.textInput, { backgroundColor: colors.background }]}
        multiline
      />
    );
  };

  const renderKeyboardRightActions = () => {
    return (
      <Pressable>
        {({ pressed }) => (
          <View style={styles.containerIcon}>
            <Icon name="send" size={25} />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.sa, { backgroundColor: colors.card }]}>
      <StatusBar theme={theme} />
      <KeyboardAvoidingView
        style={[styles.wrapChat, { backgroundColor: colors.card }]}
        behavior="padding"
        enabled
        keyboardVerticalOffset={Platform.OS === 'android' ? -250 : 100}
        contentContainerStyle={[
          styles.viewKB,
          { backgroundColor: colors.card },
        ]}>
        <FlatList
          ref={flatListRef}
          onContentSizeChange={onContentSizeChange}
          style={[styles.messagesContainer]}
          data={[]}
          renderItem={renderItem}
          contentContainerStyle={styles.viewKB}
        />
        <View style={styles.kbAccessoryContainer}>
          <View style={{ width: '90%' }}>{renderInputController()}</View>
          {renderKeyboardRightActions()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequestChatPreview;
