import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../Text';
import ActionButton from 'components/Buttons/ActionButton';
import GroupIcon from '../../../assets/MapImage/Avatar.png';
import SendBird, { SendBirdInstance, GroupChannel } from 'sendbird';
import { sbPopInFindChannel } from 'services/sendbird/messaging';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import { getId, getStoreToken } from 'util/selectors';
import store from 'store/index';
import { PopApi } from 'services/api';
import { Modalize } from 'react-native-modalize';
import ProfileCard from 'components/ProfileCard';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { JoinPopIn, JoinPopInParams } from 'services/types';
import PopInSlice from 'features/Chats/PopInSlice';
import { checkLocationPermission } from 'util/locationPermission';
import LocationEnableModal from 'components/MapModals/LocationEnableModal';
import useAnalytics from 'util/analytics/useAnalytics';
interface IProfileModal {
  otherUser: any;
  onClose?: () => void;
}

type UserDetailsModalProps = {
  //isVisible: boolean;
  navigation: any;
  onClose: () => void;
  onViewDetails: (
    data: IEventData,
    location: ICurrentLocation,
    onPressGoToChat: (setIsProcessing: () => void, navigation: any) => void,
    onPressJoin: (setIsProcessing: () => void, navigation: any) => void,
  ) => void;
  data: IEventData;
  location: ICurrentLocation;
};

