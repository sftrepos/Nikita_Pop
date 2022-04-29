import React, { ReactElement, useEffect, useState } from 'react';
import { KeyboardAvoidingView, TextInput, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { Title2 } from '../../Text';
import { useTheme } from '@react-navigation/native';
import { getBlockedUsersList, getId, getStoreToken } from 'util/selectors';
import store from 'store/index';
import ActionButton from 'components/Buttons/ActionButton';
import { blockUser, reportUser } from 'services/sendbird/user';
// import { blockOtherUser } from './BlockUserScreen';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from 'components/Buttons/IconButton';
import { setBlockedUser } from 'features/User/UserActions';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
  },
  titleStyle: {
    paddingHorizontal: '.5rem',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '$grey2',
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
  descriptionInput: {
    backgroundColor: '$grey5',
    // height: '70%',
    fontSize: '1rem',
    padding: '.5rem',
    borderRadius: 10,
    // borderBottomeColor: 'red',
  },
});

interface IData {
  title: string;
  label: string;
  prompt: string;
}

const reportData: IData = {
  title: 'Report',
  prompt: 'Tell us what happened so we can investigate your concerns',
  label: 'report',
};

interface IReportUserScreen {
  isVisible: boolean;
  onBack: () => void;
  onClose: () => void;
  // Standard Mongo DB ID
  otherUserId: string;
  type: string;
  containerStyle?: any;
}

const ReportUserScreen = (props: IReportUserScreen): ReactElement => {
  const { containerStyle, onClose, onBack, isVisible, otherUserId, type } =
    props;
  const {
    colors: { text },
  } = useTheme();
  const analytics = useAnalytics();
  const currentUserId = getId(store.getState());
  const token = getStoreToken(store.getState());
  const [description, setDescription] = useState('');
  const { colors } = useTheme();
  const apiHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const dispatch = useDispatch();

  //
  // API (sendbird)
  //
  const reportOtherUser = () => {
    blockOtherUser();
    const data = {
      id: currentUserId,
      reportedId: otherUserId,
      data: {
        type: type,
        description: description,
      },
    };
    onClose();
    reportUser(data, apiHeader)
      .then((res) => {
        console.log('SUCCESS Reporting User', res);
      })
      .catch((err) => {
        console.log('FAILED Reporting User', err);
      });
    analytics.logEvent(
      { name: 'REPORT USER', data: { userId: otherUserId } },
      true,
    );
  };

  const blockOtherUser = () => {
    const token = getStoreToken(store.getState());
    const apiHeader = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      id: currentUserId,
      blockedUser: otherUserId,
    };
    blockUser(data, apiHeader)
      .then((res) => {
        console.log('SUCCESS Blocking User', res);
        dispatch(setBlockedUser(otherUserId));
      })
      .catch((err) => {
        console.log('FAILED Blocking User', err);
      });
  };

  return !isVisible ? (
    <></>
  ) : (
    <KeyboardAvoidingView
      behavior={'padding'}
      // keyboardVerticalOffset={100}
      style={containerStyle}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <Title2 style={styles.titleStyle} color={colors.black}>
          {reportData.title}
        </Title2>
        <View style={{ flex: 1 }}>
          <IconButton
            containerStyle={{ alignSelf: 'flex-end' }}
            style={{ paddingRight: styles._c.r1 }}
            onPress={onBack}
            iconName={'close'}
            size={styles._c.r2}
          />
        </View>
      </View>
      <TextInput
        autoFocus
        style={[styles.descriptionInput, { flex: 3 }]}
        placeholder={reportData.prompt}
        placeholderTextColor={colors.gray}
        textAlignVertical={'top'}
        multiline
        scrollEnabled
        value={description}
        onChangeText={setDescription}
      />
      <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={reportOtherUser}
          gradient
          label={reportData.label}
          textStyle={styles.actionButtonTextStyle}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReportUserScreen;
