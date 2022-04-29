import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Platform,
  PermissionsAndroid,
  FlatList,
  Pressable,
  Linking,
  View,
} from 'react-native';
import { Paragraph, Title2, Title3 } from 'components/Text';
import SendBird, {
  GroupChannelListQuery,
  GroupChannel,
  Member,
} from 'sendbird';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getId, getStoreToken } from 'util/selectors';
import MessagingEmptyView from 'components/Messaging/MessagingEmptyView';
import { MetaData } from './ConversationsScreen';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { PopApi } from 'services';
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';
import ContactAvatar from 'components/ContactAvatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivityIndicator from 'components/ActivityIndicator';

const QUERY_SIZE = 5;

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

type TContact = {
  name: string;
  phoneNumber: string;
};

const MAX_USERS = 10;

const InvitePopInScreen = ({
  type,
  channel,
  close,
  navigation,
}: TInviteModal): React.ReactElement => {
  const [conversationQuery, setConversationQuery] =
    useState<GroupChannelListQuery>();
  const sb = SendBird.getInstance();
  const id = useSelector(getId);
  const token = useSelector((state) => getStoreToken(state));
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // this user's 1:1 matches
  const [uniqueUsers, setUniqueUsers] = useState<Member[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingCreation, setIsLoadingCreation] = useState(false);
  const [hasContactPermission, setHasContactPermission] = useState(false);
  const [contactNames, setContactNames] = useState<string[]>([]);
  const inviteLink = useSelector((state) => state.chats.inviteLink);

  const renderUser = ({ item }: { item: Member }) => {
    const { avatar, name } = item.metaData as MetaData;
    let avatarJs = undefined;
    if (avatar) {
      avatarJs = JSON.parse(avatar);
    }

    if (channel) {
      if (
        (channel as GroupChannel).members.find(
          (el) => el.userId !== item.userId,
        )
      ) {
        return (
          <Pressable style={[styles.listItem, { opacity: 1 }]}>
            <View style={styles.listTitle}>
              <CustomAvatar
                {...avatarJs}
                customAvatarContainerStyle={styles.avatar}
                scale={0.3}
              />
              <Paragraph style={styles.userName}>{item.nickname}</Paragraph>
            </View>
            <ActionButton
       //loading={isLoadingCreation}
              containerStyle={styles.actionButtonStyles}
              label="Send"
              onPress={() => {
                inviteUser(item.userId);
              }}
            />
          </Pressable>
        ); // user already in gc
      }
    }
    return <Paragraph>No Message History with any Users</Paragraph>;
  };

  const getNextConversations = (query: GroupChannelListQuery) => {
    //console.log('getNextConversations - start - ', query, query.hasNext);
    if (query && query.hasNext) {
      setIsLoadingMore(true);
      query
        .next((moreChannels) => {
          //console.log('getNextConversations - moreChannels - ', moreChannels);
          const moreUniqueUsers = [] as Member[];
          const moreUniqueUserId = getCurrentChannelMembers();
          for (let i = 0; i < moreChannels.length; i++) {
            if (
              !channel.isIdentical(moreChannels[i]) &&
              moreChannels[i].customType !== 'group' &&
              moreChannels[i].customType !== 'event'
            ) {
              const user = moreChannels[i].members.find(
                (el) => el.userId !== id,
              );
              if (user && !moreUniqueUserId.includes(user.userId)) {
                moreUniqueUsers.push(user);
                moreUniqueUserId.push(user.userId);
              }
            }
          }
          const updatedUsers = [...uniqueUsers, ...moreUniqueUsers];
          if (moreUniqueUsers.length == 0 && query.hasNext) {
            // call this funciton again if the query didn't have any *unique users
            getNextConversations(query);
          } else {
            setUniqueUsers(updatedUsers);
            setIsLoadingMore(false);
            setHasNext(query.hasNext);
          }
        })
        .finally(() => {});
    }
  };

  // Reduces load
  // https://stackoverflow.com/questions/44743904/virtualizedlist-you-have-a-large-list-that-is-slow-to-update
  const memoizedValue = useMemo(() => renderUser, [uniqueUsers]);

  const getCurrentChannelMembers = () => {
    const currentMemberArray: string[] = [];
    for (let i = 0; i < channel.members.length; i++) {
      currentMemberArray.push(channel.members[i]['userId']);
    }
    return currentMemberArray;
  };

  useEffect(() => {
    getCurrentChannelMembers();
    const query = sb.GroupChannel.createMyGroupChannelListQuery();
    query.limit = QUERY_SIZE;
    query.includeEmpty = true;
    query.memberStateFilter = 'joined_only';
    query.order = 'latest_last_message';
    // TODO specify 1:1
    // query.customTypesFilter = [''];
    setConversationQuery(query);

    getNextConversations(query);
    checkUserContacts();
    return () => {
      if (conversationQuery) setConversationQuery(undefined);
    };
  }, []);

  const removeInvitedUser = (invitedUserId) => {
    const removedList = _.filter(
      uniqueUsers,
      (item) => item.userId != invitedUserId,
    );
    setUniqueUsers(removedList);
  };

  const inviteUser = (userId: string) => {
    setIsLoadingCreation(true);
    if (channel) {
      if (channel.customType === 'group') {
        const channelData = JSON.parse((channel as GroupChannel).data);
        //   console.log(channelData);
        PopApi.groupInvite(
          channelData.groupId,
          {
            id,
            inviter: id,
            members: [userId],
            type: 'invite',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((res) => {
            //console.log(res);
            if (res.error) {
              Toast.show({
                text1: 'Error sending invites',
                type: 'error',
                position: 'bottom',
              });
            } else {
              //close();
              removeInvitedUser(userId);
              Toast.show({
                text1: 'Invites sent!',
                type: 'success',
                position: 'bottom',
              });
            }
          })
          .finally(() => {
            setIsLoadingCreation(false);
          });
      } else if (channel.customType === 'event') {
        const channelData = JSON.parse((channel as GroupChannel).data);
        //   console.log(channelData);
        PopApi.popInInvite(
          channelData.groupId,
          {
            id,
            inviter: id,
            members: [userId],
            type: 'invite',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((res) => {
            //console.log(res);
            if (res.error) {
              Toast.show({
                text1: 'Error sending invites',
                type: 'error',
                position: 'bottom',
              });
            } else {
              //close();
              removeInvitedUser(userId);
              Toast.show({
                text1: 'Invites sent!',
                type: 'success',
                position: 'bottom',
              });
            }
          })
          .finally(() => {
            setIsLoadingCreation(false);
          });
      }
    }
  };

  const setUserContacts = () => {
    setHasContactPermission(true);
    //console.log('setUserContacts');
    Contacts.getAll().then((contacts) => {
      // contacts returned
      const userContactArray: TContact[] = [];
      for (const i in contacts) {
        const contact = contacts[i];
        const contactName = `${contact['givenName']} ${contact['familyName']}`;
        //console.log('InvitePopInScreen - contacts - authorized', contact);

        const phoneNumbers = contacts[i]['phoneNumbers'];
        const mobileNumber = 'null';
        for (const k in phoneNumbers) {
          if ('number' in phoneNumbers[k])
            mobileNumber = phoneNumbers[k]['number'];
        }
        const new_contact: TContact = {
          name: contactName,
          phoneNumber: mobileNumber,
          //phoneNumber: '1231231234',
        };
        userContactArray.push(new_contact);
      }
      setContactNames(userContactArray);
    });
  };

  const checkUserContacts = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ).then((granted) => {
        //console.log('InvitePopInScreen - contacts - check ', granted);
        if (granted) {
          //console.log('InvitePopInScreen - contacts - check - authorized');
          setUserContacts();
        } else {
          //console.log('InvitePopInScreen - contacts - check - denied');
        }
      });
    } else {
      Contacts.checkPermission().then((permission) => {
        //console.log('checkUserContacts - checkpermission', permission);
        if (permission === 'authorized') {
          setUserContacts();
        }
      });
    }
  };

  const askDeviceContactsPermission = () => {
    //console.log('InvitePopInScreen - askDeviceContactsPermission - requested');
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Pop” Would Like to Access Your Contacts',
        message:
          'This lets you invite your friends to Pop-Ins. Only anonymized information is uploaded to our servers.',
        buttonNegative: "Don't Allow",
        buttonPositive: 'OK',
      }).then((granted) => {
        //setUserContacts();
        //console.log('InvitePopInScreen - contacts - then ', granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log('InvitePopInScreen - contacts - authorized');
          setUserContacts();
        } else {
          //console.log('InvitePopInScreen - contacts - denied');
        }
      });
    } else {
      Contacts.checkPermission().then((permission) => {
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === 'undefined') {
          Contacts.requestPermission().then((permission) => {
            setUserContacts();
          });
        }
        if (permission === 'authorized') {
          setUserContacts();
        }
        if (permission === 'denied') {
          // can't re-request permission if user denied once
          // best we can do is to ask them with instructions to go to ios settings
          //console.log('InvitePopInScreen - contacts - denied');
        }
      });
    }
  };

  const renderContactNameRow = ({
    item,
    index,
  }: {
    item: TContact;
    index: number;
  }) => {
    //console.log('renderContactNameRow', contactNames, item);
    const nameSplit = item.name.split(' ');
    let nameInitial = '';
    if (nameSplit.length >= 2) {
      nameInitial += nameSplit[0].charAt(0);
      nameInitial += nameSplit[nameSplit.length - 1].charAt(0);
    } else if (nameSplit.length > 1) {
      nameInitial += nameSplit[0].charAt(0);
    }
    let avatarJs = undefined;
    if (false) {
      avatarJs = JSON.parse(avatar);
    }
    return (
      <Pressable style={[styles.listItem, { opacity: 1 }]}>
        <View style={styles.listTitle}>
          <ContactAvatar
            containerStyle={styles.contactAvatar}
            index={index}
            text={nameInitial}
          />
          <Paragraph style={styles.userName}>{item.name}</Paragraph>
        </View>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          label="Invite"
          onPress={() => {
            //const delim = Platform.OS === 'ios' ? '&' : '?';
            const message = (
              'Check out this Pop-In I’m heading to! Wanna come with? \n \n' +
              inviteLink
            ).replace(/['"]+/g, '');
            const linkURL =
              Platform.OS === 'android'
                ? `sms:${item.phoneNumber}?body=${message}`
                : `sms:${item.phoneNumber}&body=${message}`;
            Linking.openURL(linkURL);
          }}
        />
      </Pressable>
    );
  };

  const memoizedContactNameView = useMemo(
    () => renderContactNameRow,
    [contactNames],
  );

  const renderContactEmptyScreen = () => {
    if (isLoadingMore) {
      return <ActivityIndicator />;
    } else if (hasContactPermission) {
      return (
        <>
          <Paragraph color={colors.gray} style={styles.contactsParagraph}>
            Already invited all of your friends in the contact list!
          </Paragraph>
        </>
      );
    } else {
      return (
        <>
          <Paragraph color={colors.gray} style={styles.contactsParagraph}>
            The more people who join Pop, the merrier Pop-Ins become! So invite
            your friends to bring more activities around you 😃
          </Paragraph>
          <View style={styles.contactsContainer}>
            <Paragraph color={colors.gray} style={styles.contactsParagraph}>
              Invite contacts from your phone’s contact list?
            </Paragraph>
            <ActionButton
              //loading={isLoadingCreation}
              containerStyle={styles.syncButton}
              label="Sync"
              onPress={askDeviceContactsPermission}
            />
          </View>
        </>
      );
    }
  };

  const renderUserContact = () => {
    return (
      <>
        <Title3 color={colors.darkgrey} style={styles.heading}>
          Your Phone Contacts
        </Title3>
        <FlatList
          style={styles.listContainer}
          scrollEnabled={false}
          data={contactNames}
          renderItem={memoizedContactNameView}
          ListEmptyComponent={renderContactEmptyScreen()}
        />
      </>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.headingContainer}>
        <View style={{ flex: 1 }} />
        <Title2 style={{ flex: 2 }}>Invite to Pop-In</Title2>
        <View style={{ flex: 1 }}>
          <Icon
            style={{
              alignSelf: 'flex-end',
            }}
            onPress={close}
            name="close"
            size={styles._c.r}
            color={colors.text}
          />
        </View>
      </View>
      <Title3 color={colors.darkgrey} style={styles.heading}>
        Pop Connections
      </Title3>
      <FlatList
        style={styles.listContainer}
        data={uniqueUsers}
        scrollEnabled={false}
        renderItem={memoizedValue}
        // this onEndReached will cause "More" button to appear and disappear
        // if user has a small list of users on initial load
        //onEndReached={() => {
        //  hasNext ? getNextConversations(conversationQuery) : () => {};
        //}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoadingMore ? (
            <MessagingEmptyView />
          ) : (
            <MessagingEmptyView
              isMessageScreen={false}
              textStyle={{ color: colors.gray }}
              message="Already invited all of your friends!"
            />
          )
        }
      />
      {!isLoadingMore && hasNext && (
        <ActionButton
          //loading={isLoadingCreation}
          containerStyle={[styles.syncButton, { marginVertical: 10 }]}
          borderColor={colors.primary}
          textStyle={{ color: colors.primary }}
          textGradient
          label="More"
          type="outline"
          onPress={() => {
            hasNext ? getNextConversations(conversationQuery) : () => {};
          }}
        />
      )}
      {renderUserContact()}
    </View>
  );
};

