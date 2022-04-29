import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Title2 } from 'components/Text';
import { Paragraph } from 'components/Text';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GroupChannel, Member } from 'sendbird';
import { useSelector } from 'react-redux';
import { getId, getStoreToken } from 'util/selectors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { List } from 'react-native-paper';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import { ScrollView } from 'react-native-gesture-handler';
import useAnalytics from 'util/analytics/useAnalytics';

type TViewMembersModal = {
  channel: GroupChannel;
  close: () => void;
  onPressUser?: (user: Member) => void;
  group: any;
};

const ViewMembersModal = ({
  channel,
  close,
  onPressUser,
  group,
}: TViewMembersModal) => {
  const { colors } = useTheme();
  const [memberList, setMemberList] = useState<Array<Member>>([]);
  const [thisUser, setThisUser] = useState<Member>();

  const id = useSelector(getId);
  const token = useSelector((state) => getStoreToken(state));
  const analytics = useAnalytics();
  useEffect(() => {
    if (channel) {
      const memberArr = channel.members;
      const meIndex = memberArr.findIndex((el) => el.userId === id);
      if (meIndex > -1) {
        const me = memberArr[meIndex];
        setThisUser(me);
        setMemberList(memberArr);
      }
    }
  }, [channel.members]);

  const onPressReport = () => {
    console.log('report');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.modalStyle, { backgroundColor: colors.card }]}>
        {/* <View style={styles.containerStyle}> */}
        <Title2 style={styles.titleStyle} color={colors.black}>
          Pop-In Members
        </Title2>
        {memberList.length > 1 ? (
          <ScrollView style={{ paddingHorizontal: 24 }}>
            <RenderUser
              item={memberList.filter((el) => el.userId == group.creator)[0]}
              onPressUser={onPressUser}
              group={group}
            />
            {memberList.map((item) =>
              item.userId != group.creator ? (
                <RenderUser
                  item={item}
                  onPressUser={onPressUser}
                  group={group}
                />
              ) : null,
            )}
          </ScrollView>
        ) : (
          <View
            style={{
              marginVertical: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Paragraph color={colors.darkgrey}>
              It's just you! Why not try inviting someone?
            </Paragraph>
          </View>
        )}
      </View>
      <Pressable
        style={{ height: Dimensions.get('screen').height }}
        onPress={close}
      />
    </View>
  );
};

type TRenderUser = {
  item: Member;
  onPressUser?: (user: Member) => void;
  group: any;
};

// render a participant in participant list
const RenderUser = ({ item, onPressUser, group }: TRenderUser) => {
  const { userId, nickname, metaData } = item as Member;
  const { avatar, name } = metaData as MetaData;
  const { colors } = useTheme();

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

const styles = EStyleSheet.create({
  _r: {
    padding: '1rem',
    r15: '1.5rem',
  },
  modal: {
    margin: '1rem',
    maxHeight: Dimensions.get('screen').height * 0.6,
    borderRadius: 25,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    margin: '1rem',
    maxHeight: Dimensions.get('screen').height * 0.6,
    paddingVertical: '1.5rem',
    paddingHorizontal: '.1rem',
    borderRadius: 25,
    flex: 1,
  },
  titleStyle: {
    paddingHorizontal: '.5rem',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '$grey2',
    marginBottom: '.5rem',
  },
  avatar: {
    padding: 0,
    height: 50,
    width: 50,
  },
  icon: {
    alignSelf: 'center',
    marginTop: '1.5rem',
  },
  hostIcon: {
    alignSelf: 'center',
    marginHorizontal: '.2rem',
  },
});

export default ViewMembersModal;
