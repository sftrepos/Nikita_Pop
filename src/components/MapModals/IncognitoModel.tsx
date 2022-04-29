import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../../components/Text';
import ActionButton from 'components/Buttons/ActionButton';
import GhostIcon from '../../../assets/MapImage/ghost.png';

const styles = EStyleSheet.create({
  modalContainer: {},
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderRadius: 25,
    flex: 1,
  },
  titleStyle: {
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '$grey2',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '300',
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
});
interface IData {
  title: string;
  prompt: string;
}

const IncognitoData: IData = {
  title: 'Go incognito?',
  prompt:
    'Going incognito would make you invisible to other users online. You can still join pop-ins though!',
};

type GoIncognitoModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onGoIncognito: () => void;
};

const GoIncognitoModal: React.FC<GoIncognitoModalProps> = (props) => {
  //console.log('abc', props);

  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('40%');
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
    <View style={styles.modalContainer}>
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
          const { x, y, width, height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}>
        <TouchableOpacity onPress={props.onClose}></TouchableOpacity>
        <GoIncognitoScreen
          onClose={props.onClose}
          onGoIncognito={props.onGoIncognito}
        />
      </Modal>
    </View>
  );
};
interface IGoIncognitoScreen {
  onClose: () => void;
  onGoIncognito: () => void;
}
const GoIncognitoScreen = React.memo((props: IGoIncognitoScreen) => {
  console.log('props====', props);
  const { onClose, onGoIncognito } = props;
  const { colors } = useTheme();

  return (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {IncognitoData.title}
      </Title2>
      <View style={{ alignItems: 'center' }}>
        <Image source={GhostIcon} style={{ width: 50, height: 60 }} />
      </View>
      <Paragraph color={colors.black} style={styles.userParagraph}>
        {IncognitoData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => {
            onClose();
            onGoIncognito();
          }}
          gradient
          label="GO INCOGNITO"
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="STAY VISIBLE "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default GoIncognitoModal;
