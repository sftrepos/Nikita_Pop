import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../../components/Text';
import ActionButton from 'components/Buttons/ActionButton';
import VisibleIcon from '../../../assets/MapImage/Show.png';

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

const ShowIncognitoData: IData = {
  title: 'Show as visible?',
  prompt:
    'Build up the campus vibe by showing up as online. Other users will more likely invite you to pop-ins and send you chat invites.',
};

type ShowIncognitoModelProps = {
  isVisible: boolean;
  onClose: () => void;
  onShowIncognito: () => void;
};

const ShowIncognitoModel: React.FC<ShowIncognitoModelProps> = (props) => {
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
        <ShowIncognitoScreen
          onClose={props.onClose}
          onShowIncognito={props.onShowIncognito}
        />
      </Modal>
    </View>
  );
};
interface ShowIncognitoScreen {
  onClose: () => void;
  onShowIncognito: () => void;
  onPressReport?: () => void;
}
const ShowIncognitoScreen = React.memo((props: ShowIncognitoScreen) => {
  const { onClose, onShowIncognito } = props;
  const { colors } = useTheme();
  // maybe implement context later
  return (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {ShowIncognitoData.title}
      </Title2>
      <View style={{ alignItems: 'center' }}>
        <Image source={VisibleIcon} style={{ width: 65, height: 45 }} />
      </View>
      <Paragraph color={colors.black} style={styles.userParagraph}>
        {ShowIncognitoData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => {
            onClose();
            onShowIncognito();
          }}
          gradient
          label="SHOW AS VISIBLE"
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="STAY INCOGNITO "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default ShowIncognitoModel;
