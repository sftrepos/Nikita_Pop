import React, { ReactElement, useEffect, useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { useDispatch } from 'react-redux';
import useAnalytics from 'util/analytics/useAnalytics';
import { PopApi } from 'services/api';
import store from 'store/index';
import { getStoreToken } from 'util/selectors';
import { Paragraph, Title2 } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setIsVaccinated,
  setVacciantedModalSeen,
} from 'features/User/UserActions';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
    r3: '3rem',
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
  id: string;
  isVisible: boolean;
  onClose: (newState: boolean) => void;
  state: boolean;
  isEditingProfile?: boolean;
}

const EditVaccineModal = ({
  id,
  onClose,
  isVisible,
  state,
  isEditingProfile,
}: IEditVaccineModal): ReactElement => {
  const analytics = useAnalytics();

  const hideModal = (newState: boolean) => {
    analytics.logEvent(
      {
        name: 'EDIT VACCINATED MODAL CLOSE',
        data: { userId: id },
      },
      true,
    );
    onClose(newState);
  };

  return (
    <View style={styles.modalContainer}>
      <Modal
        style={[styles.modalStyle]}
        onBackButtonPress={() => hideModal(state)}
        onBackdropPress={() => hideModal(state)}
        isVisible={isVisible}>
        <EditVaccineScreen
          id={id}
          onClose={hideModal}
          state={state}
          isEditingProfile={isEditingProfile}
        />
      </Modal>
    </View>
  );
};

interface IEditVaccineScreen {
  id: string;
  onClose: (newState: boolean) => void;
  state: boolean;
  isEditingProfile?: boolean;
}
const EditVaccineScreen = React.memo(
  ({ id, onClose, state, isEditingProfile }: IEditVaccineScreen) => {
    const { colors } = useTheme();

    const data = {
      title: 'By chance, are you vaccinated?',
      description:
        'Share this status to give others a piece of mind when hanging in-person. You can see other people’s self-reported vaccination statuses too!',
      footerDescription: 'You can always edit this in your profile',
    };

    const analytics = useAnalytics();
    const dispatch = useDispatch();
    const token = getStoreToken(store.getState());
    const apiHeader = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    useEffect(() => {
      if (!isEditingProfile) {
        // if shown by automatic intial modal
        // update DB to not show next time
        // request will always set the flag to true
        PopApi.updateVaccinatedModalSeen(
          {
            id: id,
          },
          apiHeader,
        )
          .then((res) => {
            // maybe we don't need redux store on this one
            dispatch(setVacciantedModalSeen(true));
            analytics.logEvent(
              {
                name: 'VACCINATED MODAL SEEN',
                data: { userId: id },
              },
              true,
            );
          })
          .catch((err) => {
            Toast.show({
              text1: 'Unable to update Vaccinated Modal Status',
              type: 'error',
              position: 'bottom',
            });
          })
          .finally(() => {});
      }
    }, [isEditingProfile]);

    const updateIsVaccinated = (newState: boolean) => {
      if (state != newState) {
        // newState is different, update DB
        PopApi.updateIsVaccinated(
          {
            id: id,
            isVaccinated: newState,
          },
          apiHeader,
        )
          .then((res) => {
            dispatch(setIsVaccinated(newState));
            analytics.logEvent(
              {
                name: 'VACCINATED MODAL UPDATE',
                data: { userId: id, isVaccinated: newState },
              },
              true,
            );
          })
          .catch((err) => {})
          .finally(() => {
            onClose(newState);
          });
      } else {
        // do nothing if selected state is same as before
        onClose(newState);
      }
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
        <Paragraph color={colors.text} style={styles.paragraph}>
          {data.description}
        </Paragraph>
        {!isEditingProfile && (
          <Paragraph color={colors.text} style={styles.paragraph}>
            {data.footerDescription}
          </Paragraph>
        )}
        <View style={styles.buttonContainer}>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => updateIsVaccinated(true)}
            gradient
            label="YUP"
            textStyle={styles.actionButtonTextStyle}
          />
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            type={'outline'}
            onPress={() => updateIsVaccinated(false)}
            label="NOPE"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
        </View>
      </View>
    );
  },
);

export default EditVaccineModal;
