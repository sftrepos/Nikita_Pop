import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph, Title2 } from '../../components/Text';
import ActionButton from 'components/Buttons/ActionButton';
import MarkerIcon from '../../../assets/MapImage/Marker.png';
import PhysicalIcon from '../../../assets/MapImage/Physical.png';
import StudyIcon from '../../../assets/MapImage/Study.png';
import TopicIcon from '../../../assets/MapImage/Topic.png';
import AddEmojiIcon from '../../../assets/MapImage/emoji.png';

const Mood = [
  {
    icon: MarkerIcon,
    title: 'Graba Bite',
  },
  {
    icon: PhysicalIcon,
    title: 'Physical Activity',
  },
  {
    icon: StudyIcon,
    title: 'Study Buddy',
  },
  {
    icon: TopicIcon,
    title: 'Topic Convo',
  },
  {
    icon: AddEmojiIcon,
    title: 'Custom Mood',
    text: 'add emoji',
  },
];
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

const MoodData: IData = {
  title: 'Choose your Mood',
  prompt:
    'What are you up to at the moment? This will be a reference point shared with nearby users. ',
};

type SelectModeModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const SelectModeModal: React.FC<SelectModeModalProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('60%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');

  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('70%');
      setModalTopMargin('10%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('60%');
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
        <SelectModeScreen onClose={props.onClose} />
      </Modal>
    </View>
  );
};
interface SelectModeScreen {
  onClose: () => void;
  onPressBlock?: () => void;
  onPressReport?: () => void;
}
const SelectModeScreen = React.memo((props: SelectModeScreen) => {
  const { onClose } = props;
  const { colors } = useTheme();
  const [activeItem, setActiveItem] = useState(null);

  const selectMood = () => {
    return Mood.map((mood, i) => (
      <TouchableOpacity
        style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => setActiveItem(i)}>
        <View
          style={{
            height: 50,
            width: 50,
            backgroundColor: 'white',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: activeItem === i ? '#00B9DE' : 'gray',
          }}>
          {mood.text ? (
            <Text style={{ textAlign: 'center', color: '#999999' }}>
              {mood.text}
            </Text>
          ) : (
            <Image source={mood.icon} style={{ width: 30, height: 30 }} />
          )}
        </View>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: activeItem === i ? '#00B9DE' : 'gray',
            }}>
            {mood.title}{' '}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };
  return (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {MoodData.title}
      </Title2>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {selectMood()}
      </View>
      <Paragraph color={colors.black} style={styles.userParagraph}>
        {MoodData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => console.log('press')}
          gradient
          label="CONFIRM"
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="NOT NOW "
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});
export default SelectModeModal;
