import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../../components/Text';
import ActionButton from 'components/Buttons/ActionButton';
import BetaIcon from '../../../assets/MapImage/Beta.png';
import { getDeviceFontSize } from 'util/misc';
import { PixelRatio } from 'react-native';

const styles = EStyleSheet.create({
  _c: {
    r: '1rem',
  },
  modalContainer: {},
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    width: '3.5rem',
    height: '3.5rem',
  },
  modalStyle: {
    backgroundColor: '$white',
    padding: '1.5rem',
    borderRadius: 25,
    justifyContent: 'space-between',
  },
  titleStyle: {
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '700',
    color: '#555555',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
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

const BetaData: IData = {
  title: '"Pop-in" is in Beta',
  prompt:
    'Welcome! You’re one of the first to use our Pop-in feature and experience the Beta.\n\nPop-ins make it easy for you and the people around you to spontaneously meet-up. Create or share activities that vibe with you!\n\nThat being said, we’re not perfect yet. If you have any feedback to share with the team, we’re all ears!  ',
};

type GoPopInBetaModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onGoFeedback: () => void;
};

const GoPopInBetaModal: React.FC<GoPopInBetaModalProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('50%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');
  const [isVisible, setIsVisible] = useState(props.isVisible);

  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('50%');
      setModalTopMargin('15%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('40%');
      setModalTopMargin('25%');
    }
    setIsVisible(props.isVisible);
  }, [viewHeight]);

  return (
    <View style={styles.modalContainer}>
      <Modal
        style={[
          styles.modalStyle,
          {
            top: modalTopMargin,
            maxHeight: modalMaxHeight,
            //  flexWrap: 'wrap',
          },
        ]}
        onBackdropPress={props.onClose}
        isVisible={props.isVisible}>
        <TouchableOpacity
          onPress={() => {
            props.onClose;
          }}></TouchableOpacity>
        <GoPopInBetaScreen
          onClose={props.onClose}
          onGoFeedBack={props.onGoFeedback}
        />
      </Modal>
    </View>
  );
};
interface IGoPopInBetaScreen {
  onClose: () => void;
  onGoFeedBack: () => void;
}
const GoPopInBetaScreen = React.memo((props: IGoPopInBetaScreen) => {
  const { onClose, onGoFeedBack } = props;
  const { colors } = useTheme();
  const [descTextSize, setDescTextSize] = useState(styles._c.r);
  const [textOpacity, setTextOpactiy] = useState(0);
  const buttonHeight = styles._c.r * PixelRatio.get() * 0.8;
  useEffect(() => {
    setDescTextSize(getDeviceFontSize() * 0.9);
    setTextOpactiy(1);
  }, []);

  return (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {BetaData.title}
      </Title2>
      <View
        style={{
          alignItems: 'center',
          height: styles._c.r * 4,
        }}>
        <Image source={BetaIcon} style={styles.image} />
      </View>
      <Paragraph
        color={colors.black}
        style={[styles.userParagraph, { fontSize: descTextSize }]}>
        {BetaData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={[styles.actionButtonStyles, { height: buttonHeight }]}
          onPress={() => {
            onClose();
          }}
          gradient
          label="COOL"
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={[styles.actionButtonStyles, { height: buttonHeight }]}
          onPress={() => {
            onClose();
            setTimeout(() => {
              onGoFeedBack();
            }, 500);
          }}
          label="SHARE YOUR FEEDBACK "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default GoPopInBetaModal;
