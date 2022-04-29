import React, { ReactElement, useState, useEffect, useRef } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme, useIsFocused } from '@react-navigation/native';
import { Title3 } from 'components/Text';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from 'components/Buttons/ActionButton';
import EditLocationModal from 'components/MapModals/EditLocationModal';
import Geocoder from 'react-native-geocoding';
import { getId, getStoreToken } from 'util/selectors';
import store from 'store/index';
import Toast from 'react-native-toast-message';
import { PopApi } from 'services';
import { useDispatch } from 'react-redux';
import PopInSlice from 'features/Chats/PopInSlice';
import EmojiPicker from 'rn-emoji-keyboard';
import { isAndroid } from 'util/phone';
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
    paddingVertical: isAndroid() ? '0.5rem' : '1rem',
    paddingHorizontal: '1rem',
    marginHorizontal: '1rem',
    borderRadius: '2rem',
  },
  multiLineTextInput: {
    paddingVertical: isAndroid() ? '0.5rem' : '1rem',
    paddingHorizontal: '1rem',
    marginHorizontal: '1rem',
    paddingTop: isAndroid() ? '0.5rem' : '1rem',
    borderRadius: '2rem',
    backgroundColor: '#F8FAFA',
    color: 'black',
    borderColor: '#C4C4C4',
    borderWidth: 2,
    marginTop: 20,
  },
  actionButtonStyles: {
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
    height: '3 rem',
    width: '80%',
    paddingHorizontal: '1 rem',
    marginTop: 30,
  },
  actionButtonReadyStyles: {
    alignSelf: 'center',
    backgroundColor: '#66CAEA',
    height: '3 rem',
    width: '80%',
    paddingHorizontal: '1 rem',
    marginTop: 30,
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  locationViewStyle: {
    width: '15rem',
  },
});

export interface CreatePopInProps {
  navigation: CreatePopScreenNavigationProp;
  route: any;
}