const PopInDetailsModal: React.FC<UserDetailsModalProps> = (
  props,
  { navigation },
) => {
  return (
    <View style={styles.MainContainer}>
      <View style={{ flex: 0.6 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={props.onClose}></TouchableOpacity>
      </View>
      <View
        style={{
          flex: 0.4,
          backgroundColor: '#fff',
          padding: 20,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <EventDetailsScreen
          navigation={props.navigation}
          data={props.data}
          location={props.location}
          onClose={props.onClose}
          onViewDetails={props.onViewDetails}
        />
      </View>
      <View style={{ flex: 0.1 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={props.onClose}></TouchableOpacity>
      </View>
    </View>
  );
};
interface ICurrentLocation {
  lat: number;
  long: number;
}

interface IUserDetailsScreen {
  onClose: () => void;
  navigation: any;
  data: IEventData;
  location: ICurrentLocation;
  onViewDetails: (data, location, onPressJoin, onPressGoToChat) => void;
}

interface IEventData {
  _id: string;
  name: string;
  description: string;
  creator: string;
  members: [string];
  emoji: string;
  tags: [string];
  location: {
    point: {
      type: string;
      coordinates: [number];
    };
    name: string;
    address: string;
  };
  chat: {
    sendbirdId: string;
  };
  isPrivate: boolean;
  capacity: number;
}

const EventDetailsScreen = React.memo((props: IUserDetailsScreen) => {
  const { data, onViewDetails, location, navigation, eventDetailsModalRef } =
    props;
  const { colors } = useTheme();
  const [members, setMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otherUser, setOtherUser] = useState('');
  const [isLocationModallVisible, setIsLocationModalVisible] = useState(false);
  const [isLocationPermitted, setIsLocationPermitted] = useState(false);

  const id = getId(store.getState());

  const profileModalRef = useRef<Modalize>(null);
  const contentRef = useRef<ScrollView>(null);
  const analytics = useAnalytics();

  const dispatch = useDispatch();

  // Rendering members in the event
  useEffect(() => {
    const sb = SendBird.getInstance();
    sendbirdListen(sb);
    if (!isLocationPermitted) {
    }
    checkLocationPermission().then((res) => {
      if (res == true) {
        setIsLocationPermitted(true);
      } else {
        setIsLocationPermitted(false);
      }
    });
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (state: any) => {
    if (isLocationPermitted == false) {
      checkLocationPermission().then((res) => {
        if (res == true) {
          setIsLocationPermitted(true);
        } else {
          setIsLocationPermitted(false);
        }
      });
    }
  };

  const renderMember = () => {
    try {
      return members.map((item, i) => {
        if (i < 5) {
          const { avatar } = item.metaData;
          if (avatar != undefined) {
            const avatarJs = JSON.parse(avatar);

            return (
              <Pressable style={{ zIndex: 0.1 }}>
                <CustomAvatar
                  scale={0.15}
                  {...avatarJs}
                  customAvatarContainerStyle={{ padding: 0, margin: 0 }}
                />
              </Pressable>
            );
          } else {
            return (
              <Image
                key={i}
                source={GroupIcon}
                style={{ width: 35, height: 35 }}
              />
            );
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const openProfileModal = () => {
    profileModalRef.current?.open();
    Keyboard.dismiss();
  };

  const sendbirdListen = (sb: SendBirdInstance) => {
    sbPopInFindChannel(data.chat.sendbirdId).then((channel: GroupChannel) => {
      setMembers(channel.members);
    });
  };

  const ProfileModal = ({ otherUser, onClose }: IProfileModal) => {
    const { colors } = useTheme();

    return (
      <View>
        <ProfileCard
          style={{
            height: '100%',
            backgroundColor: colors.card,
            // borderRadius: 25,
          }}
          showBack
          otherUserId={otherUser}
          onBack={() => {
            onClose && onClose();
          }}
          {...otherUser}
          wide
          //   progress={chat?.progress}
        />
      </View>
    );
  };

  const handleGoToChat = async () => {
    try {
      analytics.logEvent(
        {
          name: 'POP-IN GO TO CHAT',
          data: { popInId: data._id },
        },
        true,
      );
      dispatch(PopInSlice.actions.setName(data.name));
      dispatch(PopInSlice.actions.setDescription(data.description));
      dispatch(PopInSlice.actions.setEmoji(data.emoji));
      dispatch(
        PopInSlice.actions.setLatitude(data.location.point.coordinates[1]),
      );
      dispatch(
        PopInSlice.actions.setLongitude(data.location.point.coordinates[0]),
      );
      dispatch(PopInSlice.actions.setSendbirdId(data.chat.sendbirdId));

      const messagingParams = {
        type: 'event',
        userId: id,
        progress: 0,
        displayName: data.name,
        url: data.chat.sendbirdId,
      };

      navigation.navigate('MESSAGING_STACK', {
        screen: 'MESSAGING_SCREEN',
        params: messagingParams,
      });

      return false;
    } catch (err) {
      Toast.show({
        text1: 'Error navigating to chat',
        type: 'error',
        position: 'bottom',
      });
      return false;
    }
  };

  const handleJoin = async () => {
    return new Promise((resolve, reject) => {
      analytics.logEvent(
        {
          name: 'POP-IN JOIN',
          data: { popInId: data._id },
        },
        true,
      );
      const token = getStoreToken(store.getState());
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const params: JoinPopInParams = {
        popInId: data._id,
      };
      const body: JoinPopIn = {
        id,
        type: 'join',
        members: [id],
      };

      PopApi.joinPopIn(params, body, headers)
        .then((res) => {
          if (res.response) {
            console.log('Join======', res?.response?.data?.data);

            dispatch(PopInSlice.actions.setName(res.response.data.data.name));
            dispatch(
              PopInSlice.actions.setDescription(
                res.response.data.data.description,
              ),
            );
            dispatch(PopInSlice.actions.setEmoji(res.response.data.data.emoji));
            dispatch(
              PopInSlice.actions.setLatitude(
                res.response.data.data.location.point.coordinates[1],
              ),
            );
            dispatch(
              PopInSlice.actions.setLongitude(
                res.response.data.data.location.point.coordinates[0],
              ),
            );
            dispatch(
              PopInSlice.actions.setSendbirdId(
                res.response.data.data.chat.sendbirdId,
              ),
            );

            const messagingParams = {
              type: 'event',
              userId: id,
              progress: 0,
              displayName: data.name,
              url: data.chat.sendbirdId,
            };

            navigation.navigate('MESSAGING_STACK', {
              screen: 'MESSAGING_SCREEN',
              params: messagingParams,
            });

            resolve(false);
          } else {
            let errorText;
            console.log(res.error.data);
            if (res.error.data.shortName == 'ALREADY_A_MEMBER') {
              errorText = 'You are already a member of this event';
            } else {
              errorText = 'Error joining event';
            }

            Toast.show({
              text1: 'Oops!',
              text2: errorText,
              type: 'error',
              position: 'bottom',
            });
            resolve(false);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            text1: "Sorry! Counldn't join the chat!",
            type: 'error',
            position: 'bottom',
          });
          resolve(false);
        });
    });
  };

  return (
    <View style={styles.containerStyle}>
      <LocationEnableModal
        isVisible={isLocationModallVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
      <Title2 style={styles.titleStyle} color={'#000000'}>
        {`${data.name} ${data.emoji}`}
      </Title2>
      <Paragraph color={colors.black} style={styles.userParagraph}>
        {data.description}
      </Paragraph>
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 10,
        }}>
        {renderMember()}
        {data.members.length > 5 && (
          <Text style={{ paddingVertical: 5, color: 'gray' }}>
            {' '}
            + {data.members.length - 5} Users
          </Text>
        )}
      </View>
      <Modalize
        ref={profileModalRef}
        contentRef={contentRef}
        handlePosition="inside"
        scrollViewProps={{
          showsVerticalScrollIndicator: true,
          keyboardShouldPersistTaps: 'handled',
          contentContainerStyle: {
            backgroundColor: 'transparent',
          },
          scrollEnabled: false,
        }}
        adjustToContentHeight={true}
        modalTopOffset={Dimensions.get('screen').height * 0.05}
        modalStyle={[
          {
            backgroundColor: 'transparent',
            elevation: 0,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        ]}
        withHandle={false}></Modalize>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => {
            setIsProcessing(true);
            if (data.members.includes(id)) {
              handleGoToChat().then((res) => {
                setIsProcessing(false), profileModalRef.current?.close();
              });
            } else {
              if (isLocationPermitted) {
                if (!isProcessing) {
                  handleJoin().then((res) => {
                    setIsProcessing(false);
                  });
                }
              } else {
                console.log('is location permitted', isLocationPermitted);
                setIsLocationModalVisible(true);
                setIsProcessing(false);
              }
            }
          }}
          loading={isProcessing}
          gradient
          label={data.members.includes(id) ? 'Go to chat' : 'JOIN POP-IN'}
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => {
            onViewDetails(data, location, handleJoin, handleGoToChat);
          }}
          label="VIEW DETAILS"
          textStyle={[
            {
              color: colors.primary,
            },
            styles.viewDetailsActionButtonTextStyle,
          ]}
          borderColor={colors.primary}
          type="outline"
        />
        {/* <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="DECLINE"
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        /> */}
      </View>
    </View>
  );
});
export default PopInDetailsModal;

const styles = EStyleSheet.create({
  modalContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: 'Lato',
    fontWeight: '700',
    color: '#000000',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    paddingVertical: '0.5rem',
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionButtonStyles: {
    alignSelf: 'center',
    backgroundColor: '$white',
    height: '2.5 rem',
    width: '100%',
    marginTop: '0.5rem',
    paddingHorizontal: '3.2 rem',
    marginBottom: '.3rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
    //fontFamily: "quicksand",
  },
  viewDetailsActionButtonTextStyle: {
    fontWeight: '500',
    fontSize: '1rem',
  },
  MainContainer: {
    // position: 'absolute',
    paddingTop: '1rem',
    flex: 1,
    width: '100%',
    left: '0%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
});
