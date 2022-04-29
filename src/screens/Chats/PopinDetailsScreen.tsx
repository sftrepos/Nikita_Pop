import React, { ReactElement, useRef, useState, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  View,
  Text,
  Linking,
  Platform,
} from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import { Title2, Paragraph, Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import { getDistance, convertDistance } from 'geolib';
import { getId, getStoreToken } from 'util/selectors';
import { useSelector } from 'react-redux';
import { PopApi } from 'services';
import store from 'store/index';
import SendBird, { SendBirdInstance, GroupChannel, Member } from 'sendbird';
import { sbGetChannelByUrl } from 'services/sendbird/messaging';
import CustomAvatar from '../../../assets/vectors/pochies/CustomAvatar';
import { ActivityIndicator } from 'react-native-paper';
import { CustomHeaderButton } from 'components/HeaderButtons';
import Geolocation from '@react-native-community/geolocation';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import ProfileModal from 'components/Modals/ProfileModal';

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

interface ICurrentLocation {
  lat: number;
  lng: number;
}
// const PopInDetails = ({ navigation, props }: ICurrentLocation): ReactElement => {
const PopInDetails = ({
  route,
  navigation,
}: ICurrentLocation): ReactElement => {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [creatorUsername, setCreatorUsername] = useState<string>('');
  const [lastMessageTime, setLastMessageTime] = useState<Date>();
  const [currentLatLong, setCurrentLatLong] = useState<ICurrentLocation>({
    lat: 0,
    lng: 0,
  });
  // const [group, setGroup] = useState<any>();

  const { colors } = theme;

  const id = getId(store.getState());
  const name = useSelector((state) => state.popin.name);
  const description = useSelector((state) => state.popin.description);
  const sendbirdId = useSelector((state) => state.popin.sendbirdId);
  const emoji = useSelector((state) => state.popin.emoji);
  const longitude = useSelector((state) => state.popin.longitude);
  const latitude = useSelector((state) => state.popin.latitude);
  const location = useSelector((state) => state.popin.location);
  const createdAt = useSelector((state) => state.popin.createdAt);
  const creator = useSelector((state) => state.popin.creator);
  const loaded = useSelector((state) => state.popin.loaded);

  const [otherUser, setOtherUser] = useState('');

  const [latitude1, setLatitude1] = useState(0);
  const [longitude1, setLongitude1] = useState(0);

  const mapRef = useRef();
  const profileModalRef = useRef<Modalize>();

  // Setting last message time
  const sendbirdListen = (sb: SendBirdInstance) => {
    sbGetChannelByUrl(sendbirdId).then((channel: GroupChannel) => {
      setLastMessageTime(channel.lastMessage.createdAt);
      setMembers(channel.members);
    });
  };

  useEffect(() => {
    locateCurrentPosition();
    getCreatorProfile();
    const sb = SendBird.getInstance();
    if (members.length == 0) sendbirdListen(sb);

    // Trying to live load every 10 seconds if the last message time is < 1 min
    // interval = setInterval(() => {
    //   const sb = SendBird.getInstance();
    //   sendbirdListen(sb);
    //   console.log("callled")
    // }, 2000);
    // return () => {
    //   sb.removeChannelHandler(id);
    //   clearInterval(interval);
    // };
  }, []);

  useEffect(() => {
    if (creator === id) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <CustomHeaderButton
              style={{ marginRight: 10 }}
              onPress={() => {
                navigation.navigate('POPIN_DETAILS_EDIT');
              }}
              name="pencil"
            />
          );
        },
      });
    }
  }, []);

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

  const renderMember = () => {
    return members.map((item, i) => {
      if (i < 5) {
        const { avatar } = item.metaData;
        const avatarJs = JSON.parse(avatar);
        return (
          <CustomAvatar
            scale={0.15}
            {...avatarJs}
            onPress={() => {
              getProfile(item.userId);
            }}
            customAvatarContainerStyle={{ padding: 0, margin: 0 }}
          />
        );
      }
    });
  };

  const locateCurrentPosition = async () => {
    await Geolocation.getCurrentPosition(
      (position) => {
        const currentLong = position.coords.longitude;
        const currentLat = position.coords.latitude;
        setCurrentLatLong({ lat: currentLat, lng: currentLong });
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    );
  };

  // Calculating distance between event & the user
  const calculateDistance = () => {
    if (currentLatLong.lat && currentLatLong.lng != 0) {
      const dis = getDistance(
        { latitude: currentLatLong.lat, longitude: currentLatLong.lng },
        { latitude, longitude },
      );
      const miles = Math.round(convertDistance(dis, 'mi') * 10) / 10;

      return miles;
    }
  };

  // Calculating distance between given time & now
  const calculateTimeSince = (date: Date) => {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 0) seconds = 0;
    let interval = seconds / 31536000;

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
    const latLng = `${latitude},${longitude}`;
    const label = `${name} ${emoji}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url != undefined) Linking.openURL(url);
  };

  // Configuring text for display
  const getStyledLocation = () => {
    const top = location.address.split(',')[0];
    const bottom = location.address.split(', ').slice(1);
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
        userId: creator,
      },
      headers: {
        Authorization: `Bearer ${getStoreToken(store.getState())}`,
      },
    }).then((res: any) => {
      const createrData = res.response.data;
      setCreatorUsername(createrData.username);
    });
  };
  if (loaded) {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <StatusBar theme={theme} />
        <Separator />
        <Portal>
          <Modalize
            ref={profileModalRef}
            handlePosition="inside"
            adjustToContentHeight={true}
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
        <ScrollView>
          <View style={styles.containerStyle}>
            <Title2
              style={styles.titleStyle}
              color={'#000000'}
              numberOfLines={2}>
              {name}
            </Title2>
            <Paragraph color={colors.black} style={styles.userParagraph}>
              {description}
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
              {calculateTimeSince(createdAt)} ago by{' '}
              <Text
                style={{ color: '#00B9DE' }}
                onPress={() => {
                  getProfile(creator);
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
                : calculateTimeSince(createdAt)}{' '}
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
                }}
                onPress={redirectToMaps}>
                {location.name}
              </Text>

              <Title3
                // style={styles.textInput}
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
              <Text
                style={{
                  fontSize: 15,
                  color: '#00B9DE',
                  marginTop: 1,
                  marginBottom: 25,
                }}
                onPress={redirectToMaps}
                selectable={true}>
                {getStyledLocation()}
              </Text>
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
                  // latitude: group.location.point.coordinates[0],
                  // longitude: group.location.point.coordinates[1],
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                {[
                  <Marker
                    identifier={'mk1'}
                    coordinate={{
                      latitude,
                      longitude,
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
                        {emoji}
                      </Text>
                    </View>
                  </Marker>,
                ]}
              </MapView>
            </View>
          </View>
          <Separator />
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return <ActivityIndicator color={colors.primary} />;
  }
};
export default PopInDetails;
