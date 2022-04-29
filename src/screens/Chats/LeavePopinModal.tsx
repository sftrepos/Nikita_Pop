import React from 'react';
import { Image, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { Title2 } from 'components/Text';
import { Paragraph } from 'components/Text';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GroupChannel } from 'sendbird';
import { PopApi } from 'services';
import routes from 'nav/routes';
import { getId, getStoreToken } from 'util/selectors';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

type TLeavePopinModal = {
  close: () => void;
  navigation: any;
  leaveChannel: () => void;
};

const LeavePopinModal = ({
  close,
  navigation,
  leaveChannel,
}: TLeavePopinModal) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={[styles.modalStyle, { backgroundColor: colors.card }]}>
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={colors.black}>
            Leave Pop-in?
          </Title2>
          <Image
            style={styles.icon}
            source={require('assets/icons/leaveIcon.png')}
          />
          <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
            We won’t notify the Pop-In host or members you submitted this
            report. If you believe someone is in immediate danger, call local
            emergency services.
          </Paragraph>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => {
                leaveChannel();
                close();
              }}
              gradient
              label={'Leave Pop-in'}
              textStyle={styles.actionButtonTextStyle}
            />
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => close()}
              label="Take me back"
              textStyle={[
                styles.actionButtonTextStyle,
                { color: colors.primary },
              ]}
            />
          </View>
        </View>
      </View>
      <Pressable
        style={{ height: Dimensions.get('screen').height }}
        onPress={close}
      />
    </>
  );
};

const styles = EStyleSheet.create({
  container: {
    height: Dimensions.get('screen').height,
  },
  modal: {
    margin: '1rem',
    height: Dimensions.get('screen').height * 0.4,
    borderRadius: 25,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    margin: '1rem',
    // height: Dimensions.get('screen').height * 0.4,
    padding: '1.5rem',
    borderRadius: 25,
    flex: 1,
  },
  titleStyle: {
    paddingHorizontal: '.5rem',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '$grey2',
  },
  reportBlockParagraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
    marginVertical: '1.5rem',
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
  icon: {
    alignSelf: 'center',
    marginTop: '1.5rem',
  },
});

export default LeavePopinModal;
