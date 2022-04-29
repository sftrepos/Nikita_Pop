import { Title2, Title3 } from 'components/Text';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  Switch,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import ReportBlockModal from 'components/Modals/ReportModal/ReportBlockModal';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { showReportBlockModal } from 'features/User/UserActions';
import { GroupChannel, Member, User } from 'sendbird';
import { List } from 'react-native-paper';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import Toast from 'react-native-toast-message';
import { Paragraph } from 'components/Text';
import routes from 'nav/routes';
import store from 'store/index';
import { getId, getStoreToken } from 'util/selectors';
import { Alert } from 'react-native';
import { PopApi } from 'services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  _r: {
    padding: '1rem',
    r15: '1.5rem',
  },
  container: {
    flex: 1,
    // justifyContent: "flex-end",
    // backgroundColor: '$raspberry20',
    paddingVertical: '2rem',
    paddingHorizontal: '1rem',
  },
  contentContainer: {
    margin: '1rem',
  },
  menuOptionItemTouchable: {
    marginVertical: '.5rem',
  },
  menuOptionItem: {
    padding: '.5rem',
    height: '3rem',
    justifyContent: 'center',
  },
  menuOptionText: {
    // textAlign: 'center',
  },
  sideMenuStyle: {
    position: 'absolute',
    top: -20,
    marginRight: 0,
    marginBottom: 0,
    alignSelf: 'flex-end',
    height: Dimensions.get('window').height,
    width: '70%',
  },
  menuTitle: {
    marginVertical: '.5rem',
    textAlign: 'left',
  },
  menuOption: {
    height: '3rem',
    padding: '.5rem',
    justifyContent: 'center',
  },
  menuSection: {
    padding: '.5rem',
    marginTop: '.5rem',
  },
  menuHeading: {
    fontSize: '1.1rem',
  },
  menuHeadingBold: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  list: {},
  avatar: {
    padding: 0,
    height: 50,
    width: 50,
  },
  hostIcon: {
    alignSelf: 'center',
    marginHorizontal: '.2rem',
  },
});

interface ISideMenu {
  visible: boolean;
  toggleSideMenu: () => void;
  toggleInviteModal: () => void;
  conversation: GroupChannel;
  onPressUser?: (user: Member) => void;
  navigation: any;
}

