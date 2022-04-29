import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import EStylesheet from 'react-native-extended-stylesheet';
import Axios from 'axios';
import { getId, getStoreToken } from '../util/selectors';
import { getApiUrl } from '../services';
import Geolocation, {
  GeolocationError,
} from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';

interface CurrentLocationInputProps {
  onFinishGetLocation: (location: string) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  customText?: string;
  noIcon?: boolean;
}

const CurrentLocationInput = ({
  onFinishGetLocation,
  style,
  textStyle,
  customText,
  noIcon,
}: CurrentLocationInputProps): React.ReactElement => {
  const id = useSelector((state) => getId(state));
  const token = useSelector((state) => getStoreToken(state));

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        const { coords } = info;
        const lat: string = coords.latitude.toString();
        const lng: string = coords.longitude.toString();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
            lat,
            lng,
          },
        };

        Axios.get(`${getApiUrl()}/user/places/location`, config)
          .then((resp) => {
            const location = resp.data?.data?.results?.[0]?.formatted_address;

            onFinishGetLocation(location);
          })
          .catch((err) => {
            Toast.show({
              text1: 'Error retrieving your location',
              type: 'error',
              position: 'bottom',
            });
          });
      },
      (error: GeolocationError) => {
        Toast.show({
          text1: 'Error retrieving your location',
          type: 'error',
          position: 'bottom',
        });
      },
      { timeout: 1000 },
    );
  };

  return (
    <TouchableOpacity onPress={fetchLocation} style={styles.container}>
      <View style={[styles.content, style]}>
        {noIcon ? null : <Icon name="send" size={24} style={styles.icon} />}
        <Text style={[styles.text, textStyle]}>
          {customText || 'CURRENT LOCATION'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStylesheet.create({
  container: {
    flexGrow: 1,
    height: '3rem',
  },
  content: {
    flexDirection: 'row',
    height: '4rem',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1.5rem',
  },
  text: {
    fontSize: '$fontMd',
    color: '$raspberry',
    letterSpacing: 3,
    fontWeight: '500',
    marginHorizontal: '1rem',
  },
  icon: {
    fontWeight: '400',
    color: '$raspberry',
  },
});

export default CurrentLocationInput;
