import React, { ReactElement } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Paragraph, Title3 } from 'components/Text';
import { Theme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import { ChatsScreenNavigationProp } from 'nav/types';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';

export interface ConversationRowProps {
  onPress: () => void;
  theme: Theme;
  toggleRead: () => void;
  isRead: boolean;
  hideChat: () => void;
  type: string;
  blockChat: () => void;
  isHidden: boolean;
  isBlocked: boolean;
  isSwipeEnabled: boolean;
  message: string;
  chatId: string;
  otherUserId: string;
  newMessage: boolean;
  timeStamp: typeof Date;
  navigation: ChatsScreenNavigationProp;
  userData: any;
  progress: number;
}

const styles = EStyleSheet.create({
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1 rem',
    borderBottomWidth: EStyleSheet.hairlineWidth,
    borderColor: '$grey4',
  },
  containerTimeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerCenter: {
    flex: 2,
    paddingLeft: '1 rem',
  },
  shimmerAvatar: {
    height: '5 rem',
    width: '5 rem',
    borderRadius: 50,
  },
  shimmerCenter: {},
  shimmerCenterTitle: {
    height: '2 rem',
    marginBottom: '0.5 rem',
  },
  shimmerRight: {
    width: '1.5 rem',
    alignSelf: 'flex-start',
    marginTop: '1 rem',
  },
  containerShimmerCenter: {
    marginLeft: '1 rem',
  },
  newMessage: {
    height: '0.5 rem',
    width: '0.5 rem',
    borderRadius: 25,
    marginRight: '0.5 rem',
  },
});

const ConversationRow = ({
  onPress,
  theme,
  message,
  toggleRead,
  isRead,
  hideChat,
  type,
  blockChat,
  isHidden,
  isBlocked,
  isSwipeEnabled,
  navigation,
  timeStamp,
  newMessage,
  otherUserId,
  userData,
  progress,
}: ConversationRowProps): ReactElement => {
  const { colors } = theme;
  // const users = useSelector<RootReducer>((state) => state.user.users);
  // const [otherUser, setOtherUser] = useState(
  //   useSelector<RootReducer>((state) => state.user.users?.[otherUserId]),
  // );
  // const dispatch = useDispatch();

  // const getCachedUserData = async () => {
  //   const data = await AsyncStorage.getItem(`user-${otherUserId}`);
  //   return data;
  // };

  // if (!otherUser) {
  //   getCachedUserData().then((str) => {
  //
  //     if (str) {
  //       setOtherUser(JSON.parse(str));
  //
  //     } else {
  //       dispatch(getUsers([otherUserId]));
  //     }
  //     return str;
  //   });
  // }

  // useEffect(() => {
  //   if (otherUser)
  //     AsyncStorage.setItem(`user-${otherUserId}`, JSON.stringify(otherUser));
  // }, [otherUser]);

  // useEffect(() => {
  //   if (users[otherUserId]) setOtherUser(users[otherUserId]);
  // }, [users]);

  const handleOnPress = () => {
    onPress();
  };

  const parseTimeStamp = moment(timeStamp).isSame(moment(), 'day')
    ? moment(timeStamp).format('h:mm a')
    : moment(timeStamp).format('M/DD');

  const renderLeft = () => (
    <View>
      <CustomAvatar {...userData.avatar} scale={0.35} />
    </View>
  );

  const renderCenter = () => (
    <View style={styles.containerCenter}>
      <Title3 color={theme.colors.text}>
        {progress >= 2 / 3 ? userData.name : userData.username}
      </Title3>
      <Paragraph numberOfLines={2} color={theme.colors.text}>
        {message}
      </Paragraph>
    </View>
  );

  const renderRight = () => (
    <View style={[styles.containerTimeStamp]}>
      {newMessage && (
        <View
          style={[styles.newMessage, { backgroundColor: colors.primary }]}
        />
      )}
      <Paragraph color={theme.colors.text}>{parseTimeStamp}</Paragraph>
    </View>
  );

  return (
    <Pressable onPress={handleOnPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.listItem,
            {
              backgroundColor: pressed
                ? theme.colors.border
                : theme.colors.card,
            },
          ]}>
          {userData ? (
            <>
              {renderLeft()}
              {renderCenter()}
              {renderRight()}
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ShimmerPlaceHolder autoRun style={styles.shimmerAvatar} />
                <View style={styles.containerShimmerCenter}>
                  <ShimmerPlaceHolder
                    autoRun
                    style={styles.shimmerCenterTitle}
                  />
                  <ShimmerPlaceHolder autoRun style={styles.shimmerCenter} />
                </View>
              </View>
              <ShimmerPlaceHolder autoRun style={styles.shimmerRight} />
            </>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default ConversationRow;
