import React, { ReactElement, useRef, useState, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  View,
  Text,
  Linking,
  Platform,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import { Title2, Paragraph, Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';
import ActionButton from 'components/Buttons/ActionButton';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import { getDistance, convertDistance } from 'geolib';
import { getId, getStoreToken } from 'util/selectors';
import GroupIcon from '../../../assets/MapImage/Group.png';
import { PopApi } from 'services';
import store from 'store/index';
import SendBird, { SendBirdInstance, GroupChannel, Member } from 'sendbird';
import { sbPopInFindChannel } from 'services/sendbird/messaging';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import { Modalize } from 'react-native-modalize';
import ProfileModal from 'components/Modals/ProfileModal';
import { Portal } from 'react-native-portalize';
import Clipboard from '@react-native-community/clipboard';
import { checkLocationPermission } from 'util/locationPermission';
import LocationEnableModal from 'components/MapModals/LocationEnableModal';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  textCenter: {
    padding: '1 rem',
  },
  containerButtonTextInput: {
    padding: '1 rem',
    marginHorizontal: '1 rem',
    marginBottom: '1 rem',
    borderRadius: 10,
  },
  modal: {
    flex: 1,
  },
  textInput: {
    padding: '1rem',
    marginHorizontal: '1rem',
    borderRadius: 35,
  },

  actionButtonStyles: {
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
    height: '3 rem',
    width: '100%',
    paddingHorizontal: '1 rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  containerStyle: {
    padding: '1.5rem',
  },
  titleStyle: {
    fontFamily: 'Lato',
    fontWeight: '500',
    color: 'black',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
    color: '#555555',
    top: 5,
  },
  mapStyle: {
    paddingVertical: '6rem',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '13.5rem',
  },
  mapView: {
    marginTop: '0.2rem',
    marginBottom: '0.8rem',
    height: '13.5rem',
    marginRight: 10,
    shadowOpacity: 2,
    shadowRadius: 5,
    shadowColor: 'lightgray',
  },
  avatar: {},
});
interface IEventData {
  _id: string;
  name: string;
  description: string;
  creator: string;
  members: [string];
  chat: {
    sendbirdId: string;
    type: string;
  };
  createdAt: Date;
  emoji: string;
  tags: [string];
  location: {
    point: {
      type: string;
      coordinates: [number, number];
    };
    name: string;
    address: string;
  };
  isPrivate: boolean;
  capacity: number;
}