const styles = EStyleSheet.create({
  _c: {
    r: '1.5rem',
  },
  container: {
    padding: '1rem',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
  },
  avatar: {
    padding: 20,
    marginRight: '1rem',
  },
  headingContainer: {
    marginVertical: '1rem',
    marginHorizontal: '.5rem',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  heading: {
    marginVertical: '1rem',
    marginHorizontal: '.5rem',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '.3rem',
    paddingHorizontal: '1rem',
    justifyContent: 'space-between',
  },
  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1rem',
    //width: '100%',
  },
  count: {
    marginBottom: '1rem',
    marginHorizontal: '.5rem',
  },
  actionButtonStyles: {
    borderRadius: 10,
    height: '2.5 rem',
    paddingHorizontal: '1 rem',
    marginRight: 0,
    justifyContent: 'flex-end',
    //alignSelf: 'flex-end',
  },
  contactsContainer: {
    padding: '1rem',
    alignItems: 'center',
  },
  syncButton: {
    width: '5.5rem',
    height: '2.5rem',
    borderRadius: 10,
  },
  contactsParagraph: {
    padding: '1rem',
    alignSelf: 'center',
  },
  contactAvatar: {
    marginRight: '1rem',
  },
  userName: {
    maxWidth: '70%',
  },
});

export default InvitePopInScreen;
