import React, {
  useEffect,
  useRef,
  useState,
  Fragment,
  ReactElement,
} from 'react';
import {
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from 'react-native';
import MapView from 'react-native-map-clustering';
import { CommonActions } from '@react-navigation/native';
import { Marker, MapEvent } from 'react-native-maps';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Modalize } from 'react-native-modalize';
import FarWarningModel from 'components/MapModals/FarWarningModel';
import { Portal } from 'react-native-portalize';
import meetupIcon from '../../../assets/MapImage/meetUpLocationIcon.png';
import { getDistance, convertDistance } from 'geolib';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EditLocationModal from 'components/MapModals/EditLocationModal';
import Geocoder from 'react-native-geocoding';
import { isIphoneX } from 'util/phone';
import Config from 'react-native-config';
import algoliasearch from 'algoliasearch';
import useAnalytics from 'util/analytics/useAnalytics';
import { event } from 'react-native-reanimated';

// Setting Algolia
const { ALGOLIA_INDEX, ALGOLIA_API_KEY, ALGOLIA_APP_ID } = Config;

const ApiKey = 'AIzaSyAHchOhd8eO7DSnPaQUahC270ZHsKrnI-0';
Geocoder.init(ApiKey);

const styles = EStyleSheet.create({
  buttonContainer: {
    marginBottom: 10,
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
  userCountBar: {
    width: 200,
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'auto',
    flex: 1,
    width: '100%',
  },
});

interface EditPopInLocationProps {
  navigation: any;
  route: any;
}

interface IMeetupLocation {
  lat: number;
  lng: number;
}

const EditPopInLocation = ({
  navigation,
  route,
}: EditPopInLocationProps): ReactElement => {
  const [currentLongitude, setCurrentLongitude] = useState<number>();
  const [currentLatitude, setCurrentLatitude] = useState<number>();
  const [currentLatLong, setCurrentLatLong] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [isModalVisible, setModalVisible] = useState(false);
  const [ignModalVisible, setIgnModalVisible] = useState(false);
  const [userDetailData, setUserDetailData] = useState({});
  const [popIn, setPopIn] = useState([]);
  const [isFarWarning, setFarWarning] = useState(false);
  const [meetupLocationLatLong, setMeetupLocationLatLong] =
    useState<IMeetupLocation>({
      lat: 0,
      lng: 0,
    });
  const [meetupDistance, setMeetupDistance] = useState<number>(0);
  const [meetupAddress, setMeetupAddress] = useState<string>();
  const [meetupLocationName, setMeetupLocationName] = useState<string>('');
  const [modalInitialized, setModalInitialized] = useState<Boolean>(false);
  const [isModalUp, setIsModalUp] = useState(false);

  const colors = ['#66CAEA', '#FFA48F', '#FFD97B'];
  const mapRef = useRef();
  const eventDetailsModalRef = useRef<Modalize>(null);
  const analytics = useAnalytics();
  //console.log(route.params)

  const getAddress = (lat: number, lng: number) => {
    Geocoder.from(lat, lng)
      .then((json) => {
        const address: string = json.results[0].formatted_address;
        const name: string = json.results[0].address_components[1].long_name;
        setMeetupAddress(address);
        setMeetupLocationName(name);

        analytics.logEvent(
          {
            name: 'POP-IN CREATE SELECT LOCATION',
            data: { lat, lng, address, name },
          },
          true,
        );
      })
      .catch((error) => console.log(error));
  };

  // Updating current user location
  useEffect(() => {
    if (route.params != undefined) {
      setPopIn(route.params.popIn);
      setCurrentLatLong({
        lat: route.params.meetupLocationLatLong.lat,
        lng: route.params.meetupLocationLatLong.lng,
      });
      setMeetupAddress(route.params.address);
      setMeetupLocationName(route.params.name);
      setMeetupLocationLatLong({
        lat: route.params.meetupLocationLatLong.lat,
        lng: route.params.meetupLocationLatLong.lng,
      });
    }

    console.log(modalInitialized);
    // if (!modalInitialized) {
    //   setModalInitialized(true);
    //   setIsModalUp(true);
    //   eventDetailsModalRef.current?.open('top');
    //   eventDetailsModalRef.current?.close('alwaysOpen');
    //   setIsModalUp(false);
    // }
  }, []);

  useEffect(() => {
    if (currentLatLong.lat && currentLatLong.lng != 0) {
      queryEvents();
    }
  }, [currentLatLong]);

  // Calculating distance between user and location
  const calculateDistance = (lat: number, lng: number) => {
    const dis = getDistance(
      { latitude: currentLatLong.lat, longitude: currentLatLong.lng },
      { latitude: lat, lng },
    );
    let miles;
    if (dis < 10) {
      miles = Math.round(convertDistance(dis, 'mi') * 10);
    } else {
      miles = Math.round(convertDistance(dis, 'mi') * 10) / 10;
    }

    setMeetupDistance(miles);
    if (miles > 20) {
      setFarWarning(!isFarWarning);
    }
    return miles;
  };

  const onJoinPress = () => {
    setFarWarning(false);
    setTimeout(() => setModalVisible(!isModalVisible), 100);
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

  const queryEvents = () => {
    // Setting client
    const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    const index = searchClient.initIndex(ALGOLIA_INDEX);
    if (currentLatLong.lat && currentLatLong.lng != 0) {
      index
        .search('', {
          aroundLatLng: `${currentLatLong.lat}, ${currentLatLong.lng}`,
          aroundRadius: 32187,
          length: 47,
          facetFilters: ['type:PopIn'],
          attributesToHighlight: [],
        })
        .then((res) => {
          // Building map markers
          const temp = res.hits.map((marker, i) => (
            <Marker
              key={i}
              coordinate={{
                longitude: marker.location.point.coordinates[0],
                latitude: marker.location.point.coordinates[1],
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
          setPopIn(temp);
        })
        .catch((error) => {
          console.log(
            '🚀 ~ file: ShowMap.tsx ~ line 389 ~ .then ~ error',
            error,
          );
        });
    }
  };

  // Center button
  const animateToRegion = () => {
    let region = {
      latitude: currentLatLong.lat,
      longitude: currentLatLong.lng,
      latitudeDelta: 0.0025,
      longitudeDelta: 0.0025,
    };

    mapRef?.current?.animateToRegion(region, 500);
  };

  // Selecting meetup location
  const onLocationSelect = (event: MapEvent) => {
    const eventLat = event.nativeEvent.coordinate.latitude;
    const eventLng = event.nativeEvent.coordinate.longitude;
    setMeetupLocationLatLong({
      lat: eventLat,
      lng: eventLng,
    });
    calculateDistance(eventLat, eventLng);
    getAddress(eventLat, eventLng);
  };

  const selectedLocationMarker = () => {
    if (meetupLocationLatLong != null) {
      const lat = meetupLocationLatLong.lat;
      const long = meetupLocationLatLong.lng;

      return (
        <Fragment>
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
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
                  height: 10,
                  width: 10,
                  backgroundColor: '#00B9DE',
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 5,
                  borderColor: 'white',
                }}>
                <Image
                  source={meetupIcon}
                  style={{ width: 50, height: 50, resizeMode: 'contain' }}
                />
              </View>
            </View>
          </Marker>
        </Fragment>
      );
    }
  };

  return (
    <View style={styles.MainContainer}>
      <FarWarningModel
        data={userDetailData}
        isVisible={isFarWarning}
        onClose={() => {
          setFarWarning(false);
          animateToRegion();
        }}
        type={'create'}
        onJoinPress={onJoinPress}
      />
      <Portal>
        <Modalize
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          onClosed={() => {
            setIsModalUp(false);
            Keyboard.dismiss();
          }}
          ref={eventDetailsModalRef}
          keyboardAvoidingBehavior="position"
          handlePosition="inside"
          adjustToContentHeight={true}
          onLayout={(props) => {
            // console.log('height', props.layout.height);
            // console.log("height change triggere", modalHeight)
            // if (modalHeight == Dimensions.get('window').height * 0.2) {
            //   setModalHeight(props.layout.height);
            // }
          }}
          alwaysOpen={Dimensions.get('window').height * 0.2}
          disableScrollIfPossible={true}
          closeAnimationConfig={{ timing: { duration: 200 } }}>
          <View>
            <EditLocationModal
              isVisible={true}
              distance={meetupDistance}
              address={meetupAddress}
              name={meetupLocationName}
              modalUp={isModalUp}
              handleSubmit={(data) => {
                eventDetailsModalRef?.current?.close();
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'CREATEPOPIN_SCREEN',
                    params: {
                      ...data,
                      lat: meetupLocationLatLong.lat,
                      lng: meetupLocationLatLong.lng,
                      popIn,
                      prevPage: 'EditLocationScreen',
                    },
                  }),
                );
              }}></EditLocationModal>
          </View>
        </Modalize>
      </Portal>
      {currentLatLong.lat && currentLatLong.lng ? (
        <Fragment>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            zoomEnabled={true}
            zoomControlEnabled={true}
            animationEnabled={true}
            showsUserLocation={true}
            onPanDrag={() => {
              setIsModalUp(false);
            }}
            onPress={(event) => {
              onLocationSelect(event);
              eventDetailsModalRef.current?.open('top');
              setIsModalUp(true);
            }}
            onMapReady={() => {
              // Fitting everything in the map
              // if (popIn.length > 0 && currentLatLong.lat != 0) {
              //   mapRef.current.fitToElements(
              //     popIn
              //       .map((marker) => {
              //         return {
              //           longitude: marker.location.point.coordinates[0],
              //           latitude: marker.location.point.coordinates[1],
              //         };
              //       })
              //       .push({
              //         latitude: currentLatLong.lat,
              //         longitude: currentLatLong.lng,
              //       }),
              //   );
              // }
            }}
            initialRegion={{
              latitude: currentLatLong.lat,
              longitude: currentLatLong.lng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            {/* {myLocationMarker()} */}
            {popIn}
            {selectedLocationMarker()}
          </MapView>
          <TouchableOpacity
            onPress={() => animateToRegion()}
            style={{
              width: 30,
              height: 30,
              top: isIphoneX() ? 44 : 10,
              position: 'absolute',
              right: 40,
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
          <TouchableOpacity
            onPress={() => setIgnModalVisible(!ignModalVisible)}
            style={{
              top: 10,
              position: 'absolute',
              left: 10,
            }}></TouchableOpacity>
        </Fragment>
      ) : (
        <></>
      )}
    </View>
  );
};

export default EditPopInLocation;