export interface ICurrentLocation {
  lat: number;
  long: number;
  route: any;
  navigation: PopInDetailsScreenNavigationProp;
}
// const PopInDetails = ({ navigation, props }: ICurrentLocation): ReactElement => {
const PopInDetails = ({
  route,
  navigation,
}: ICurrentLocation): ReactElement => {
  const theme = useTheme();
  const [downTo, setDownTo] = useState('');
  const [members, setMembers] = useState<[Member]>([]);
  const [otherUser, setOtherUser] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState<String>('');
  const [lastMessageTime, setLastMessageTime] = useState<Date>();
  const [lastMessageTimeString, setLastMessageTimeString] = useState<String>();
  const [isLocationPermitted, setIsLocationPermitted] = useState(false);
  const [isLocationModallVisible, setIsLocationModalVisible] = useState(false);

  const { colors } = theme;

  const id = getId(store.getState());
  const analytics = useAnalytics();

  const popIn: IEventData = route.params.data;
  const location: ICurrentLocation = route.params.location;
  const onPressJoin = route.params.onPressJoin;
  const onPressGoToChat = route.params.onPressGoToChat;
  const mapRef = useRef();
  const profileModalRef = useRef<Modalize>();

  // Setting last message time
  const sendbirdListen = (sb: SendBirdInstance) => {
    sbPopInFindChannel(popIn.chat.sendbirdId).then((channel: GroupChannel) => {
      console.log(channel.lastMessage.message);
      setLastMessageTime(channel.lastMessage.createdAt);
      setMembers(channel.members);
    });
  };

  const getProfile = (uid: string) => {
    PopApi.getUser({
      params: {
        id,
        userId: uid,
      },
      headers: {
        Authorization: `Bearer ${getStoreToken(store.getState())}`,
      },
    }).then((res: any) => {
      const otherUserData = res.response.data;
      if (otherUserData) {
        try {
          setOtherUser(otherUserData);
          profileModalRef.current?.open();
        } catch (err) {
          console.info('error:', err);
        }
      }
    });
  };

  useEffect(() => {
    getCreatorProfile();
    const sb = SendBird.getInstance();
    if (members.length == 0) sendbirdListen(sb);
    if (!isLocationPermitted) {
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
    }
  }, []);

  const handleAppStateChange = (state: any) => {
    if (state == 'active') {
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
                onPress={() => {
                  getProfile(item.userId);
                  profileModalRef.current?.open();
                  analytics.logEvent(
                    {
                      name: 'POP-IN DETAILS SCREEN OPEN PROFILE',
                      data: {
                        popInId: popIn._id,
                        chatId: popIn.chat.sendbirdId,
                        userId: item.userId,
                      },
                    },
                    true,
                  );
                }}
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
  };

  // Calculating distance between event & the user
  const calculateDistance = () => {
    const dis = getDistance(
      { latitude: location.lat, longitude: location.long },
      {
        latitude: popIn.location.point.coordinates[1],
        longitude: popIn.location.point.coordinates[0],
      },
    );
    const miles = Math.round(convertDistance(dis, 'mi') * 10) / 10;

    return miles;
  };

  // Calculating distance between given time & now
  const calculateTimeSince = (date: Date) => {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 0) seconds = 0;
    let interval = seconds / 31536000;

    let output;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

  const redirectToMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${popIn.location.point.coordinates[1]},${popIn.location.point.coordinates[0]}`;
    const label = `${popIn.name} ${popIn.emoji}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url != undefined) Linking.openURL(url);
  };

  // Configuring text for display
  const getStyledLocation = () => {
    const top = popIn.location.address.split(',')[0];
    const bottom = popIn.location.address.split(', ').slice(1);
    if (bottom[1] != undefined) {
      return top + '\n' + bottom[0] + ', ' + bottom[1];
    } else {
      return top + '\n' + bottom[0];
    }
  };

  const getCreatorProfile = () => {
    PopApi.getUser({
      params: {
        id,
        userId: popIn.members[0],
      },
      headers: {
        Authorization: `Bearer ${getStoreToken(store.getState())}`,
      },
    }).then((res: any) => {
      const createrData = res.response.data;
      setCreatorUsername(createrData.username);
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <StatusBar theme={theme} />
      <Separator />
      <Portal>
        <Modalize
          ref={profileModalRef}
          handlePosition="inside"
          modalHeight={Dimensions.get('screen').height * 0.8}
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            keyboardShouldPersistTaps: 'handled',
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          modalStyle={[
            {
              backgroundColor: 'transparent',
              elevation: 0,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
          ]}
          withHandle={false}>
          <ProfileModal
            otherUser={otherUser}
            onClose={() => profileModalRef.current?.close()}
          />
        </Modalize>
      </Portal>
      <LocationEnableModal
        isVisible={isLocationModallVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
      <ScrollView>
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={'#000000'} numberOfLines={2}>
            {popIn.name}
          </Title2>
          <Paragraph color={colors.black} style={styles.userParagraph}>
            {popIn.description}
          </Paragraph>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {renderMember()}
            {members.length > 5 && (
              <Text style={{ paddingVertical: 5, color: 'gray' }}>
                {' '}
                + {members.length - 5} Users
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: 20,
              color: '#999999',
              marginTop: 20,
              fontWeight: '600',
            }}>
            Pop-In Created:
          </Text>

          <Text style={{ fontSize: 15, color: '#000000', marginTop: 10 }}>
            {calculateTimeSince(popIn.createdAt)} ago by{' '}
            <Text
              style={{ color: '#00B9DE' }}
              onPress={() => {
                getProfile(popIn.creator);
              }}>
              {creatorUsername}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: '#999999',
              marginTop: 20,
              fontWeight: '600',
            }}>
            Last Message:
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#000000',
              marginTop: 10,
              fontWeight: '400',
            }}>
            {lastMessageTime != null
              ? calculateTimeSince(lastMessageTime)
              : calculateTimeSince(popIn.createdAt)}{' '}
            ago
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 25 }}>
            <Title3
              style={styles.textCenter}
              color={colors.gray}
              style={{ paddingRight: 20 }}>
              Meet-up location
            </Title3>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#00B9DE',
                marginTop: 10,
                fontWeight: '600',
              }}>
              {popIn.location.name}
            </Text>
            <Title3
              style={styles.textInput}
              style={{
                color: '#999999',
                fontSize: 15,
                marginTop: 10,
                fontWeight: '400',
                fontFamily: 'Inter',
                letterSpacing: -0.2,
              }}>
              {calculateDistance() + ' mi away'}
            </Title3>
          </View>
          <View style={{ width: 150 }}>
            <TouchableOpacity
              onPress={redirectToMaps}
              onLongPress={() => {
                Clipboard.setString(popIn.location.address);
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#00B9DE',
                  marginTop: 1,
                  marginBottom: 25,
                }}
                selectable={true}>
                {getStyledLocation()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapView}>
            <MapView
              ref={mapRef}
              style={styles.mapStyle}
              zoomEnabled={false}
              zoomControlEnabled={false}
              animationEnabled={false}
              showsUserLocation={true}
              onMapReady={() => {
                mapRef.current?.fitToSuppliedMarkers(['mk1'], {
                  edgePadding: {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                  },
                });
              }}
              initialRegion={{
                latitude: popIn.location.point.coordinates[1],
                longitude: popIn.location.point.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {popIn != undefined ? (
                [
                  <Marker
                    identifier={'mk1'}
                    coordinate={{
                      latitude: popIn.location.point.coordinates[1],
                      longitude: popIn.location.point.coordinates[0],
                    }}>
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        backgroundColor: '#66CAEA',
                        borderRadius: 40,
                        justifyContent: 'center',
                        alignItems: 'center',

                        borderWidth: 2,
                        borderColor: 'white',
                      }}>
                      <Text style={{ textAlign: 'left', fontSize: 20 }}>
                        {popIn.emoji}
                      </Text>
                    </View>
                  </Marker>,
                  // <Marker
                  //   identifier={'you'}
                  //   coordinate={{
                  //     latitude: location.lat,
                  //     longitude: location.long,
                  //   }}>
                  //   <View
                  //     style={{
                  //       height: 90,
                  //       width: 90,
                  //       justifyContent: 'center',
                  //       alignItems: 'center',
                  //     }}>
                  //     <View
                  //       style={{
                  //         height: 60,
                  //         width: 60,
                  //         backgroundColor: '#00B9DE',
                  //         borderRadius: 40,
                  //         justifyContent: 'center',
                  //         alignItems: 'center',
                  //         borderWidth: 5,
                  //         borderColor: 'white',
                  //       }}>
                  //       <Text
                  //         style={{
                  //           textAlign: 'left',
                  //           fontSize: 15,
                  //           color: '#FFFFFF',
                  //           fontWeight: '600',
                  //           fontFamily: 'Inter',
                  //         }}>
                  //         you
                  //       </Text>
                  //     </View>
                  //   </View>
                  // </Marker>,
                ]
              ) : (
                <></>
              )}
            </MapView>
          </View>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => {
              setIsProcessing(true);
              if (members.map((elem) => elem.userId).includes(id)) {
                analytics.logEvent(
                  {
                    name: 'POP-IN DETAILS SCREEN GO TO CHAT',
                    data: { popInId: popIn._id, chatId: popIn.chat.sendbirdId },
                  },
                  true,
                );
                onPressGoToChat().then((res) => {
                  setIsProcessing(false), navigation.pop();
                });
              } else {
                if (isLocationPermitted) {
                  analytics.logEvent(
                    {
                      name: 'POP-IN DETAILS SCREEN JOIN',
                      data: {
                        popInId: popIn._id,
                        chatId: popIn.chat.sendbirdId,
                        action: 'success',
                      },
                    },
                    true,
                  );
                  onPressJoin().then(
                    (res) => setIsProcessing(false),
                    navigation.pop(),
                  );
                } else {
                  analytics.logEvent(
                    {
                      name: 'POP-IN DETAILS SCREEN GO TO CHAT',
                      data: {
                        popInId: popIn._id,
                        chatId: popIn.chat.sendbirdId,
                        action: 'permission_requested',
                      },
                    },
                    true,
                  );
                  setIsLocationModalVisible(true);
                  setIsProcessing(false);
                }
              }
            }}
            gradient
            loading={isProcessing}
            label={
              members.map((elem) => elem.userId).includes(id)
                ? 'Go to chat'
                : 'JOIN POP-IN'
            }
            textStyle={styles.actionButtonTextStyle}
          />
        </View>
        <Separator />
      </ScrollView>
    </SafeAreaView>
  );
};
export default PopInDetails;
