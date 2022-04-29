import React, { useState } from 'react';
import { Image, Pressable, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { Title2 } from 'components/Text';
import { Paragraph } from 'components/Text';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GroupChannel } from 'sendbird';

type TLockModal = {
  channel: GroupChannel;
  close: () => void;
  lock: () => void;
  unlock: () => void;
  locked: boolean;
  isHost: boolean;
};

const LockModal = ({
  channel,
  close,
  lock,
  unlock,
  locked,
  isHost,
}: TLockModal) => {
  const { colors } = useTheme();
  Keyboard.dismiss();
  const Lock = () => {
    if (isHost) {
      return (
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={colors.black}>
            Lock Pop-in
          </Title2>
          <Image
            style={styles.icon}
            source={require('assets/icons/lockIcon.png')}
          />
          <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
            Members can still chat, but no one new will be allowed to join until
            you open the Pop-In again.
          </Paragraph>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => {
                lock();
                close();
              }}
              gradient
              label="Lock"
              textStyle={styles.actionButtonTextStyle}
            />
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => close()}
              label="Cancel"
              textStyle={[
                styles.actionButtonTextStyle,
                { color: colors.primary },
              ]}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={colors.black}>
            Pop-in is Open
          </Title2>
          <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
            Currently anyone can join this Pop-In. You can ask the host if you’d
            like the Pop-In to be locked.
          </Paragraph>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={[
                styles.actionButtonStyles,
                { borderWidth: 1, borderColor: colors.primary },
              ]}
              onPress={() => close()}
              label="Got it"
              textStyle={[
                styles.actionButtonTextStyle,
                { color: colors.primary },
              ]}
            />
          </View>
        </View>
      );
    }
  };

  const Unlock = () => {
    if (isHost) {
      return (
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={colors.black}>
            Open Pop-in
          </Title2>
          <Image
            style={styles.icon}
            source={require('assets/icons/lockOpenIcon.png')}
          />
          <Paragraph
            color={colors.darkgrey}
            style={styles.reportBlockParagraph}>
            Any active user in your area will be able to join your Pop-In once
            you open.
          </Paragraph>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => {
                unlock();
                close();
              }}
              gradient
              label="Open"
              textStyle={styles.actionButtonTextStyle}
            />
            <ActionButton
              containerStyle={styles.actionButtonStyles}
              onPress={() => close()}
              label="Cancel"
              textStyle={[
                styles.actionButtonTextStyle,
                { color: colors.primary },
              ]}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.containerStyle}>
          <Title2 style={styles.titleStyle} color={colors.black}>
            Pop-in is Locked
          </Title2>
          <Paragraph
            color={colors.darkgrey}
            style={styles.reportBlockParagraph}>
            Currently, no new users can join this Pop-In. You can ask the host
            if you’d like the Pop-In to be opened.
          </Paragraph>
          <View style={styles.buttonContainer}>
            <ActionButton
              containerStyle={[
                styles.actionButtonStyles,
                { borderWidth: 1, borderColor: colors.primary },
              ]}
              onPress={() => close()}
              label="Got it"
              textStyle={[
                styles.actionButtonTextStyle,
                { color: colors.primary },
              ]}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <>
      <View style={[styles.modalStyle, { backgroundColor: colors.card }]}>
        {!locked && <Lock />}
        {locked && <Unlock />}
      </View>
      <Pressable
        style={{ height: Dimensions.get('screen').height }}
        onPress={close}
      />
    </>
  );
};

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
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
    fontSize: '1rem',
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
  descriptionInput: {
    backgroundColor: '$grey5',
    // height: '70%',
    fontSize: '1rem',
    padding: '.5rem',
    borderRadius: 10,
    marginVertical: '1rem',
    minHeight: Dimensions.get('screen').height * 0.1,
    // borderBottomeColor: 'red',
  },
});

export default LockModal;
