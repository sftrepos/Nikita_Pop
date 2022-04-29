import React, { useEffect, useRef, useState, Fragment } from 'react';
import {
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  AppState,
} from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, LatLng } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
//import GhostIcon from '../../../assets/MapImage/ghost.png';
import BetaInfoIcon from '../../../assets/MapImage/BetaInfo.png';
//import AddIcon from '../../../assets/MapImage/Add.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActionButton from 'components/Buttons/ActionButton';
import { Modalize } from 'react-native-modalize';
//import IncognitoModal from '../../components/MapModals/IncognitoModel';
import PopInBetaModal from '../../components/MapModals/PopInBetaModal';
import PopInDetailsModal from '../../components/MapModals/PopInDetailsModal';
//import SelectModeModel from '../../components/MapModals/SelectModeModel';
import ProfileModel from '../../components/MapModals/UserProfileModel';
import FarWarningModel from '../../components/MapModals/FarWarningModel';
import LocationEnableModal from 'components/MapModals/LocationEnableModal';
import { getId, getStoreToken } from 'util/selectors';
import AsyncStorage from '@react-native-community/async-storage';
// import UserSparseJsonData from '../Map/Json/users-sparse.json';
// import UserRegularJsonData from '../Map/Json/users-regular.json';
// import UserConcentratedJsonData from '../Map/Json/users-concentrated.json';
// import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
// import routes from 'nav/routes';
import { getDistance, convertDistance } from 'geolib';
//import ShowIncognitoModel from '../../components/MapModals/ShowIncognitoModel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeedbackModal from '../../components/MapModals/FeedbackModal';
import { useIsFocused } from '@react-navigation/native';
import { PopApi } from 'services';
import { useSelector } from 'react-redux';
import store from 'store/index';
import { isIphoneX } from 'util/phone';
import Config from 'react-native-config';
import algoliasearch from 'algoliasearch';
import { ActivityIndicator } from 'react-native-paper';
import { checkLocationPermission } from 'util/locationPermission';
import useAnalytics from 'util/analytics/useAnalytics';

// Setting Algolia
const { ALGOLIA_INDEX, ALGOLIA_API_KEY, ALGOLIA_APP_ID } = Config;

