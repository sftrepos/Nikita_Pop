import React, { ReactElement, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { WidgetDisplayType } from 'screens/Profile';
import { BrowseCard } from 'services/types';
import { useTheme } from '@react-navigation/native';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import TextInput from 'components/TextInput';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import LagoonGradient from '../../Gradients/LagoonGradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { resetRequests } from 'features/Request/RequestActions';

const styles = EStyleSheet.create({
  centeredView: {
    // position: 'absolute',
    // top: '25%',
    // marginTop: 22,
    // marginHorizontal: 0,
    // maxHeight: '75%',
    marginHorizontal: 30,
  },
  modalView: {
    marginHorizontal: 5,
    marginVertical: 0,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 7,
    paddingTop: 0,
    paddingBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#2FD8DC',
    color: '#2FD8DC',
    borderRadius: 30,
    paddingVertical: '.6rem',
    marginHorizontal: '5.5rem',
    elevation: 2,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  textStyle: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 17,
  },
  modalText: {
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 7,
    paddingBottom: 7,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 0,
    fontSize: '$fontSm',
  },
  majorText: {
    fontSize: 12,
    color: '$grey2',
    marginLeft: 3,
  },
  locationText: {
    fontSize: 12,
    color: '$grey2',
    marginLeft: 3,
  },
  universityText: {
    fontSize: 10,
    color: '#AFAFAF',
    marginLeft: '1rem',
  },
  userContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1rem',
    marginHorizontal: 20,
  },
  infoStack: {
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginLeft: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  widgetStyle: {
    height: '100%',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  universityRow: {
    marginVertical: 3,
  },
  locationRow: {
    flexDirection: 'row',
  },
  widgetContainer: {
    marginBottom: '.25rem',
    maxHeight: '10rem',
    paddingVertical: '.75rem',
  },
  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: '1rem',
    marginHorizontal: '.5rem',
  },
  modal: {
    margin: 0,
  },
  inputContainer: {
    width: '100%',
    maxHeight: '30%',
    '@media (max-width: 400)': {
      maxHeight: '22%',
    },
  },
  contentAwareContainer: {
    marginTop: '2rem',
    borderRadius: 25,
    marginHorizontal: '2rem',
  },
});

interface SendRequestModalProps {
  modalVisible: boolean;
  setModalVisibility: (modalVisible: boolean) => void;
  widget: WidgetDisplayType & { identityId?: string };
  data: BrowseCard;
  sendRequest: (message: string) => void;
  onClose: () => void;
}

const SendRequestModal = ({
  modalVisible,
  sendRequest,
  setModalVisibility,
  widget,
  data,
  onClose,
}: SendRequestModalProps): ReactElement => {
  const { avatar, username, university, hometown } = data;
  const { colors } = useTheme();
  const [conversationInput, setConversationInput] = useState('');
  const isLoading = useSelector((state) => state.requests.isLoading);
  const success = useSelector((state) => state.requests.requestSuccess);
  const failed = useSelector((state) => state.requests.sendRequestFailed);
  const dispatch = useDispatch();

  const doClose = () => {
    setTimeout(() => {
      onClose();
      dispatch(resetRequests());
    }, 1000);
  };

  useEffect(() => {
    if (success) {
      doClose();
    }

    if (failed) {
      doClose();
    }
  }, [success, failed]);

  const onPressSendLikeRequest = () => {
    sendRequest(conversationInput);
  };

  return (
    <SafeAreaView>
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
        onBackdropPress={() => setModalVisibility(false)}
        backdropOpacity={0.5}
        style={styles.modal}
        customBackdrop={Backdrop}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.contentAwareContainer,
            { backgroundColor: colors.card },
          ]}>
          <View style={styles.userContainer}>
            <CustomAvatar scale={0.35} {...avatar} />
            <View style={styles.infoStack}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.text,
                  fontWeight: '700',
                }}>
                {username}
              </Text>
              <View style={styles.universityRow}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="school" color="#AFAFAF" />
                  <Text style={styles.majorText}>{university.major}</Text>
                </View>
                <Text style={styles.universityText}>{university.name}</Text>
              </View>
              <View style={styles.locationRow}>
                <Icon name="map-marker" color="#AFAFAF" />
                <Text style={styles.locationText}>{hometown}</Text>
              </View>
            </View>
          </View>
          {/* body container which holds input and buttons */}
          <View style={styles.bodyContainer}>
            <ScrollView style={styles.widgetContainer}>
              <WidgetDisplay
                style={styles.widgetStyle}
                widget={widget}
                isSendRequestModal={true}
              />
            </ScrollView>
            {/* request comment input */}
            <TextInput
              label="conversation"
              placeholder="Add comment (optional)"
              onChangeText={setConversationInput}
              multiline={true}
              style={styles.modalText}
              returnKeyType="done"
              blurOnSubmit
              placeholderTextColor={'#B2B2B2'}
              numberOfLines={5}
              containerStyle={styles.inputContainer}
            />

            {/* request confirmation */}
            {!!success && (
              <Text
                style={{
                  alignSelf: 'center',
                  color: colors.purple,
                  marginBottom: 16,
                }}>
                Request sent
              </Text>
            )}

            {/* send like button */}
            <TouchableHighlight
              style={{}}
              underlayColor={'white'}
              onPress={onPressSendLikeRequest}>
              <LagoonGradient style={styles.openButton}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.textStyle}>SEND LIKE</Text>
                )}
              </LagoonGradient>
            </TouchableHighlight>

            {/* cancel button */}
            <TouchableHighlight
              underlayColor={'white'}
              style={styles.cancelButton}
              onPress={onClose}>
              <Text style={{ color: '#989898' }}>Cancel</Text>
            </TouchableHighlight>
          </View>
          <View style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}>
            <Icon
              name="close"
              onPress={() => {
                onClose();
              }}
              size={35}
              color={'#989898'}
            />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const Backdrop = () => (
  <BlurView
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      flexGrow: 1,
    }}
    blurRadius={1}
    blurType={'light'}
    // Additional available on Android
    // blurRadius={20}
    // downsampleFactor={10}
    // overlayColor={'rgba(0, 0, 255, .6)'}
  />
);

export default SendRequestModal;
