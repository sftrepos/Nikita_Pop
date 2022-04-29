import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Paragraph, Title2 } from 'components/Text';
import SendBird, {
  GroupChannelListQuery,
  GroupChannel,
  Member,
} from 'sendbird';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getId, getStoreToken } from 'util/selectors';
import MessagingFooter from 'components/Messaging/MessagingFooter';
import MessagingEmptyView from 'components/Messaging/MessagingEmptyView';
import { Checkbox } from 'react-native-paper';
import { MetaData } from './ConversationsScreen';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { PopApi } from 'services';
import Toast from 'react-native-toast-message';
import ConversationSlice from 'features/Chats/ConversationSlice';
import ChatsSlice from 'features/Chats/ChatsSlice';
import { sbGetChannelByUrl } from 'services/sendbird/messaging';
import useAnalytics from 'util/analytics/useAnalytics';

const QUERY_SIZE = 30;

type TInviteModal =
  | {
      type: 'invite';
      channel: GroupChannel;
      close: () => void;
    }
  | {
      type: 'create';
      close: () => void;
      navigation: any;
    };

const MAX_USERS = 10;

const InviteModal = ({
  type,
  channel,
  close,
  navigation,
}: TInviteModal): React.ReactElement => {
  const analytics = useAnalytics();
  const [conversationQuery, setConversationQuery] =
    useState<GroupChannelListQuery>();
  const sb = SendBird.getInstance();
  const id = useSelector(getId);
  const token = useSelector((state) => getStoreToken(state));
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // this user's 1:1 matches
  const [uniqueUsers, setUniqueUsers] = useState<Member[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingCreation, setIsLoadingCreation] = useState(false);

  const renderUser = ({ item }: { item: Member }) => {
    const index = selectedUsers.findIndex((el) => el === item.userId);
    const { avatar, name } = item.metaData as MetaData;
    let avatarJs = undefined;
    if (avatar) {
      avatarJs = JSON.parse(avatar);
    }

    if (type === 'invite' && channel) {
      if (
        (channel as GroupChannel).members.find(
          (el) => el.userId === item.userId,
        )
      ) {
        return (
          <Pressable style={[styles.listItem, { opacity: 0.5 }]}>
            <Checkbox.Android
              uncheckedColor={colors.gray}
              disabled={true}
              status={'checked'}
            />
            <View style={styles.listTitle}>
              <CustomAvatar
                {...avatarJs}
                customAvatarContainerStyle={styles.avatar}
                scale={0.3}
              />
              <Paragraph>{item.nickname}</Paragraph>
            </View>
          </Pressable>
        ); // user already in gc
      }
    }

    const numUsers =
      channel && channel.members
        ? selectedUsers.length + channel.members.length - 1
        : selectedUsers.length;

    return (
      <Pressable
        style={styles.listItem}
        onPress={() => {
          if (index < 0) {
            setSelectedUsers((currentUsers) => [...currentUsers, item.userId]);
          } else {
            // const newUsers = selectedUsers.splice(index, 1);
            const newUsers = selectedUsers.filter((el) => el !== item.userId);
            setSelectedUsers(newUsers);
          }
        }}>
        <Checkbox.Android
          disabled={numUsers > MAX_USERS}
          uncheckedColor={colors.gray}
          status={index >= 0 ? 'checked' : 'unchecked'}
        />
        <View style={styles.listTitle}>
          <CustomAvatar
            {...avatarJs}
            customAvatarContainerStyle={styles.avatar}
            scale={0.3}
          />
          <Paragraph>{item.nickname}</Paragraph>
        </View>
      </Pressable>
    );
  };

  const getNextConversations = (query: GroupChannelListQuery) => {
    setIsLoadingMore(true);
    if (query && query.hasNext) {
      query.next((moreChannels) => {
        // console.log(moreChannels);
        const moreUniqueUsers = [] as Member[];
        for (let i = 0; i < moreChannels.length; i++) {
          if (
            moreChannels[i].customType !== 'group' &&
            moreChannels[i].customType !== 'event'
          ) {
            const user = moreChannels[i].members.find((el) => el.userId !== id);
            user && moreUniqueUsers.push(user);
          }
        }
        setUniqueUsers((currentUsers) => [...currentUsers, ...moreUniqueUsers]);
      });
    } else {
      setHasNext(false);
    }
    setIsLoadingMore(false);
    setHasNext(false);
  };

  // Reduces load
  // https://stackoverflow.com/questions/44743904/virtualizedlist-you-have-a-large-list-that-is-slow-to-update
  const memoizedValue = useMemo(() => renderUser, [selectedUsers]);

  useEffect(() => {
    const query = sb.GroupChannel.createMyGroupChannelListQuery();
    query.limit = QUERY_SIZE;
    query.includeEmpty = true;
    query.memberStateFilter = 'joined_only';
    query.order = 'latest_last_message';
    // TODO specify 1:1
    // query.customTypesFilter = [''];
    setConversationQuery(query);

    getNextConversations(query);
    return () => {
      if (conversationQuery) setConversationQuery(undefined);
    };
  }, []);

  const createGroup = () => {
    setIsLoadingCreation(true);
    PopApi.createGroup(
      {
        id,
        name: 'name',
        description: 'description',
        emoji: 'emoji',
        creator: id,
        members: [id, ...selectedUsers],
        location: {
          point: {
            type: 'Point',
            coordinates: [0, 0],
          },
          name: 'name',
          address: 'address',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res: any) => {
        if (res.error) {
          console.log(res.error);
          Toast.show({
            text1: 'Error creating channel',
            type: 'error',
            position: 'bottom',
          });
        } else {
          const url = res.response.data.data.chat.sendbirdId;
          analytics.logEvent(
            {
              name: 'CHATROOM CREATE',
              data: {
                chatId: url,
                members: [id, ...selectedUsers],
              },
            },
            true,
          );
          sbGetChannelByUrl(url).then((res) => {
            const otherUsers = res.members.filter(
              (member) => member.userId !== id,
            );

            // parse data for users
            const { userId, nickname, metaData } = otherUsers[0] as Member;
            const { avatar, name } = metaData as MetaData;

            let avatarJs = undefined;
            if (avatar) {
              avatarJs = JSON.parse(avatar);
            }

            const userArr = [] as Array<string>;
            for (let i = 0; i < otherUsers.length; i++) {
              // TODO parse names
              userArr.push(otherUsers[i].nickname);
            }

            // group display name
            let displayName = '';
            let i = 0;
            while (i < userArr.length && i < 1) {
              displayName += ` ${userArr[i]},`;
              i++;
            }
            if (i < userArr.length) {
              displayName += ` + ${userArr.length - i} more`;
            }
            dispatch(ConversationSlice.actions.setType(res.customType));
            dispatch(ConversationSlice.actions.setName(displayName));
            dispatch(ChatsSlice.actions.setCurrentChannel(res.url));
            Toast.show({
              text1: 'Created group channel',
              type: 'success',
              position: 'bottom',
            });
            close();
            navigation.navigate('MESSAGING_STACK', {
              screen: 'MESSAGING_SCREEN',
              params: {
                type: res.customType,
                avatar: avatarJs,
                userId,
                conversation: res,
                progress: 0,
                displayName,
                url,
              },
            });
          });
        }
      })
      .finally(() => {
        setIsLoadingCreation(false);
      });
  };

  const inviteUsers = () => {
    setIsLoadingCreation(true);
    if (channel) {
      if (channel.customType === 'group') {
        const channelData = JSON.parse((channel as GroupChannel).data);
        PopApi.groupInvite(
          channelData.groupId,
          {
            id,
            inviter: id,
            members: [...selectedUsers],
            type: 'invite',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((res) => {
            if (res.error) {
              Toast.show({
                text1: 'Error sending invites',
                type: 'error',
                position: 'bottom',
              });
            } else {
              close();
              Toast.show({
                text1: 'Invites sent!',
                type: 'success',
                position: 'bottom',
              });
              analytics.logEvent(
                {
                  name: 'CHATROOM INVITE',
                  data: {
                    chatId: channelData.url,
                    members: [...selectedUsers],
                  },
                },
                true,
              );
            }
          })
          .finally(() => {
            setIsLoadingCreation(false);
          });
      } else if (channel.customType === 'event') {
        const channelData = JSON.parse((channel as GroupChannel).data);
        PopApi.popInInvite(
          channelData.groupId,
          {
            id,
            inviter: id,
            members: [...selectedUsers],
            type: 'invite',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((res) => {
            if (res.error) {
              Toast.show({
                text1: 'Error sending invites',
                type: 'error',
                position: 'bottom',
              });
            } else {
              close();
              Toast.show({
                text1: 'Invites sent!',
                type: 'success',
                position: 'bottom',
              });
              analytics.logEvent(
                {
                  name: 'CHATROOM INVITE',
                  data: {
                    chatId: channelData.url,
                    members: [...selectedUsers],
                  },
                },
                true,
              );
            }
          })
          .finally(() => {
            setIsLoadingCreation(false);
          });
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.heading}>
        <Title2>{type === 'create' ? 'Create Group' : 'Invite Users'} </Title2>
        <ActionButton
          loading={isLoadingCreation}
          containerStyle={styles.actionButtonStyles}
          label="Go"
          onPress={() => {
            if (selectedUsers.length > 0) {
              type === 'create' ? createGroup() : inviteUsers();
            }
          }}
        />
      </View>
      <Paragraph style={styles.count} color={colors.darkgrey}>
        {channel && channel.members
          ? selectedUsers.length + channel.members.length - 1
          : selectedUsers.length}
        /{MAX_USERS}
      </Paragraph>
      <FlatList
        data={uniqueUsers}
        renderItem={memoizedValue}
        onEndReached={() => {
          conversationQuery?.hasNext
            ? getNextConversations(conversationQuery)
            : () => {};
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={<MessagingFooter isLoadingMore={isLoadingMore} />}
        ListEmptyComponent={
          isLoadingMore ? (
            <MessagingEmptyView />
          ) : (
            <MessagingEmptyView
              isMessageScreen={false}
              message="No matches available!"
            />
          )
        }
      />
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    padding: '1rem',
  },
  avatar: {
    padding: 20,
    marginHorizontal: '1rem',
  },
  heading: {
    marginTop: '1rem',
    // marginBottom: '1rem',
    marginHorizontal: '.5rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '.3rem',
  },
  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1rem',
  },
  count: {
    marginBottom: '1rem',
    marginHorizontal: '.5rem',
  },
  actionButtonStyles: {
    height: '2.5 rem',
    paddingHorizontal: '1 rem',
    marginRight: 0,
  },
});

export default InviteModal;