const styles = EStyleSheet.create({
  buttonContainer: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  actionButtonStyles: {
    alignSelf: 'center',
    backgroundColor: '$white',
    height: '2.5 rem',
    width: '100%',
    paddingHorizontal: '1 rem',
    marginBottom: '.3rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  MainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avtarStyle: {
    width: 20,
    height: 20,
  },
  betaTouch: {
    top: isIphoneX() ? 10 : 0,
    left: 30,
    position: 'absolute',
  },
  betaView: {
    marginTop: Dimensions.get('window').height * 0.03,
    height: 50,
    width: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  betaText: {
    color: '#00B9DE',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  betaIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    left: 5,
    top: 2,
  },
  userCountBar: {
    width: 220,
    height: 30,
    color: '#FFFFFF',
    fontSize: 14,
    top: 80,
    position: 'absolute',
    right: '-100%',
    backgroundColor: '#00B9DE',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'auto',
    paddingHorizontal: 0,
    paddingRight: 40,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
});

interface IShowMap {
  navigation: any;
}

const ShowMap = (props: IShowMap) => {
  const { navigation } = props;
  const id = useSelector((state) => getId(state));
  const token = getStoreToken(store.getState());
  const [currentLatLong, setCurrentLatLong] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [isModalVisible, setModalVisible] = useState(false);
  const [ignModalVisible, setIgnModalVisible] = useState(false);
  //const [isModeModelVisible, setModeModelVisible] = useState(false);
  const [isUserProfile, setUserProfile] = useState(false);
  const [userDetailData, setUserDetailData] = useState({});
  const [userProfileData, setUserProfileData] = useState({});
  const [lastLocationUpdate, setLastLocationUpdate] = useState<number>(0);
  const [isFarWarning, setFarWarning] = useState(false);
  const [isBetaModalVisible, setBetaModalVisible] = useState(false);
  const [isFeedbackModallVisible, setFeedbackModalVisible] = useState(false);
  const [isLocationModallVisible, setIsLocationModalVisible] = useState(false);
  //const [isEnableIncognito, setEnableIncognito] = useState(false);
  //const [isShowIncognito, setIsShowIncognito] = useState(false);
  const [popIns, setPopIns] = useState([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [isSearchingPopIn, setIsSearchingPopIn] = useState<Boolean>(false);
  const [isSearchingUser, setIsSearchingUser] = useState<Boolean>(false);
  //const [userSearchTime, setUserSearchTime] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(-1);
  const [showTmpMarker, setShowTempMarker] = useState<Boolean>(false);
  const [createdPopInId, setCreatedPopInId] = useState<String>('');
  const [isLocationPermitted, setIsLocationPermitted] = useState(true);

  const colors = ['#66CAEA', '#FFA48F', '#FFD97B'];
  const mapRef = useRef();
  const userCountBarRef = useRef();
  const eventDetailsModalRef = useRef<Modalize>(null);
  const isFocused = useIsFocused();
  const analytics = useAnalytics();

  // Controlling user count display
  useEffect(() => {
    if (isFocused == false) {
      userCountBarRef.current = false;
    } else {
      checkLocationPermission().then((res) => {
        if (res == true) {
          setIsLocationPermitted(true);
          locateCurrentPosition();
        } else {
          setIsLocationPermitted(false);
          locateSchoolCoordinates();
        }
        queryUserCount();
        console.log(currentLatLong);
      });
    }

    const popIn = props?.route?.params?.params;
    let pop_type = '';
    pop_type = popIn?.create_type;

    if (pop_type === 'create_pop') {
      // setShowTempMarker(true);
      queryEvents();
      focus_animateToRegion(popIn?.lati, popIn?.long);
    }
  }, [isFocused]);

  useEffect(() => {
    if (currentLatLong.lat && currentLatLong.lng != 0) {
      queryEvents();
    }
  }, [currentLatLong]);

  // Updating current user location
  useEffect(() => {
    // Showing beta modal for the first time
    AsyncStorage.getItem('betaIntroModalShown').then((value) => {
      if (value == null) {
        setIsLocationModalVisible(true);
        storeDataValue('betaIntroModalShown', 'true');
      }
    });
    checkLocationPermission().then((res) => {
      if (res == true) {
        setIsLocationPermitted(true);
        locateCurrentPosition();
      } else {
        setIsLocationPermitted(false);
        locateSchoolCoordinates();
      }
    });
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
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

  // Retrieving number of live users
  const queryUserCount = () => {
    if (userCount < 0) {
      if (
        currentLatLong.lat &&
        currentLatLong.lng != 0 &&
        isSearchingUser == false
      ) {
        setIsSearchingUser(true);
        const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
        const index = searchClient.initIndex(ALGOLIA_INDEX);
        index
          .search('', {
            aroundLatLng: `${currentLatLong.lat}, ${currentLatLong.lng}`,
            aroundRadius: 32187,
            length: 1, // we just need the nbHits
            facetFilters: 'type:User',
            attributesToHighlight: [],
          })
          .then((res) => {
            setUserCount(res.nbHits);
            setIsSearchingUser(false);
          });
      }
    }
  };

  const storeDataValue = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {}
  };

  const TempMarker = ({ lati, long, emoji, _id }: any) => (
    <Marker
      key={`pop-key-${showTmpMarker}`}
      coordinate={{
        longitude: long,
        latitude: lati,
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
        <ActivityIndicator color="white" />
        <View
          style={{
            height: 50,
            width: 50,
            backgroundColor: getRandomColor(_id),
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',

            borderWidth: 2,
            borderColor: 'white',
          }}>
          <Text style={{ textAlign: 'left', fontSize: 20 }}>{emoji}</Text>
        </View>
      </View>
    </Marker>
  );

  const locateSchoolCoordinates = () => {
    setCurrentLatLong({ lat: 30.2849, lng: -97.7341 });
    return { lat: 30.2849, lng: -97.7341 };
  };

  const locateCurrentPosition = async () => {
    await Geolocation.getCurrentPosition(
      (position) => {
        const currentLong = position.coords.longitude;
        const currentLat = position.coords.latitude;
        setCurrentLatLong({ lat: currentLat, lng: currentLong });
        updateLocation(currentLat, currentLong);
        setLastLocationUpdate(Date.now());
        return { lat: currentLat, lng: currentLong };
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    );
  };

  const queryEvents = () => {
    // Setting client
    const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    const index = searchClient.initIndex(ALGOLIA_INDEX);
    let popIn = props?.route?.params?.params;

    if (
      currentLatLong.lat &&
      currentLatLong.lng != 0 &&
      isSearchingPopIn == false
    ) {
      setIsSearchingPopIn(true);
      createdPopInId !== popIn?._id && setShowTempMarker(true);
      index
        .search('', {
          aroundLatLng: `${currentLatLong.lat}, ${currentLatLong.lng}`,
          aroundRadius: 1000000,
          length: 47,
          facetFilters: ['type:PopIn', 'isPrivate:false'],
          attributesToHighlight: [],
        })
        .then((res) => {
          //enable the temp marker
          setShowTempMarker(false);

          //open the details modal
          if (popIn?._id) {
            let createdPopIn = res.hits.find((hit) => hit._id === popIn._id);

            if (createdPopIn && createdPopInId !== popIn._id) {
              setCreatedPopInId(popIn._id);
              setUserDetailData(createdPopIn);
              calculateDistance(
                createdPopIn.location.point.coordinates[0],
                createdPopIn.location.point.coordinates[1],
              );
              openEventDetailsModal();
            }
          }
          // Building map markers
          const temp = res.hits.map((marker: Eventid) => (
            <Marker
              key={marker._id}
              coordinate={{
                longitude: marker.location.point.coordinates[0],
                latitude: marker.location.point.coordinates[1],
              }}
              onPress={() => {
                openEventDetailsModal();
                setUserDetailData(marker);
                analytics.logEvent(
                  {
                    name: 'POP-IN MODAL OPEN',
                    data: {
                      popInId: marker._id,
                      chatId: marker.chat.sendbirdId,
                    },
                  },
                  true,
                );
                calculateDistance(
                  marker.location.point.coordinates[0],
                  marker.location.point.coordinates[1],
                );
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: getRandomColor(marker._id),
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',

                  borderWidth: 2,
                  borderColor: 'white',
                }}>
                <Text style={{ textAlign: 'left', fontSize: 20 }}>
                  {marker.emoji}
                </Text>
              </View>
            </Marker>
          ));
          setPopIns(temp);
          setSearchTime(Date.now());
          setIsSearchingPopIn(false);
        })
        .catch((error) => {
          console.log(
            '🚀 ~ file: ShowMap.tsx ~ line 389 ~ .then ~ error',
            error,
          );
        });
    }
  };

  const openEventDetailsModal = () => {
    eventDetailsModalRef.current?.open();
  };

  const getRandomColor = (id: string) => {
    var hash = 0,
      i,
      chr;
    for (i = 0; i < id.length; i++) {
      chr = id.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    let randomColor = colors[Math.abs(hash) % colors.length];
    return randomColor;
  };

  const calculateDistance = (eventLong: number, eventLat: number) => {
    let dis = getDistance(
      { latitude: currentLatLong.lat, longitude: currentLatLong.lng },
      { latitude: eventLat, longitude: eventLong },
    );

    const miles = convertDistance(dis, 'mi');
    if (miles > 20) {
      setFarWarning(!isFarWarning);
    } else {
      setModalVisible(!isModalVisible);
    }
  };

  const onJoinPress = () => {
    setFarWarning(false);
    setTimeout(() => setModalVisible(!isModalVisible), 100);
  };

  const focus_animateToRegion = (lati, long) => {
    let region = {
      latitude: lati,
      longitude: long,
      latitudeDelta: 0.0025,
      longitudeDelta: 0.0025,
    };
    mapRef?.current?.animateToRegion(region, 700);
  };

  const animateToRegion = () => {
    let region = {
      latitude: currentLatLong.lat,
      longitude: currentLatLong.lng,
      latitudeDelta: 0.0025,
      longitudeDelta: 0.0025,
    };

    mapRef?.current?.animateToRegion(region, 700);
  };

  const moveUserCountBar = () => {
    // Moving the user count component to the side

    if (userCountBarRef.current == false) {
      userCountBarRef.current = true;
      const count = 2;
      const startValue = new Animated.Value(0);

      // Setting animation variables.
      const value = 175 + count.toString().length * 3;
      const endValue = -value * 2;
      const endValue2 = value * 2;
      const duration = 1500;

      Animated.sequence([
        // Left
        Animated.timing(startValue, {
          toValue: endValue,
          duration: duration,
          useNativeDriver: true,
          delay: 0, // Moving right away
        }),
        // Right
        Animated.timing(startValue, {
          toValue: endValue2,
          duration: duration,
          useNativeDriver: true,
          delay: 3000, // Moving after 3 seconds
        }),
      ]).start();

      return (
        <Animated.View
          style={[
            styles.userCountBar,
            { transform: [{ translateX: startValue }] },
          ]}>
          <Text>
            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                lineHeight: 19,
                fontFamily: 'Lato',
                fontWeight: 'bold',
                letterSpacing: 0.5,
              }}>
              {userCount}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#FFFFFF',
                fontFamily: 'Inter',
                lineHeight: 17,
              }}>
              {` nearby users online`}
            </Text>
          </Text>
        </Animated.View>
      );
    } else {
      return <></>;
    }
  };

  // Updating user location in backend
  const updateLocation = async (lat: number, lng: number) => {
    // Updating every 3 minutes
    if (Date.now() - lastLocationUpdate < 18e4) {
      const apiHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('sending to pop');
      PopApi.updateLocation({ identityId: id, lat, lng }, apiHeader).then(
        (res) => {
          if (res.response) {
            //console.log('user location updated', res.response);
          } else {
            console.log('error in user location update', res.error);
          }
        },
      );
    }
  };

  const myLocationMarker = () => {
    return (
      <Marker
        coordinate={{
          latitude: currentLatLong.lat,
          longitude: currentLatLong.lng,
        }}>
        <View
          style={{
            height: 90,
            width: 90,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 60,
              width: 60,
              backgroundColor: '#00B9DE',
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 5,
              borderColor: 'white',
            }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 15,
                color: '#FFFFFF',
                fontWeight: '600',
                fontFamily: 'Inter',
              }}>
              you
            </Text>
          </View>
          {/* <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: 'white',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 5,
                right: 12,
              }}>
              <Image source={AddIcon} style={{ width: 20, height: 20 }} />
            </View> */}
        </View>
      </Marker>
    );
  };
  const popInPrams = props?.route?.params?.params;

  return (
    <View style={styles.MainContainer}>
      <LocationEnableModal
        isLocationPermitted={isLocationPermitted}
        isVisible={isLocationModallVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
      <FarWarningModel
        data={userDetailData}
        isVisible={isFarWarning}
        onClose={() => {
          setFarWarning(false);
          animateToRegion();
          eventDetailsModalRef.current.close();
        }}
        onJoinPress={onJoinPress}
      />
      <Modalize
        scrollViewProps={{
          showsVerticalScrollIndicator: true,
          contentContainerStyle: {
            backgroundColor: 'transparent',
          },
        }}
        ref={eventDetailsModalRef}
        adjustToContentHeight={true}
        handlePosition="inside"
        disableScrollIfPossible={true}
        closeAnimationConfig={{ timing: { duration: 200 } }}>
        <View style={styles.containerStyle}>
          <PopInDetailsModal
            navigation={navigation}
            data={userDetailData}
            isLocationPermitted={isLocationPermitted}
            location={{ lat: currentLatLong.lat, long: currentLatLong.lng }}
            onClose={() => {
              console.log('onclose called'),
                eventDetailsModalRef.current?.close();
            }}
            onViewDetails={(data, location, onPressJoin, onPressGoToChat) => {
              navigation.navigate('POPINDETAILS_SCREEN', {
                data,
                location,
                onPressJoin,
                onPressGoToChat,
                eventDetailsModalRef,
              });
              //setModalVisible(false);
              eventDetailsModalRef.current?.close();
            }}
          />
        </View>
      </Modalize>
      <PopInBetaModal
        isVisible={isBetaModalVisible}
        onClose={() => setBetaModalVisible(false)}
        onGoFeedback={() => {
          setFeedbackModalVisible(true);
          setBetaModalVisible(false);
        }}
      />
      <ProfileModel
        data={userProfileData}
        isVisible={isUserProfile}
        onClose={() => setUserProfile(false)}
      />
      {/* <IncognitoModal
        isVisible={ignModalVisible}
        onClose={() => setIgnModalVisible(false)}
        onGoIncognito={() => {
          setEnableIncognito(true);
          // setIgnModalVisible(false)
        }}
      /> */}
      {/* <ShowIncognitoModel
        isVisible={isShowIncognito}
        onClose={() => setIsShowIncognito(false)}
        onShowIncognito={() => {
          setEnableIncognito(false);
          // setModalVisible(false)
        }}
      />*/}
      <FeedbackModal
        isVisible={isFeedbackModallVisible}
        onPresSend={() => setFeedbackModalVisible(false)}
        onClose={() => setFeedbackModalVisible(false)}
      />
      {currentLatLong.lat && currentLatLong.lng ? (
        <Fragment>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            zoomEnabled={true}
            zoomControlEnabled={true}
            animationEnabled={true}
            showsCompass={false}
            showsUserLocation={true}
            //onMapReady={() => { }}
            //showsUserLocation={true}
            initialRegion={{
              latitude: currentLatLong.lat,
              longitude: currentLatLong.lng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            {/* {myLocationMarker()} */}
            {showTmpMarker && popInPrams && TempMarker(popInPrams)}
            {popIns}
          </MapView>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => {
                console.log(isLocationPermitted);
                if (isLocationPermitted) {
                  props.navigation.navigate('CREATEPOPIN_SCREEN', {
                    lat: currentLatLong.lat,
                    lng: currentLatLong.lng,
                    prevPage: 'showMap',
                    popIns,
                  });
                  analytics.logEvent(
                    {
                      name: 'POP-IN CREATE BUTTON PRESS',
                      data: { action: 'success' },
                    },
                    true,
                  );
                } else {
                  setIsLocationModalVisible(true);
                  analytics.logEvent(
                    {
                      name: 'POP-IN CREATE BUTTON PRESS',
                      data: { action: 'permission_requested' },
                    },
                    true,
                  );
                }
              }}
              gradient
              label="Create Pop-In"
              textStyle={styles.actionButtonTextStyle}
            />
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              if (!isEnableIncognito) {
                setIgnModalVisible(!ignModalVisible);
              } else {
                setIsShowIncognito(!isShowIncognito);
              }
            }}
            style={{
              width: 30,
              height: 30,
              top: 10,
              position: 'absolute',
              right: 100,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: 'white',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 5,
                borderColor: 'white',
              }}>
              <Image
                source={GhostIcon}
                style={{ width: 25, height: 25, resizeMode: 'contain' }}
              />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setBetaModalVisible(!isBetaModalVisible);
            }}
            style={styles.betaTouch}>
            <View style={styles.betaView}>
              <Text style={styles.betaText}>Beta</Text>
              <Image source={BetaInfoIcon} style={styles.betaIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => animateToRegion()}
            style={{
              width: Platform.OS == 'ios' ? 30 : 50,
              height: Platform.OS == 'ios' ? 30 : 50,
              top: isIphoneX() ? 20 : 10,
              position: 'absolute',
              marginTop: Dimensions.get('window').height * 0.03,
              right: 30,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: 'white',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 5,
                borderColor: 'white',
              }}>
              <Icon
                name="my-location"
                size={25}
                style={{ width: 25, height: 25, color: 'gray' }}
              />
            </View>
          </TouchableOpacity>
          {isFocused && userCount > 0 ? moveUserCountBar() : <></>}

          <TouchableOpacity
            onPress={() => setIgnModalVisible(!ignModalVisible)}
            style={{
              top: 10,
              position: 'absolute',
              left: 10,
            }}></TouchableOpacity>
        </Fragment>
      ) : (
        <ActivityIndicator style={{ margin: 24 }} />
        //<Text>getting data</Text>
      )}
    </View>
  );
};

export default ShowMap;
