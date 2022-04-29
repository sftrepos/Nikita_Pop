import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../Text';
import ActionButton from 'components/Buttons/ActionButton';
import FarIcon from '../../../assets/MapImage/Far.png';
import UserDetailsModel from '../../components/MapModals/UserDetailsModel';
import { StringLocale } from 'yup';

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
    color: '#555555',
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
    height: '2.5rem',
    width: '100%',
    paddingHorizontal: '1 rem',
    marginBottom: '0rem',
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

const FarWarningData: IData = {
  title: 'It’s Kinda Far',
  prompt: `Pop-Ins are about spontaneous, local activities. To make the most out of them, we recommend picking Pop-Ins closer to you.`,
};

const CreateFarWarningData: IData = {
  title: 'It’s Kinda Far',
  prompt: `Pop-Ins are about spontaneous, local activities. To make the most out of them, we recommend picking Pop-Ins closer to you.`,
};

type FarWarningModelProps = {
  isVisible: boolean;
  onClose: () => void;
  data: any;
  type: string;
  onJoinPress: () => void;
};

const FarWarningModel: React.FC<FarWarningModelProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('40%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');

  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('60%');
      setModalTopMargin('10%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('50%');
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
        <FarWarningScreen
          onClose={props.onClose}
          data={props.data}
          type={props.type}
          onJoinPress={props.onJoinPress}
        />
      </Modal>
    </View>
  );
};
interface FarWarningScreen {
  onClose: () => void;
  onPressBlock?: () => void;
  onPressReport?: () => void;
  data: any;
  type: string;
  onJoinPress: () => void;
}
const FarWarningScreen = React.memo((props: FarWarningScreen) => {
  const { onClose, onJoinPress, type } = props;
  const { colors } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  // maybe implement context later

  return (
    <View style={styles.containerStyle}>
      {/* <UserDetailsModel
                data={props.data}
                isVisible={isModalVisible}
                onClose={() => {
                    onClose()
                    setModalVisible(false)
                }
                }
            /> */}
      <Title2 style={styles.titleStyle}>{FarWarningData.title}</Title2>
      <View style={{ alignItems: 'center' }}>
        <Image source={FarIcon} style={{ width: 40, height: 40 }} />
      </View>
      <Paragraph color={colors.black} style={styles.userParagraph}>
        {FarWarningData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => {
            onJoinPress();
          }}
          gradient
          label={type == 'create' ? 'CREATE ANYWAYS ' : 'JOIN ANYWAYS'}
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="EXPLORE CLOSER TO ME "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default FarWarningModel;
