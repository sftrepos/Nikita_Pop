import React, { ReactElement, useRef, useState, useEffect, is } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme, useIsFocused } from '@react-navigation/native';
//import StatusBar from 'components/StatusBar';
import { Title3 } from 'components/Text';
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
import { useDispatch, useSelector } from 'react-redux';
import PopInSlice from 'features/Chats/PopInSlice';
import EmojiPicker from 'rn-emoji-keyboard';

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
    // backgroundColor: '#C4C4C4',
    height: '3 rem',
    width: '80%',
    paddingHorizontal: '1 rem',
    marginTop: '.5rem',
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
});

export interface CreatePopInProps {
  navigation: CreatePopScreenNavigationProp;
  route: any;
}

const EditPopinDetails = ({
  navigation,
  route,
}: CreatePopInProps): ReactElement => {
  const theme = useTheme();

  const initialName = useSelector((state) => state.popin.name);
  const initialDesc = useSelector((state) => state.popin.description);
  const initialEmoji = useSelector((state) => state.popin.emoji);
  const groupId = useSelector((state) => state.popin.groupId);

  const [downTo, setDownTo] = useState(initialName);
  const [description, setDescription] = useState(initialDesc);
  const [meetupAddress, setMeetupAddress] = useState('');
  const [meetupLocationName, setMeetupLocationName] = useState('');
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const [meetupLocationLatLong, setMeetupLocationLatLong] = useState({});
  const [meetupLocationDistance, setMeetupLocationDistance] = useState(0);
  const [popEmoji, setPopEmoji] = useState(true);
  const [currentPopEmoji, setCurrentPopEmoji] = useState(initialEmoji);
  const { colors } = theme;

  const textInputRef = useRef<RNTextInput>(null);

  const id = getId(store.getState());
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const handleSubmit = async () => {
    const token = getStoreToken(store.getState());
    dispatch(PopInSlice.actions.setEmoji(currentPopEmoji));
    dispatch(PopInSlice.actions.setName(downTo));
    dispatch(PopInSlice.actions.setDescription(description));

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const body = {
      id,
      name: downTo,
      description: description,
      emoji: currentPopEmoji,
      // creator: id,
      // members: [id],
      // location: {
      //   point: {
      //     type: 'Point',
      //     coordinates: [meetupLocationLatLong.lat, meetupLocationLatLong.lng],
      //   },
      //   name: meetupLocationName,
      //   address: meetupAddress,
      // },
    };

    PopApi.updatePopIn(groupId, body, headers)
      .then((res) => {
        navigation.pop();
      })
      .catch((error) => {
        Toast.show({
          text1: error.response.data.error,
          type: 'error',
          position: 'bottom',
        });
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
    if (downTo == '' || description == '' || currentPopEmoji == '') {
      return true;
    } else {
      return false;
    }
  };

  // For return from edit locations
  useEffect(() => {
    if (
      isFocused == true &&
      route.params != undefined &&
      route.params.prevPage == 'EditLocationScreen'
    ) {
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
        setMeetupLocationLatLong({
          lat: route.params.lat,
          lng: route.params.lng,
        });
        getAddress(route.params.lat, route.params.lng);
      }
    }
  }, []);

  const getAddress = (lat, lng) => {
    Geocoder.from(lat, lng)
      .then((json) => {
        const address: string = json.results[0].formatted_address;
        const name: string = json.results[0].address_components[1].long_name;
        setMeetupAddress(address);
        setMeetupLocationName(name);
      })
      .catch((error) => console.log(error));
  };

  const selectPopInEmoji = () => (
    <TouchableOpacity
      onPress={() => setPopEmoji(!popEmoji)}
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
      <ScrollView>
        <Title3
          style={{
            paddingLeft: 25,
            fontSize: 15,
            color: '#999999',
            marginTop: 30,
          }}>
          Pop-in Emoji
        </Title3>
        {selectPopInEmoji()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 30,
          }}>
          <Title3
            style={styles.textCenter}
            color={colors.gray}
            style={{ marginTop: 20, paddingLeft: 25 }}>
            Pop-in Name
          </Title3>
        </View>
        <RNTextInput
          ref={textInputRef}
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
          returnKeyType="next"
          placeholder="Take a walk"
          placeholderTextColor={colors.gray}
          value={downTo}
          onChangeText={setDownTo}
        />

        <Title3
          style={styles.textCenter}
          color={colors.gray}
          style={{ paddingLeft: 25, marginTop: 30, flexWrap: 'wrap' }}>
          Description
        </Title3>
        <RNTextInput
          multiline={true}
          ref={textInputRef}
          style={[
            styles.textInput,
            {
              backgroundColor: '#F8FAFA',
              color: 'black',
              borderColor: '#C4C4C4',
              borderWidth: 2,
              marginTop: 20,
              paddingTop: 16,
              textAlignVertical: 'top',
              justifyContent: 'flex-start',
            },
          ]}
          returnKeyType="done"
          placeholder="Super nice day to explore campus today!"
          placeholderTextColor={colors.gray}
          value={description}
          onChangeText={setDescription}></RNTextInput>

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
        </View>
        <View style={{ marginBottom: 15 }}>
          <EmojiPicker
            onEmojiSelected={(data) => {
              setCurrentPopEmoji(data.emoji);
              setShowEmojiKeyboard(false);
            }}
            defaultHeight="50%"
            open={showEmojiKeyboard}
            onClose={() => {
              setShowEmojiKeyboard(false);
            }}
            emojiSize={Platform.OS == 'ios' ? 40 : 30}
            enableSearchBar={true}
            categoryContainerColor="#F5F5F5"
          />
        </View>
        <View style={styles.buttonContainer}>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => {
              if (checkDisabled() == true) {
                Toast.show({
                  text1: 'Enter the name, description and emoji! 😎',
                  type: 'info',
                  position: 'bottom',
                });
              } else {
                handleSubmit();
              }
              // navigation.navigate('POPINDETAILS_SCREEN');
            }}
            gradient
            label="Save"
            textStyle={styles.actionButtonTextStyle}
          />
          <ActionButton
            containerStyle={[
              styles.actionButtonStyles,
              {
                backgroundColor: 'white',
                borderColor: colors.primary,
                borderWidth: 1,
              },
            ]}
            onPress={() => navigation.pop()}
            label="Cancel"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPopinDetails;
