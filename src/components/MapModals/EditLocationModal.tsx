import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
  Platform,
  Keyboard,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Title3 } from '../Text';
import ActionButton from 'components/Buttons/ActionButton';
import { isAndroid } from 'util/phone';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    borderTopLeftRadius: '1.25rem',
    borderTopRightRadius: '1.25rem',
    paddingHorizontal: '1.56rem',
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    padding: isAndroid() ? '0.32rem' : '0.65rem',
    marginHorizontal: '0.1rem',
    borderRadius: '1.56rem',
    marginBottom: '1rem',
    paddingHorizontal: '1rem',
    backgroundColor: '#F8FAFA',
    color: 'gray',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    top: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButtonStyles: {
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
    height: '2.5 rem',
    width: '100%',
    paddingHorizontal: '1 rem',
    //marginTop: '1rem',
    marginBottom: '2rem',
  },
  actionButtonStyles2: {
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
    height: '2.5 rem',
    width: '100%',
    paddingHorizontal: '1 rem',
    marginTop: '1rem',
    marginBottom: '2.3rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  bottomText: {
    alignSelf: 'center',
    marginTop: '1 rem',
    marginBottom: 'rem',
    color: 'gray',
    fontWeight: '400',
    fontSize: 12,
  },
});
interface IData {
  title: string;
  prompt: string;
}

type EditLocationModalProps = {
  isVisible: boolean;
  distance: number;
  address: string;
  name: string;
  handleSubmit: (data: any) => void;
};

const EditLocationModal: React.FC<EditLocationModalProps> = (props) => {
  const { distance, name, address, modalUp } = props;
  const { handleSubmit } = props;
  const { colors } = useTheme();
  const [customLocation, setCustomLocation] = useState('');
  const textInputRef = useRef<RNTextInput>(null);
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();

  return (
    <View>
      <View style={styles.mainContainerStyle}>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 25,
          }}>
          {!modalUp && (
            <View>
              <Text style={styles.bottomText}>
                Tap on the map to change location
              </Text>
              <ActionButton
                containerStyle={styles.actionButtonStyles}
                loading={isLoading}
                onPress={() => {
                  analytics.logEvent(
                    {
                      name: 'POP-IN CREATE SCREEN CONFIRM LOCATION',
                      data: { name, address },
                    },
                    true,
                  );
                  setIsLoading(true);
                  handleSubmit({
                    distance,
                    address,
                    name: customLocation != '' ? customLocation : name,
                  });
                }}
                gradient
                label="CONFIRM LOCATION"
                textStyle={styles.actionButtonTextStyle}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Title3 style={styles.textCenter} color={colors.gray}>
              Location address
            </Title3>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingRight: 10,
              marginBottom: 15,
            }}>
            <View
              style={{
                width: 350,
                maxHeight: 150,
                flexDirection: 'row',
                flexGrow: 1,
                flex: 1,
                marginTop: 10,
              }}>
              <Text
                style={{
                  paddingHorizontal: 2,
                  fontSize: 15,
                  color: '000000',
                  flexShrink: 1,
                  fontWeight: '400',
                  // top: 20,
                }}>
                {address != undefined
                  ? address.split(',')[0] +
                    '\n' +
                    address.split(',').slice(1).join(', ').trim()
                  : ''}
              </Text>
              <Title3
                style={{ color: '#00B9DE', fontSize: 12, marginLeft: 'auto' }}>
                {distance == undefined || distance == 0
                  ? 'Your current location'
                  : `${distance} miles from you`}
              </Title3>
            </View>
          </View>
          <Title3
            style={[styles.textCenter, { paddingTop: 5 }]}
            color={colors.gray}>
            Location name
          </Title3>
          <RNTextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              {
                backgroundColor: '#F8FAFA',
                color: '#555555',
                borderColor: '#C4C4C4',
                borderWidth: 1,
                top: 20,
              },
            ]}
            onFocus={() =>
              analytics.logEvent(
                {
                  name: 'POP-IN CREATE SCREEN EDIT LOCATION NAME START',
                  data: {},
                },
                true,
              )
            }
            onEndEditing={() =>
              analytics.logEvent(
                {
                  name: 'POP-IN CREATE SCREEN EDIT LOCATION NAME START',
                  data: {
                    customLocation,
                    name,
                    edited: customLocation == name,
                  },
                },
                true,
              )
            }
            returnKeyType="done"
            placeholder={customLocation != '' ? customLocation : name}
            placeholderTextColor={colors.gray}
            value={customLocation}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleSubmit({
                distance,
                address,
                name: customLocation != '' ? customLocation : name,
              });
            }}
            onChangeText={setCustomLocation}></RNTextInput>
          {modalUp && (
            <ActionButton
              containerStyle={styles.actionButtonStyles2}
              loading={isLoading}
              onPress={() => {
                analytics.logEvent(
                  {
                    name: 'POP-IN CREATE SCREEN CONFIRM LOCATION',
                    data: { name, address },
                  },
                  true,
                );
                setIsLoading(true);
                handleSubmit({
                  distance,
                  address,
                  name: customLocation != '' ? customLocation : name,
                });
              }}
              gradient
              label="CONFIRM LOCATION"
              textStyle={styles.actionButtonTextStyle}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={props.onClose}></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditLocationModal;
