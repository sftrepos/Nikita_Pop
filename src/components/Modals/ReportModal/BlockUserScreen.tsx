import React, { ReactElement, useEffect, useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { Paragraph, Title2 } from '../../Text';
import { useTheme } from '@react-navigation/native';
import {
  getBlockedUsersList,
  getId,
  getProfileData,
  getStoreToken,
} from 'util/selectors';
import store from 'store/index';
import ActionButton from 'components/Buttons/ActionButton';
import { blockUser, unblockUser } from 'services/sendbird/user';
import { useDispatch, useSelector } from 'react-redux';
import { setBlockedUser, setUnblockedUser } from 'features/User/UserActions';
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
  reportBlockParagraph: {
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
});

interface IData {
  title: string;
  label: string;
  prompt: string;
}

const blockData: IData = {
  title: 'Block',
  label: 'block',
  prompt:
    'They will be unmatched and won’t show as any potential matches. Any messages will be hidden. Pop won’t let them know you blocked them',
};

const unblockData: IData = {
  title: 'Unblock',
  label: 'unblock',
  prompt:
    'They will be matched and will show as any potential matches. Pop won’t let them know you unblocked them',
};

interface IBlcokUserScreen {
  isVisible: boolean;
  // Standard Mongo DB ID
  otherUserId: string;
  onBack: () => void;
  onClose: () => void;
  containerStyle?: any;
}

const BlockUserScreen = (props: IBlcokUserScreen): ReactElement => {
  const { containerStyle, onClose, isVisible, otherUserId, onBack } = props;
  const {
    colors: { text },
  } = useTheme();
  const currentUserId = getId(store.getState());
  const analytics = useAnalytics();
  const [modalData, setModalData] = useState(blockData);
  const [isOtherUserBlocked, setIsOtherUserBlocked] = useState(false);
  const { colors } = useTheme();
  const blockedUsers = useSelector((state) => getBlockedUsersList(state));

  const dispatch = useDispatch();

  const handleApi = () => {
    if (isOtherUserBlocked) {
      unblockOtherUser();
    } else {
      blockOtherUser();
    }
    onClose();
  };

  useEffect(() => {
    const isBlocked =
      blockedUsers.filter((_oid) => _oid === otherUserId).length > 0;
    if (isBlocked) {
      setIsOtherUserBlocked(true);
      setModalData(unblockData);
    }
  }, [blockedUsers]);

  //
  // API (sendbird)
  //
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
    analytics.logEvent(
      { name: 'CHATROOM BLOCK USER', data: { userId: otherUserId } },
      true,
    );
  };

  const unblockOtherUser = () => {
    const token = getStoreToken(store.getState());
    const apiHeader = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      params: {
        id: currentUserId,
        blockedUser: otherUserId,
      },
      ...apiHeader,
    };
    unblockUser(data)
      .then((res) => {
        console.log('SUCCESS Unblocking User', res);
        dispatch(setUnblockedUser(otherUserId));
      })
      .catch((err) => {
        console.log('FAILED Unblocking User', err);
      });
    analytics.logEvent(
      { name: 'CHATROOM UNBLOCK USER', data: { userId: otherUserId } },
      true,
    );
  };

  return !isVisible ? (
    <></>
  ) : (
    <View style={containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {modalData.title}
      </Title2>
      <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
        {modalData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={handleApi}
          gradient
          label={modalData.label}
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => onBack()}
          label="Cancel"
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
};

export default BlockUserScreen;
