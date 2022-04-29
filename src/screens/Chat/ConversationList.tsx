import React, { ReactElement, useState, useEffect } from 'react';
import { FlatList, TextInput, RefreshControl, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import ConversationRow from 'screens/Chats/ConversationRow';
import { ChatsScreenNavigationProp } from 'nav/types';
import { useDispatch } from 'react-redux';
import { updateCurrentRoomView } from 'features/Chat/ChatActions';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatUser } from 'services/types';
import useAnalytics from 'util/analytics/useAnalytics';

export type Message = {
  user: {
    _id: string;
  };
  _id: string;
  text: string;
  createdAt: typeof Date;
  index: number;
};

export type ChatItem = {
  archived: boolean;
  users: string[];
  lastRead: Record<string, string>;
  progress: number;
  switches: number;
  _id: string;
  messages: Message[];
  groupId: string;
  created: typeof Date;
  lastUpdate: typeof Date;
  maxSwitches: number;
  userData: ChatUser[];
};

interface ConversationList {
  chats: Map<string, ChatItem>;
  identityId: string;
  dispatchGetChats: (n: number) => void;
  navigation: ChatsScreenNavigationProp;
}

const ConversationList = ({
  chats,
  navigation,
  identityId,
  dispatchGetChats,
}: ConversationList): ReactElement => {
  const analytics = useAnalytics();
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const [searching, setSearching] = useState(false);
  const [localStateChats, setLocalStateChats] = useState<
    Array<ChatItem | undefined>
  >(Array.from(chats.values()).filter((c) => !c.groupId) || []);

  useEffect(() => {
    setLocalStateChats(Array.from(chats.values()).filter((c) => !c.groupId));
  }, [chats]);

  const handleSearch = _.debounce((text: string) => {
    setSearching(text.length > 0);
    const chatsArray = Array.from(chats.values()).filter((c) => !c.groupId);
    if (text.length <= 1) {
      setLocalStateChats(chatsArray);
      return;
    }

    const searchExp = RegExp(text.toLowerCase());

    const filteredChats = chatsArray.filter((c) => {
      let check = false;

      Object.values(c.userData).forEach((u) => {
        if (
          c.progress < 1 &&
          u.username &&
          searchExp.test(u.username.toLowerCase())
        ) {
          check = true;
          return;
        }

        if (c.progress >= 1 && u.name && searchExp.test(u.name.toLowerCase())) {
          check = true;
          return;
        }
      });

      c.messages.forEach((msg) => {
        if (searchExp.test(msg.text.toLowerCase())) {
          check = true;
          return;
        }
      });

      return check;
    });

    setLocalStateChats(filteredChats);
  }, 700);

  const chatsArr = localStateChats;

  const renderListItem = ({ item }: { item: ChatItem }) => {
    const {
      users,
      lastRead,
      _id,
      messages,
      groupId,
      lastUpdate,
      archived,
      progress,
      switches,
      created,
      maxSwitches,
      userData,
    } = item;

    const areMessagesEmpty = messages.length > 0;

    const newMessage =
      areMessagesEmpty && lastRead
        ? moment(lastRead[identityId]).isBefore(
            moment(messages[messages.length - 1]?.createdAt),
          ) && identityId !== messages?.[messages.length - 1]?.user?._id
        : false;

    if (groupId) {
      return null;
    }

    const lastMessage = messages?.[messages.length - 1]?.text;
    const lastMessageTimeStamp = messages?.[messages.length - 1]?.createdAt;

    const otherUserId = users.filter((u) => u !== identityId)[0];

    const message = areMessagesEmpty ? lastMessage : "It's a match!";
    const timeStamp = areMessagesEmpty ? lastMessageTimeStamp : lastUpdate;

    const onPress = () => {
      dispatch(updateCurrentRoomView(_id));
      navigation.navigate('MESSAGING_STACK', {
        chatId: _id,
        otherUser: userData[otherUserId],
      });
      analytics.logEvent(
        {
          name: 'CHATROOM NAVIGATE',
          data: {
            chatId: _id,
          },
        },
        true,
      );
    };

    return (
      <>
        <ConversationRow
          message={message}
          newMessage={newMessage}
          timeStamp={timeStamp}
          isBlocked={false}
          isHidden={false}
          navigation={navigation}
          isRead={false}
          isSwipeEnabled={true}
          // toggleRead={() => {}}
          // blockChat={() => {}}
          // hideChat={() => {}}
          type="dm"
          onPress={onPress}
          theme={theme}
          otherUserId={otherUserId}
          userData={userData[otherUserId]}
          progress={progress}
        />
      </>
    );
  };

  const onRefresh = () => {
    dispatchGetChats(15);
    // Refresh chats
    // Refreshing = true
  };

  const onEndReached = () => {
    // Get subscribed chats
    if (!searching) dispatchGetChats(chatsArr.length + 10);
  };

  return (
    <View style={styles.listContainer}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.background },
        ]}>
        <Icon name="magnify" size={26} color={colors.gray} />
        <TextInput
          placeholder="Search Messages"
          placeholderTextColor={colors.border}
          style={styles.search}
          onChangeText={handleSearch}
        />
      </View>
      {chatsArr?.length === 0 && (
        <Text style={styles.emptyTxt}>No Chats. Pull down to reload!</Text>
      )}
      <FlatList
        data={chatsArr}
        style={[styles.list, { backgroundColor: colors.background }]}
        renderItem={renderListItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={colors.border}
          />
        }
      />
    </View>
  );
};

const styles = EStyleSheet.create({
  $actionItemWidth: '4 rem',
  _itemWidth: {
    normal: '$actionItemWidth',
    all: '$actionItemWidth * 2',
  },
  list: {},
  listItem: {
    height: '4 rem',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listHiddenItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    height: '4 rem',
  },
  rightActionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  search: {
    marginLeft: '1rem',
  },
  searchContainer: {
    borderRadius: 25,
    margin: '1rem',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '0.5rem',
  },
  listContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    marginBottom: '5rem',
  },
  emptyTxt: {
    color: '$grey2',
    fontSize: 13,
    textAlign: 'center',
    top: '11rem',
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2,
  },
});

export default ConversationList;
