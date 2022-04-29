import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';

import { useDispatch, useSelector } from 'react-redux';
import { acceptRequest, rejectRequest } from 'features/Request/RequestActions';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import { Title } from '../Text';
import WidgetDisplay from '../Widgets/WidgetDisplay';
import ActionButton from 'components/Buttons/ActionButton';
import { getAvatar } from 'util/selectors';
import { useNavigation, useTheme } from '@react-navigation/native';
import { getChats } from 'features/Chat/ChatActions';
import { updateProfile } from 'features/User/UserActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UniversityData } from 'services/types';

interface RequestModalProps {
  card: any;
  message: string;
  username: string;
  hometown: string;
  visible: boolean;
  university: UniversityData;
  avatar: Object;
  showHide: () => void;
  requesterId: string;
  fake?: boolean;
}

const RequestModal = ({
  id,
  card,
  message,
  username,
  hometown,
  visible,
  university,
  avatar,
  showHide,
  requesterId,
  fake,
}: RequestModalProps): React.ReactElement => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const acceptReq = () => dispatch(acceptRequest(requesterId));
  const rejectReq = () => dispatch(rejectRequest(requesterId));
  const nav = useNavigation();
  const refreshChats = () => dispatch(getChats(15));
  const updateUser = (data) => dispatch(updateProfile(data));
  const isLoading: boolean = useSelector(
    (state: boolean) => state.requests.acceptingRequest[requesterId],
  );
  const failed: boolean =
    useSelector(
      (state): boolean => state.requests.failedRequest[requesterId],
    ) || false;
  const [declineTap, setDeclineTap] = useState<boolean>(false);
  const success: boolean =
    useSelector(
      (state): boolean => state.requests.successfulRequest[requesterId],
    ) || false;
  const ownAvatar = useSelector((state) => getAvatar(state));

  const handleDecline = () => {
    if (!declineTap) {
      setDeclineTap(true);
    } else {
      rejectReq();
      setDeclineTap(false);
      showHide();
    }
  };

  const handleAccept = () => {
    acceptReq();
    setTimeout(() => refreshChats(), 1000);
  };

  const handleGoChat = () => {
    showHide();
    navigation.navigate('CHATS_SCREEN');
  };

  const startIntercom = () => {
    updateUser({ meta: { tutorialStage: 6 } });
    showHide();
    setTimeout(() => nav.navigate('CHATS_SCREEN'), 500);
  };

  const { colors } = useTheme();

  return (
    <Modal isVisible={visible} hasBackdrop onBackdropPress={showHide}>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {!success ? (
          <>
            <Image
              source={{
                uri:
                  'https://storage.googleapis.com/background_v1/' +
                  card.background,
              }}
              style={styles.imageBackground}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}>
              <View style={styles.messageContainer}>
                <Text>{message || 'Wants to meet!'}</Text>
              </View>
              <View style={styles.userContainer}>
                <CustomAvatar scale={0.5} {...avatar} />
                <View style={styles.infoStack}>
                  <Title color={colors.text}>{username}</Title>
                  <Text style={styles.infoText}>{university.name}</Text>
                  <Text style={styles.infoText}>{hometown}</Text>
                </View>
              </View>
              {card.widgets.map((widget) => (
                <WidgetDisplay widget={widget} />
              ))}
              {failed && !isLoading && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    An error occurred, try again!
                  </Text>
                </View>
              )}
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.buttonRow}>
                  {!fake ? (
                    <>
                      <View style={[styles.button]}>
                        <ActionButton
                          containerStyle={[
                            styles.containerButton,
                            styles.containerButtonDecline,
                          ]}
                          // loading={isLoading}
                          // type={type}
                          // disabled={disabled}
                          // onPress={onPress}
                          label={
                            declineTap ? 'Tap Again to Decline' : 'Decline'
                          }
                          onPress={handleDecline}
                        />
                      </View>
                      <View style={[styles.button]}>
                        <ActionButton
                          containerStyle={styles.containerButton}
                          // loading={isLoading}
                          // type={type}
                          // disabled={disabled}
                          // onPress={onPress}
                          label={'Accept'}
                          onPress={handleAccept}
                        />
                      </View>
                    </>
                  ) : (
                    <View style={[styles.button]}>
                      <ActionButton
                        containerStyle={styles.containerButton}
                        // loading={isLoading}
                        // type={type}
                        // disabled={disabled}
                        // onPress={onPress}
                        label={`Let's go!`}
                        onPress={startIntercom}
                      />
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </>
        ) : (
          <>
            <Image
              source={{
                uri:
                  'https://storage.googleapis.com/background_v1/' +
                  card.background,
              }}
              style={styles.imageBackground}
            />
            <View style={styles.titleContainer}>
              <Title color={colors.text} style={{ textAlign: 'center' }}>
                It's a Match!
              </Title>
            </View>
            <View style={styles.avatars}>
              <CustomAvatar scale={0.75} {...ownAvatar} />
              <CustomAvatar scale={0.75} {...avatar} />
            </View>
            <ActionButton label="Chat" onPress={handleGoChat} />
          </>
        )}
      </View>
      <Icon
        name="close"
        size={32}
        color={colors.text}
        onPress={showHide}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: 10,
        }}
      />
    </Modal>
  );
};

const styles = EStylesheet.create({
  listItem: {
    paddingVertical: '1 rem',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '1 rem',
  },
  messageContainer: {
    backgroundColor: '$raspberry20',
    height: '5rem',
    borderRadius: 20,
    padding: '1rem',
    borderBottomLeftRadius: 0,
  },
  wrapperListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '.5rem',
  },
  containerTimeStamp: {
    alignSelf: 'flex-start',
  },
  containerCenter: {
    flex: 2,
    paddingLeft: '1 rem',
  },
  containerAction: {
    paddingBottom: '1 rem',
  },
  button: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerButton: {
    paddingHorizontal: '1 rem',
  },
  containerButtonDecline: {
    backgroundColor: '$watermelon',
  },
  modalContainer: {
    minHeight: '30rem',
    paddingHorizontal: '1.5rem',
    borderRadius: 25,
    overflow: 'hidden',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '1rem',
  },
  scrollContainer: {
    paddingVertical: '1.5rem',
  },
  infoStack: {
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '.5rem',
    marginLeft: '.5rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 1,
  },
  infoText: {
    fontSize: '$fontSm',
    color: '$grey2',
  },
  imageBackground: {
    position: 'absolute',
    width: '25rem',
    height: '15rem',
    flexGrow: 1,
  },
  errorContainer: {
    borderColor: '$watermelon',
    borderWidth: 1,
    padding: '0.25rem',
    borderRadius: '1rem',
    marginVertical: '0.5rem',
  },
  errorText: {
    textAlign: 'center',
  },
  avatars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '1rem',
    marginBottom: '5rem',
  },
  titleContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '.5rem',
    marginLeft: '.5rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 1,
  },
});

export default RequestModal;