const CreatePopIn = ({ navigation, route }: CreatePopInProps): ReactElement => {
  const theme = useTheme();
  const [downTo, setDownTo] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetupAddress, setMeetupAddress] = useState('');
  const [meetupLocationName, setMeetupLocationName] = useState('');
  const [meetupLocationLatLong, setMeetupLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const [meetupLocationDistance, setMeetupLocationDistance] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [popIn, setPopIn] = useState([]);
  const [currentPopEmoji, setCurrentPopEmoji] = useState('');
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const { colors } = theme;

  const downTotextInputRef = useRef<RNTextInput>(null);
  const descriptionTotextInputRef = useRef<RNTextInput>(null);
  const editLocationModalref = useRef<Modalize>(null);

  const id = getId(store.getState());

  const isFocused = useIsFocused();
  var scrollRef = useRef();
  const dispatch = useDispatch();
  const analytics = useAnalytics();

  const handleSubmit = async () => {
    const token = getStoreToken(store.getState());

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const params = {
      id: id,
    };
    const body = {
      name: downTo,
      description: description,
      emoji: currentPopEmoji,
      creator: id,
      members: [id],
      location: {
        point: {
          type: 'Point',
          coordinates: [meetupLocationLatLong.lng, meetupLocationLatLong.lat],
        },
        name: meetupLocationName,
        address: meetupAddress,
      },
    };
    // navigation.pop();

    PopApi.createPopIn(params, body, headers)
      .then((res) => {
        if (res.response != undefined) {
          dispatch(PopInSlice.actions.setName(res.response.data.data.name));
          dispatch(
            PopInSlice.actions.setDescription(
              res.response.data.data.description,
            ),
          );
          dispatch(PopInSlice.actions.setEmoji(res.response.data.data.emoji));
          dispatch(
            PopInSlice.actions.setLatitude(
              res.response.data.data.location.point.coordinates[0],
            ),
          );
          dispatch(
            PopInSlice.actions.setLongitude(
              res.response.data.data.location.point.coordinates[1],
            ),
          );
          dispatch(
            PopInSlice.actions.setSendbirdId(
              res.response.data.data.chat.sendbirdId,
            ),
          );

          const param = {
            create_type: 'create_pop',
            _id: res.response.data.data._id,
            emoji: currentPopEmoji,
            lati: res.response.data.data.location.point.coordinates[1],
            long: res.response.data.data.location.point.coordinates[0],
          };
          navigation.navigate('MAP_TAB', {
            screen: 'ShowMap',
            params: param,
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: res.error.data.data.message,
          });
          setIsProcessing(false);
        }
      })
      .catch((error) => {
        // console.log("error", error);
        Toast.show({
          text1: error,
          type: 'error',
          position: 'bottom',
        });
        setIsProcessing(false);
      });
  };

  interface ILocationData {
    lat: number;
    lng: number;
    address: string;
    name: string;
  }

  // Press button behavior
  const checkDisabled = () => {
    if (
      downTo == '' ||
      description == '' ||
      currentPopEmoji == '' ||
      downTo.length < 3
    ) {
      return true;
    } else {
      return false;
    }
  };

  const locationData = (props?: ILocationData) => {};
  useEffect(() => {
    if (
      isFocused == true &&
      route.params != undefined &&
      route.params.prevPage == 'EditLocationScreen'
    ) {
      console.log('edit location is focused');
      setMeetupAddress(route.params.address);
      setMeetupLocationName(route.params.name);
      setMeetupLocationLatLong({
        lat: route.params.lat,
        lng: route.params.lng,
      });
      setMeetupLocationDistance(route.params.distance);
    }
  }, [isFocused]);

  // From showMap
  useEffect(() => {
    if (route.params != undefined) {
      if (route.params.prevPage != 'EditLocationScreen') {
        console.log('other side');
        setPopIn(route.params.popIn);
        getAddress(route.params.lat, route.params.lng);
      } else if (route.params.prevPage == 'EditLocationScreen') {
        console.log('edit location side');
        setMeetupAddress(route.params.address);
        setMeetupLocationName(route.params.name);
        setMeetupLocationLatLong({
          lat: route.params.lat,
          lng: route.params.lng,
        });
        setMeetupLocationDistance(route.params.distance);
      }
    }
  }, []);

  const getAddress = (lat: number, lng: number) => {
    Geocoder.from(lat, lng)
      .then((json) => {
        const address: string = json.results[0].formatted_address;
        const name: string = json.results[0].address_components[1].long_name;
        setMeetupAddress(address);
        setMeetupLocationName(name);
        setMeetupLocationLatLong({
          lat,
          lng,
        });
        console.log('get address', meetupLocationLatLong);
      })
      .catch((error) => console.log(error));
  };

  const selectPopInEmoji = () => (
    <TouchableOpacity
      onPress={() => {
        analytics.logEvent(
          { name: 'POP-IN CREATE SCREEN OPEN EMOJI KEYBOARD', data: {} },
          true,
        );
        setShowEmojiKeyboard(true);
      }}
      style={{
        marginTop: 20,
        marginLeft: 28,
        height: 45,
        width: 45,
        backgroundColor: currentPopEmoji ? 'white' : '#C4C4C4',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 2,
        shadowRadius: 5,
        shadowColor: 'lightgray',
        marginBottom: 15,
      }}>
      {currentPopEmoji !== '' ? (
        <Text style={{ fontSize: 30 }}>{currentPopEmoji}</Text>
      ) : (
        <Ionicons
          name="add"
          size={40}
          color="white"
          //  alignSelf='center'
          style={{ position: 'absolute' }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <Separator />
      <Portal>
        <Modalize
          scrollViewProps={{
            showsVerticalScrollIndicator: true,
            contentContainerStyle: {
              backgroundColor: 'transparent',
            },
          }}
          modalHeight={Dimensions.get('window').height}
          ref={editLocationModalref}
          handlePosition="inside"
          disableScrollIfPossible={true}
          closeAnimationConfig={{ timing: { duration: 300 } }}>
          <View>
            <EditLocationModal
              isVisible={isModalVisible}
              onClose={() => editLocationModalref.current?.close()}
              handleSubmit={locationData}
            />
          </View>
        </Modalize>
      </Portal>
      <ScrollView ref={scrollRef}>
        <Title3
          style={{
            paddingLeft: 25,
            fontSize: 15,
            color: '#999999',
            marginTop: 30,
          }}>
          Set Emoji
        </Title3>
        {selectPopInEmoji()}
        <View>
          <EmojiPicker
            onEmojiSelected={(data) => {
              setCurrentPopEmoji(data.emoji);
              setShowEmojiKeyboard(false);
              analytics.logEvent(
                {
                  name: 'POP-IN CREATE SCREEN SELECT EMOJI',
                  data: { emoji: data.emoji },
                },
                true,
              );
            }}
            defaultHeight="60%"
            expandedHeight="80%"
            open={showEmojiKeyboard}
            onClose={() => {
              setShowEmojiKeyboard(false);
            }}
            enableRecentlyUsed={true}
            disabledCategory={['smileys_emotion']}
            emojiSize={Platform.OS == 'ios' ? 35 : 30}
            enableSearchBar={true}
            categoryContainerColor="#F5F5F5"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 30,
          }}>
          <Title3
            style={styles.textCenter}
            color={colors.gray}
            style={{ marginTop: 10, paddingLeft: 25 }}>
            Title
          </Title3>
        </View>
        <RNTextInput
          ref={downTotextInputRef}
          style={[
            styles.textInput,
            {
              backgroundColor: '#F8FAFA',
              color: 'black',
              borderColor: '#C4C4C4',
              borderWidth: 2,
              marginTop: 20,
            },
          ]}
          onFocus={() =>
            analytics.logEvent(
              { name: 'POP-IN CREATE SCREEN TITLE START', data: {} },
              true,
            )
          }
          onEndEditing={() =>
            analytics.logEvent(
              {
                name: 'POP-IN CREATE SCREEN TITLE FINISH',
                data: { title: downTo },
              },
              true,
            )
          }
          returnKeyType="next"
          placeholder="Pizza in 15?"
          placeholderTextColor={colors.gray}
          value={downTo}
          onChangeText={setDownTo}
          onSubmitEditing={() => descriptionTotextInputRef.current?.focus()}
        />

        <Title3
          style={styles.textCenter}
          color={colors.gray}
          style={{ paddingLeft: 25, marginTop: 30, flexWrap: 'wrap' }}>
          Description
        </Title3>
        <RNTextInput
          multiline={true}
          ref={descriptionTotextInputRef}
          style={[
            styles.multiLineTextInput,
            {
              backgroundColor: '#F8FAFA',
              color: 'black',
              borderColor: '#C4C4C4',
              borderWidth: 2,
              marginTop: 20,
            },
          ]}
          onFocus={() =>
            analytics.logEvent(
              { name: 'POP-IN CREATE SCREEN DESCRIPTION START', data: {} },
              true,
            )
          }
          onEndEditing={() =>
            analytics.logEvent(
              {
                name: 'POP-IN CREATE SCREEN DESCRIPTION FINISH',
                data: { description },
              },
              true,
            )
          }
          blurOnSubmit={true}
          returnKeyType="done"
          placeholder="Pineapple squad where ya at?"
          placeholderTextColor={colors.gray}
          value={description}
          onChangeText={setDescription}></RNTextInput>
        <TouchableOpacity
          onPress={() => {
            analytics.logEvent(
              {
                name: 'POP-IN CREATE SCREEN EDIT LOCATION',
                data: { title: description },
              },
              true,
            );
            navigation.navigate('POPIN_EDIT_LOCATION_SCREEN', {
              popIn,
              meetupLocationLatLong,
              address: meetupAddress,
              name: meetupLocationName,
            });
          }}>
          <View
            style={{ flexDirection: 'row', marginTop: 15, paddingLeft: 12 }}>
            <Title3 style={styles.textCenter} color={colors.gray}>
              Meet-up location
            </Title3>
            <Icon
              name="pencil"
              size={16}
              color={colors.gray}
              style={{ marginLeft: 0, marginTop: 18 }}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 10,
          }}>
          <Text
            style={{
              paddingLeft: 25,
              fontSize: 18,
              color: '#00B9DE',
              fontWeight: 'bold',
            }}>
            {meetupLocationName}
          </Text>

          <Title3
            style={styles.textInput}
            style={{
              color: '#999999',
              fontSize: 15,
              marginRight: 20,
              fontFamily: 'Inter',
            }}>
            {meetupLocationDistance == 0 || meetupLocationDistance == undefined
              ? 'current location'
              : `${meetupLocationDistance} miles from you`}
          </Title3>
        </View>
        <View style={styles.locationViewStyle}>
          <Text
            style={{
              paddingLeft: 25,
              fontSize: 15,
              color: '#00B9DE',
              marginTop: 5,
            }}>
            {meetupAddress}
          </Text>
        </View>
        <Text
          style={{
            paddingLeft: 25,
            fontSize: 15,
            color: '#999999',
            marginTop: 10,
          }}>
          You won’t be able to edit this after creation
        </Text>

        <View style={styles.buttonContainer}>
          <ActionButton
            onPress={() => {
              console.log('pressed');
              setIsProcessing(true);
              if (checkDisabled() == true) {
                if (downTo.length < 3) {
                  Toast.show({
                    text2:
                      'Name for your hangout group needs to be longer than 3 letters! 😎',
                    text1: 'Almost there!!',
                    type: 'info',
                    position: 'bottom',
                  });
                } else {
                  Toast.show({
                    text2:
                      'Enter the name, description and emoji for your hangout group! 😎',
                    text1: 'Almost there!!',
                    type: 'info',
                    position: 'bottom',
                  });
                }
                setIsProcessing(false);
              } else {
                analytics.logEvent(
                  {
                    name: 'POP-IN CREATE SCREEN CONFIRM POP-IN',
                    data: { description, title: downTo },
                  },
                  true,
                );
                if (!isProcessing) {
                  handleSubmit();
                }
              }
            }}
            loading={isProcessing}
            gradient
            containerStyle={
              downTo != '' && description != '' && currentPopEmoji != ''
                ? styles.actionButtonReadyStyles
                : styles.actionButtonStyles
            }
            label="Confirm Pop-In"
            textStyle={[styles.actionButtonTextStyle, { color: 'white' }]}
            type="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePopIn;
