import React, { ReactElement } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { Paragraph, Title, Title3 } from '../Text';
import { useTheme } from '@react-navigation/native';
import NextButton from 'screens/Register/NextButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigationRef } from 'nav/RootNavigation';
import { useDispatch } from 'react-redux';
import { requestEditRedirect } from 'features/Request/RequestActions';
import { GlobalModalHandler } from './GlobalModal/GlobalModal';

const styles = EStyleSheet.create({
  _vars: {
    padding: '1rem',
  },
  innerModal: {
    minHeight: '20%',
    maxHeight: '95%',
    alignItems: 'center',
    borderRadius: 15,
    padding: '2rem',
  },
  outerModal: {},
  button: {
    paddingHorizontal: '1rem',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    paddingVertical: 3,
    marginBottom: 0,
  },
  prompt: {
    paddingVertical: '1rem',
    textAlign: 'center',
  },
  reportInput: {},
  cancelButton: {
    padding: '1rem',
  },
});

interface IRequestWidgetErrorModal {
  visible: boolean;
  toggle: () => void;
}

const RequestWidgetErrorModal = (
  props: IRequestWidgetErrorModal,
): ReactElement => {
  const { visible, toggle } = props;
  const { colors } = useTheme();
  const dispatch = useDispatch();

  return (
    <View style={styles.outerModal}>
      <Modal onBackdropPress={toggle} isVisible={visible}>
        <View style={[styles.innerModal, { backgroundColor: colors.card }]}>
          <Title color={colors.text}>{'Not Quite Yet'}</Title>
          <Paragraph style={styles.prompt} color={colors.text}>
            {`Share something about yourself!\nAdd at least 2 cards to your profile before sending chat invites.`}
          </Paragraph>

          <NextButton
            noIcon
            style={styles.buttonWrapper}
            containerStyle={[styles.button]}
            label={'ADD TO PROFILE'}
            onPress={() => {
              toggle();
              GlobalModalHandler.hideModal();
              dispatch(requestEditRedirect()); // sets flag which causes Card modal to close itself
              navigationRef.current?.navigate('PROFILE_EDIT_STACK'); // use global navigation to go to profile edit
            }}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={toggle}>
            <Title3 color={colors.primary}>{'LATER'}</Title3>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default RequestWidgetErrorModal;
