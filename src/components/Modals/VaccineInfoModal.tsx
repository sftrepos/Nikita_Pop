import React, { ReactElement, useEffect, useState } from 'react';
import { PixelRatio, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import useAnalytics from 'util/analytics/useAnalytics';
import { PopApi } from 'services/api';
import { getIsVaccinated, getVaccinePopUpSeen } from 'util/selectors';
import store from 'store/index';
import { getStoreToken } from 'util/selectors';
import { Paragraph, Title2 } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
    r3: '3rem',
    raspberry: '$raspberry',
  },
  containerStyle: {
    backgroundColor: '$white',
    borderRadius: 25,
    padding: '2rem',
  },
  titleStyle: {
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    marginBottom: '1rem',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: '1rem',
  },
  actionButtonStyles: {
    alignSelf: 'center',
    height: '2.5 rem',
    width: '100%',
    marginBottom: '.5rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  paragraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '$fontSm',
    marginBottom: '1rem',
  },
});

interface IEditVaccineModal {
  username: string;
  isVisible: boolean;
  onClose: () => void;
}

const VaccineInfoModal = ({
  username,
  onClose,
  isVisible,
}: IEditVaccineModal): ReactElement => {
  const analytics = useAnalytics();

  const hideModal = () => {
    analytics.logEvent(
      {
        name: 'VACCINE INFO MODAL',
      },
      true,
    );
    onClose();
  };

  return (
    <View style={styles.modalContainer}>
      <Modal
        style={[styles.modalStyle]}
        onBackButtonPress={hideModal}
        onBackdropPress={() => hideModal()}
        isVisible={isVisible}>
        <VaccineInfoScreen username={username} onClose={hideModal} />
      </Modal>
    </View>
  );
};

interface IVaccineInfoScreen {
  username: string;
  onClose: () => void;
}
const VaccineInfoScreen = React.memo(
  ({ username, onClose }: IVaccineInfoScreen) => {
    const { colors } = useTheme();

    const data = {
      title: 'Vaccinated',
      description:
        ' has self reported to have been vaccinated. Have fun meeting in person at your own comfort level.',
    };

    return (
      <View style={styles.containerStyle}>
        <Title2 style={styles.titleStyle} color={colors.darkgrey}>
          {data.title}
        </Title2>
        <Icon
          name={'shield-check'}
          color={colors.grapesicle}
          style={styles.icon}
          size={styles._c.r3}
        />
        <Paragraph color={styles._c.raspberry} style={styles.paragraph}>
          {username}
          <Paragraph color={colors.text} style={styles.paragraph}>
            {data.description}
          </Paragraph>
        </Paragraph>
        <View style={styles.buttonContainer}>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={onClose}
            gradient
            label="COOL"
            textStyle={styles.actionButtonTextStyle}
          />
        </View>
      </View>
    );
  },
);

export default VaccineInfoModal;