const MessagesScreenSideMenu = ({
  visible,
  toggleSideMenu,
  conversation,
  onPressUser,
  navigation,
  toggleInviteModal,
}: // toggleInviteModal,
ISideMenu): ReactElement => {
  const { colors } = useTheme();

  const id = getId(store.getState());
  const token = getStoreToken(store.getState());
  const insets = useSafeAreaInsets();
  const displayName = useSelector((state) => state.conversation.name);
  const [muted, setMuted] = useState(false);
  const [memberList, setMemberList] = useState<Array<Member>>([]);
  const [thisUser, setThisUser] = useState<Member>();
  const [group, setGroup] = useState();

  const analytics = useAnalytics();

  useEffect(() => {
    if (conversation) {
      const memberArr = conversation.members;
      const meIndex = memberArr.findIndex((el) => el.userId === id);
      if (meIndex > -1) {
        const me = memberArr[meIndex];
        setThisUser(me);
        setMemberList(memberArr);
      }

      if (conversation.customType === 'group') {
        const channelData = JSON.parse((conversation as GroupChannel).data);
        PopApi.getGroup(channelData.groupId, {
          params: {
            id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          if (res.error) {
            Toast.show({
              text1: 'Error getting group',
              type: 'error',
              position: 'bottom',
            });
          } else {
            setGroup(res.response.data.data);
          }
        });
      }

      conversation.getMyPushTriggerOption().then((res) => {
        if (res === 'default') {
          setMuted(false);
        } else {
          setMuted(true);
        }
      });
    }
  }, [conversation.members]);

  const leaveChannel = (removeId: string) => {
    if (conversation) {
      Alert.alert('Are you sure you want to leave?', '', [
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            toggleSideMenu();
            const channelData = JSON.parse((conversation as GroupChannel).data);
            PopApi.groupLeave(
              channelData.groupId,
              {
                params: {
                  id,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
              removeId,
            ).then((res) => {
              if (res.error) {
                Toast.show({
                  text1: 'Error leaving channel',
                  type: 'error',
                  position: 'bottom',
                });
                console.log(
                  'MessagesScreenSideMenu: failed to leave channel',
                  res.error,
                );
              } else {
                Toast.show({
                  text1: 'Success leaving channel',
                  type: 'success',
                  position: 'bottom',
                });
                navigation.navigate(routes.CHATS_SCREEN);
                console.log(
                  'MessagesScreenSideMenu: succeeded to leave channel',
                  res.response,
                );
                analytics.logEvent(
                  {
                    name: 'CHATROOM LEAVE',
                    data: { chatId: conversation.url },
                  },
                  true,
                );
              }
            });
          },
        },
      ]);
    }
  };

  const deleteChannel = () => {
    if (conversation) {
      Alert.alert('Are you sure you want to delete this channel?', '', [
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            toggleSideMenu();
            const channelData = JSON.parse((conversation as GroupChannel).data);
            PopApi.deleteGroup(channelData.groupId, {
              params: {
                id,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => {
              if (res.error) {
                Toast.show({
                  text1: 'Error deleting channel',
                  type: 'error',
                  position: 'bottom',
                });
              } else {
                Toast.show({
                  text1: 'Success deleting channel',
                  type: 'success',
                  position: 'bottom',
                });
                navigation.navigate(routes.CHATS_SCREEN);
              }
            });
          },
        },
      ]);
    }
  };

  const muteChannel = async () => {
    if (conversation) {
      if (muted) {
        try {
          const response = await conversation.setMyPushTriggerOption('all');
          setMuted(false);
          analytics.logEvent(
            {
              name: 'CHATROOM UNMUTE NOTIFICATION',
              data: { chatId: conversation.url },
            },
            true,
          );
        } catch (error) {
          Toast.show({
            text1: 'Error unmuting channel',
            type: 'error',
            position: 'bottom',
          });
        }
      } else {
        try {
          const response = await conversation.setMyPushTriggerOption('off');
          setMuted(true);
          analytics.logEvent(
            {
              name: 'CHATROOM MUTE NOTIFICATION',
              data: { chatId: conversation.url },
            },
            true,
          );
        } catch (error) {
          Toast.show({
            text1: 'Error muting channel',
            type: 'error',
            position: 'bottom',
          });
        }
      }
    } else {
      Toast.show({
        text1: 'Error fetching channel',
        type: 'error',
        position: 'bottom',
      });
    }
  };

  // render a participant in participant list
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
        onPress={() => {
          if (onPressUser) {
            onPressUser(item);
          }
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
        right={() => {
          if (group && group.creator === userId) {
            // if host
            return (
              <Icon
                style={styles.hostIcon}
                name={'crown'}
                size={styles._r.r15}
                color={colors.mango}
              />
            );
          } else {
            return <></>;
          }
        }}
      />
    );
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={toggleSideMenu} // Android back press
      onBackButtonPress={toggleSideMenu}
      onSwipeComplete={toggleSideMenu} // Swipe to discard
      animationIn="slideInRight"
      animationOut="slideOutRight"
      swipeDirection="right"
      useNativeDriver // Faster animation
      hideModalContentWhileAnimating // Better performance, try with/without
      propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
      style={[styles.sideMenuStyle]}>
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            paddingTop: insets.top,
          },
        ]}>
        <Title2 style={styles.menuTitle}>{displayName}</Title2>
        <View
          style={[
            styles.menuOption,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <Paragraph style={styles.menuHeading}>Mute Channel</Paragraph>
          <Switch
            trackColor={{ false: 'lightgray', true: colors.primary }}
            ios_backgroundColor="lightgray"
            onValueChange={muteChannel}
            value={muted}
          />
        </View>
        <Pressable style={[styles.menuOption]} onPress={toggleInviteModal}>
          <Paragraph style={[styles.menuHeading]}>Invite</Paragraph>
        </Pressable>
        <Pressable
          style={[styles.menuOption]}
          onPress={() => {
            if (group) {
              leaveChannel(id);
            }
          }}>
          <Paragraph style={[styles.menuHeadingBold, { color: 'red' }]}>
            {'Leave'}
          </Paragraph>
        </Pressable>
        <View style={[styles.menuSection]}>
          <Paragraph style={[styles.menuHeadingBold, { marginBottom: 5 }]}>
            Participants
          </Paragraph>
          {thisUser && renderUser(thisUser)}
          {memberList.map((item) => item.userId !== id && renderUser(item))}
        </View>
      </ScrollView>
    </Modal>
  );
};

export default MessagesScreenSideMenu;
