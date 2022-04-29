import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Title3 } from '../Text';
import ActionButton from 'components/Buttons/ActionButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthAPI } from 'services/api';
import { useSelector } from 'react-redux';
import { getId } from 'util/selectors';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  modalContainer: {},
  containerStyle: {
    justifyContent: 'space-between',
  },
  modalStyle: {
    justifyContent: 'space-between',
  },
  textInput: {
    padding: '0.65rem',
    marginHorizontal: '0.1rem',
    borderRadius: 25,
    marginBottom: 15,
  },
  titleStyle: {
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '$grey2',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  title3Style: {
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Lato',
    fontSize: 20,
  },
});
interface IData {
  title: string;
  prompt: string;
}

type ReportModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onPresSend: () => void;
};

const ReportModal: React.FC<ReportModalProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('70%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');
  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('70%');
      setModalTopMargin('10%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('40%');
      setModalTopMargin('25%');
    }
  }, [viewHeight]);
  return (
    <View style={styles.MainContainer}>
      <Modal
        style={[
          styles.modalStyle,
          {
            top: modalTopMargin,
            maxHeight: modalMaxHeight,
          },
        ]}
        isVisible={props.isVisible}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={'height'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}>
          <View
            style={{
              // flex: 0.5,
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 25,
              bottom: 0,
            }}>
            <ReportScreen
              onClose={props.onClose}
              onPressSend={props.onPresSend}
            />
          </View>
        </KeyboardAvoidingView>
        <View
          style={{
            flex: 0.1,
          }}></View>
      </Modal>
    </View>
  );
};

interface IReportScreen {
  onClose: () => void;
  onPressSend?: () => void;
}

const ReportScreen = React.memo((props: IReportScreen) => {
  const { colors } = useTheme();
  const subject = 'Pop-In';
  const textInputRef = useRef<RNTextInput>(null);
  const [description, setDescription] = useState('');
  const id = useSelector(getId);
  const postFeedback = () => {
    AuthAPI.postFeedback({
      id,
      data: {
        subject,
        details: description,
      },
    })
      .then((data) => {
        if (data) {
          Toast.show({
            text1: `Thank you for your feedback!`,
            text2: 'We appreciate your help in making Pop-Ins better!',
            type: 'success',
            position: 'bottom',
          });
          props.onClose();
        }
      })
      .catch((err) => {
        props.onClose();
        console.info('SEND_FEEDBACK_ERR', err);
        Toast.show({
          text1: `An error occurred sending feedback`,
          type: 'error',
          position: 'bottom',
        });
      });
  };
  return (
    <View style={styles.containerStyle}>
      <View
        style={{ flexDirection: 'row', marginVertical: 15, paddingLeft: 2 }}>
        <Title3 style={styles.title3Style} color={colors.text}>
          Feedback
        </Title3>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={props.onClose}>
          <Icon
            name="ios-close-outline"
            size={25}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
      </View>
      <RNTextInput
        ref={textInputRef}
        multiline={true}
        style={[
          styles.textInput,
          {
            backgroundColor: '#F8FAFA',
            color: 'gray',
            borderColor: '#C4C4C4',
            borderWidth: 1,
            borderRadius: 10,
            height: 150,
            textAlignVertical: 'top',
          },
        ]}
        returnKeyType="done"
        placeholder={
          "How can we make Pop-in better? \nWe'd love to hear your thoughts!"
        }
        value={description}
        onChangeText={setDescription}></RNTextInput>

      <ActionButton
        containerStyle={styles.actionButtonStyles}
        onPress={() => {
          props.onPressSend;
          if (description.length) {
            postFeedback();
          } else {
            Toast.show({
              text1: 'Please complete field.',
              type: 'error',
              position: 'bottom',
            });
          }
        }}
        gradient
        label="SEND"
        textStyle={styles.actionButtonTextStyle}
      />
    </View>
  );
});
export default ReportModal;
