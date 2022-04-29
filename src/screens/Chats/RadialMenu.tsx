import React, { useState } from 'react';
import { Image, Share } from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import EStyleSheet from 'react-native-extended-stylesheet';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import useAnalytics from 'util/analytics/useAnalytics';

interface IRadialMenu {
  isPopin: boolean;
  navigation: any;
  onPress: () => void;
  toggleButtons: () => void;
  onLongPress: () => void;
  actionButtonRef: React.MutableRefObject<any>;
  position: 'left' | 'right';
  optionModal: () => void;
  inviteModal: () => void;
  locked: boolean;
  inviteLocked: boolean;
}

const RadialMenu = ({
  isPopin,
  navigation,
  onPress,
  toggleButtons,
  onLongPress,
  actionButtonRef,
  position,
  optionModal,
  inviteModal,
  locked,
  inviteLocked,
}: IRadialMenu): React.ReactElement => {
  const { colors } = useTheme();
  const analytics = useAnalytics();
  const inviteLink = useSelector((state) => state.chats.inviteLink);

  const sendbirdId = useSelector((state) => state.popin.sendbirdId);

  if (isPopin) {
    return (
      <ActionButton
        ref={actionButtonRef}
        onLongPress={() => {
          onLongPress && onLongPress();
        }}
        onPress={() => {
          onPress && onPress();
        }}
        onOverlayPress={() => {
          toggleButtons();
        }}
        radius={100}
        position={position}
        buttonColor={colors.primary}
        btnOutRange={colors.gray}
        size={45}>
        <ActionButton.Item
          buttonColor={colors.primary}
          size={45}
          title="New Task"
          onPress={() => {
            analytics.logEvent(
              {
                name: 'MESSASGES SCREEN POP-IN DETAILS OPEN',
                data: { chatId: sendbirdId, buttonLocation: 'radialButton' },
              },
              true,
            );
            navigation.navigate('POPIN_DETAILS_SCREEN');
            toggleButtons();
          }}>
          <Image
            source={require('assets/icons/popicon.png')}
            style={[styles.actionButtonIcon, { height: 27 }]}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={locked ? colors.gray : colors.primary}
          size={45}
          title="Notifications"
          onPress={() => {
            analytics.logEvent(
              {
                name: 'MESSASGES SCREEN INVITE MODAL OPEN',
                data: { chatId: sendbirdId },
              },
              true,
            );
            toggleButtons();
            !inviteLocked && inviteModal();
          }}>
          <MCIcon name="email-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={colors.primary}
          size={45}
          title="All Tasks"
          onPress={() => {
            analytics.logEvent(
              {
                name: 'MESSASGES SCREEN SHARE MODAL OPEN',
                data: { chatId: sendbirdId },
              },
              true,
            );
            toggleButtons();
            Share.share({
              message: (
                'Check out this Pop-In I’m heading to! Wanna come with? \n \n' +
                inviteLink
              ).replace(/['"]+/g, ''),
            })
              .then((result) => console.log(result))
              .catch((errorMsg) => console.log(errorMsg));
          }}>
          <MaterialIcon name="ios-share" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={colors.primary}
          size={45}
          title="All Tasks"
          onPress={() => {
            analytics.logEvent(
              {
                name: 'MESSASGES SCREEN OTHER MENU OPEN',
                data: { chatId: sendbirdId },
              },
              true,
            );
            toggleButtons();
            optionModal();
          }}>
          <MCIcon name="dots-horizontal" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  } else {
    return (
      <ActionButton
        ref={actionButtonRef}
        onLongPress={() => {
          onLongPress && onLongPress();
        }}
        onPress={() => {
          onPress && onPress();
        }}
        onOverlayPress={() => {
          toggleButtons();
        }}
        radius={80}
        position={position}
        buttonColor={colors.primary}
        btnOutRange={colors.gray}
        size={45}>
        <ActionButton.Item
          buttonColor={locked ? colors.gray : colors.primary}
          size={45}
          title="Notifications"
          onPress={() => {
            toggleButtons();
            !locked && inviteModal();
          }}>
          <MCIcon name="email-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={colors.primary}
          size={45}
          title="All Tasks"
          onPress={() => {
            toggleButtons();
            Share.share({
              message: (
                'Check out this Pop-In I’m heading to! Wanna come with? \n \n' +
                inviteLink
              ).replace(/['"]+/g, ''),
            })
              .then((result) => console.log(result))
              .catch((errorMsg) => console.log(errorMsg));
          }}>
          <MaterialIcon name="ios-share" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={colors.primary}
          size={45}
          title="All Tasks"
          onPress={() => {
            toggleButtons();
            optionModal();
          }}>
          <MCIcon name="dots-horizontal" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
};

const styles = EStyleSheet.create({
  actionButtonIcon: {
    fontSize: 27,
    height: 30,
    color: 'white',
  },
});

export default RadialMenu;
