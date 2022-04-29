import React, { useState, useEffect, Fragment } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import Modal from 'react-native-modal';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import UserIcon from '../../../assets/MapImage/User.png';
import CheckIcon from '../../../assets/MapImage/Vector.png';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import QuickSendButton from 'components/Buttons/QuickSendButton';
import { ScrollView } from 'react-native-gesture-handler';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import BottomDrawer from 'rn-bottom-drawer';
import { Paragraph, Title, Title3 } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CardImg } from 'components/Card';
const TAB_BAR_HEIGHT = 49;

const styles = EStyleSheet.create({
  _measurements: {
    rem_1: '1rem',
    rem_15: '1.5rem',
  },
  modalContainer: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
  modalStyle: {
    justifyContent: 'space-between',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    borderRadius: 30,
    // padding: 12,
    // margin: 5,
    borderWidth: 1,
  },
  quickSendButton: {
    alignSelf: 'center',
    bottom: '0.6rem', // half the size of QuickSendButton component size
    position: 'absolute',
    zIndex: 100,
    elevation: 110,
  },
  _c: {
    hr: '.5 rem',
    r: '1 rem',
    grey: '$grey5',
  },
  headerBody: {
    alignItems: 'center',
    paddingHorizontal: '.5 rem',
  },
  headerBodyInfo: {
    alignItems: 'center',
    marginVertical: '0.5 rem',
  },
  headerInfoItem: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconView: {
    marginHorizontal: '.4rem',
    alignItems: 'flex-end',
    alignSelf: 'center',
    flex: 1,
  },

  paragraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
    textAlign: 'center',
  },
  img: {
    borderRadius: 0,
    height: '12rem',
  },
});

type UserProfileModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const UserProfileModal: React.FC<UserProfileModalProps> = (props) => {
  const [viewHeight, setViewHeight] = useState(0);

  return (
    <View style={styles.modalContainer}>
      <Modal
        backdropOpacity={0.1}
        style={[styles.modalStyle]}
        isVisible={props.isVisible}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}>
        <TouchableOpacity
          style={{ flex: 1, marginLeft: -20 }}
          onPress={props.onClose}>
          {/* <View style={{ flex: 1, width: '95%' }}> */}
          <BottomDrawer
            style={{}}
            containerHeight={500}
            offset={TAB_BAR_HEIGHT}
            startUp={false}>
            <UserProfileScreen onClose={props.onClose} data={props.data} />
          </BottomDrawer>
          {/* </View> */}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
interface UserProfileScreen {
  onClose: () => void;
  data: any;
}

const UserProfileScreen = React.memo((props: UserProfileScreen) => {
  const { onClose, data } = props;
  const { colors } = useTheme();
  const screenHeight = Dimensions.get('screen').height;
  const headerFontSize = screenHeight < 700 ? styles.miniHeader : {};
  const margin =
    screenHeight < 700
      ? styles._measurements.rem_1 * 0.5
      : styles._measurements.rem_1;

  return (
    <View style={styles.containerStyle}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          paddingLeft: 12,
          alignItems: 'center',
          width: '95%',
        }}>
        <View style={{ flexDirection: 'row', flex: 0.75 }}>
          <Title3 style={styles.textCenter} color={colors.black}>
            {data.username}
          </Title3>
          <Image
            source={CheckIcon}
            style={{ marginLeft: 10, width: 22, height: 27 }}
          />
        </View>
        <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
          <CustomAvatar
            faceType={data.avatar.faceType}
            faceColor={data.avatar.faceColor}
            bubbleColor={data.avatar.bubbleColor}
            scale={0.3}
          />
        </View>
      </View>
      <View style={{ marginTop: 20, flex: 1, paddingBottom: 20 }}>
        {data.interest.length || data.card.widgets?.interests?.length ? (
          <Fragment>
            <WidgetDisplay
              widget={{
                _id: data._id.$oid,
                identityId: data.identityId,
                interests: data.interest
                  ? data.interest
                  : data.card.widgets.interests,
                sequence: 1,
                type: 'interests',
              }}
            />
            <QuickSendButton containerStyle={styles.quickSendButton} />
          </Fragment>
        ) : (
          <View style={[styles.headerBody, {}]}>
            <Title
              style={headerFontSize}
              style={{ alignSelf: 'center', textAlign: 'center' }}
              color={colors.text}>
              {data.university.name}
            </Title>
            {data.university.gradDate && (
              <View style={styles.headerInfoItem}>
                <View style={styles.iconView}>
                  <Icon name="school" size={styles._c.r} color={colors.gray} />
                </View>
                <Paragraph style={styles.paragraph} color={'#8397EA'}>
                  {data.university.gradDate}
                </Paragraph>
                <View style={styles.iconView} />
              </View>
            )}
            <Paragraph style={styles.paragraph} color={colors.darkgrey}>
              {data.university.major}
            </Paragraph>
          </View>
        )}
      </View>
      <CardImg datasrc={data.card.background} style={styles.img} />
    </View>
  );
});
export default UserProfileModal;
