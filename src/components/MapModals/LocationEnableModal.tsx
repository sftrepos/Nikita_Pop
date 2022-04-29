import React, { useState, useEffect } from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  Image,
  PixelRatio,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../Text';
import ActionButton from 'components/Buttons/ActionButton';
import HangOutIcon from '../../../assets/MapImage/HangOut.png';
import { Text } from 'react-native-paper';
import { getDeviceFontSize } from 'util/misc';
import { color } from 'react-native-reanimated';

const styles = EStyleSheet.create({
  _c: {
    r: '1rem',
  },
  modalContainer: {},
  containerStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderRadius: 25,
  },
  titleStyle: {
    //backgroundColor: 'blue',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '#555555',
  },
  userParagraph: {
    fontFamily: 'Inter',
    fontWeight: '300',
    fontSize: '$fontSm',
    color: 'black',
  },
  boldedText: {
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: 'black',
  },
  regularText: {
    fontFamily: 'Inter',
    color: 'black',
  },
  buttonContainer: {
    //backgroundColor: 'red',
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
  textStyle: { fontWeight: 'bold', fontFamily: 'Inter' },
});
interface IData {
  title: string;
  prompt: string;
}

type LocationEnableModelProps = {
  isVisible: boolean;
  onClose: () => void;
};

const LocationEnableData: IData = {
  title: 'Want to Hang Out?',
  prompt:
    'Create or join your activities happening around your campus in real-time!\n\nWho:  You 👈 + other [students? classmates?]\nWhen: Now ⏱️\nWhere: Just around the corner 🏘\nHow: Be safe, wear masks, and have fun!\n\n* Pro Tip: Share your location to get the full experience - personalized, localized Pop-ins by you \n',
};

const LocationEnableModal: React.FC<LocationEnableModelProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('50%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');

  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('70%');
      setModalTopMargin('10%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('50%');
      setModalTopMargin('25%');
    }
  }, []);
  return (
    <View style={styles.modalContainer}>
      <Modal
        style={[
          styles.modalStyle,
          {
            top: modalTopMargin,
            maxHeight: modalMaxHeight,
            //flexWrap: 'wrap',
          },
        ]}
        isVisible={props.isVisible}>
        {/* <TouchableOpacity onPress={()=>{props.onClose
        console.info("info  "+props.onClose)}}></TouchableOpacity> */}
        <LocationEnableScreen
          onClose={props.onClose}
          isLocationPermitted={props.isLocationPermitted}
        />
      </Modal>
    </View>
  );
};
interface LocationEnableScreen {
  onClose: () => void;
  isLocationPermitted: boolean;
  onPressBlock?: () => void;
  onPressReport?: () => void;
}
const LocationEnableScreen = React.memo((props: LocationEnableScreen) => {
  const { onClose, isLocationPermitted } = props;
  const { colors } = useTheme();
  const [descTextSize, setDescTextSize] = useState(styles._c.r);
  const buttonHeight = styles._c.r * PixelRatio.get() * 0.9;
  useEffect(() => {
    setDescTextSize(getDeviceFontSize() * 0.95);
  }, []);
  // maybe implement context later
  return (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle}>{LocationEnableData.title}</Title2>
      <View style={{ alignItems: 'center' }}>
        <Image source={HangOutIcon} style={{ width: 160, height: 150 }} />
      </View>
      <View>
        <Text
          color={colors.text}
          style={[styles.userParagraph, { fontSize: descTextSize }]}>
          Create or join your activities happening around your campus in
          real-time!
        </Text>
        <Text style={[styles.regularText, { fontSize: descTextSize }]}>
          <Text style={styles.boldedText}>{'\n'}Who: </Text>
          You 👈 + other [students? classmates?]
          <Text style={styles.boldedText}>{'\n'}When: </Text>
          Now ⏱️
          <Text style={styles.boldedText}> {'\n'}Where: </Text>
          Just around the corner 🏘
          <Text style={styles.boldedText}>{'\n'}How: </Text>
          Be safe, wear masks, and have fun!
        </Text>
        <Text style={[styles.regularText, { fontSize: descTextSize }]}>
          <Text style={{ color: '#00B9DE', fontFamily: 'Inter' }}>
            {'\n'}*{' '}
          </Text>
          Pro Tip: Share your location to get the full experience -
          personalized, localized Pop-ins near you{'\n'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={[styles.actionButtonStyles, { height: buttonHeight }]}
          //textStyle={{ fontSize: descTextSize }}
          onPress={() => {
            if (!isLocationPermitted) {
              setTimeout(() => {
                Linking.openSettings();
              }, 500);
            }
            onClose();
          }}
          gradient
          label="SHARE LOCATION & HANG"
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={[styles.actionButtonStyles, { height: buttonHeight }]}
          //textStyle={{ fontSize: descTextSize }}
          onPress={() => {
            onClose();
          }}
          label="JUST VIEW FOR NOW "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default LocationEnableModal;
