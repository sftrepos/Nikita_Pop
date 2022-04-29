import React, { ReactElement, useEffect, useState } from 'react';
import { PixelRatio, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { Paragraph, Title2 } from '../../Text';
import { useTheme } from '@react-navigation/native';
import { getBlockedUsersList } from 'util/selectors';
import ActionButton from 'components/Buttons/ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { showReportBlockModal } from 'features/User/UserActions';
import BlockUserScreen from './BlockUserScreen';
import ReportUserScreen from './ReportUserScreen';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
  },
  modalContainer: {},
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    // top: '25%',
    // maxHeight: '50%',
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
  textInputContainer: {
    backgroundColor: 'yellow',
    borderStyle: 'solid',
    borderColor: 'red',
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
  prompt: string;
}

const reportBlockData: IData = {
  title: 'Block/Report',
  prompt:
    'Your experience finding friends here should be safe and fun. Report anyone who makes you feel unsafe and we’ll take care of the rest.',
};

interface IReportBlockModal {
  // Standard Mongo DB ID
  otherUserId: string;
  type: string;
}

const reportBlockScreenName = 'reportBlockScreen';
const reportUserScreenName = 'reportUserScreen';
const blockUserScreenName = 'blockUserScreen';

const ReportBlockModal = (props: IReportBlockModal): ReactElement => {
  const { otherUserId, type } = props;
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const [screenName, setScreenName] = useState(reportBlockScreenName);

  // handle modal visibility
  const showModal = useSelector((state) => state.user.showReportBlockModal);
  const hideModal = () => {
    // setScreenName(reportBlockScreenName)
    analytics.logEvent(
      {
        name: 'CHATROOM REPORT BLOCK MODAL CLOSE',
        data: { userId: otherUserId },
      },
      true,
    );
    dispatch(showReportBlockModal(false));
  };
  const onPressReport = () => {
    setScreenName(reportUserScreenName);
  };
  const onPressBlock = () => {
    setScreenName(blockUserScreenName);
  };
  const onBack = () => {
    setScreenName(reportBlockScreenName);
  };

  // dynamic resizing of Report modal when keyboard shows up
  const [viewHeight, setViewHeight] = useState(0);
  const [modalMaxHeight, setModalMaxHeight] = useState('40%');
  const [modalTopMargin, setModalTopMargin] = useState('25%');

  useEffect(() => {
    if (viewHeight < 200) {
      setModalMaxHeight('70%');
      setModalTopMargin('10%');
    } else if (viewHeight > 400) {
      setModalMaxHeight('40%');
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
        onModalHide={() => setScreenName(reportBlockScreenName)} // finish the animation
        onBackButtonPress={hideModal}
        // onBackdropPress={() => hideModal()}
        isVisible={showModal}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}>
        <ReportBlockScreen
          isVisible={screenName == reportBlockScreenName}
          otherUserId={otherUserId}
          onClose={hideModal}
          onPressBlock={onPressBlock}
          onPressReport={onPressReport}
        />
        <ReportUserScreen
          containerStyle={styles.containerStyle}
          isVisible={screenName == reportUserScreenName}
          otherUserId={otherUserId}
          // onBack={onBack}
          onBack={hideModal}
          onClose={hideModal}
          type={'chat'}
        />
        <BlockUserScreen
          containerStyle={styles.containerStyle}
          isVisible={screenName == blockUserScreenName}
          otherUserId={otherUserId}
          // onBack={onBack}
          onBack={hideModal}
          onClose={hideModal}
        />
      </Modal>
    </View>
  );
};

interface IReportBlockScreen {
  isVisible: boolean;
  otherUserId: string;
  onClose: () => void;
  onPressBlock: () => void;
  onPressReport: () => void;
}
const ReportBlockScreen = React.memo((props: IReportBlockScreen) => {
  const { onPressBlock, onPressReport, otherUserId, isVisible, onClose } =
    props;
  const { colors } = useTheme();

  const [blockLabel, setBlockLabel] = useState('Block');
  const blockedUsers = useSelector((state) => getBlockedUsersList(state));
  useEffect(() => {
    const isBlocked =
      blockedUsers.filter((_oid) => _oid === otherUserId).length > 0;
    if (isBlocked) {
      setBlockLabel('Unblock');
    }
  }, []);

  return !isVisible ? (
    <></>
  ) : (
    <View style={styles.containerStyle}>
      <Title2 style={styles.titleStyle} color={colors.black}>
        {reportBlockData.title}
      </Title2>
      <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
        {reportBlockData.prompt}
      </Paragraph>
      <View style={styles.buttonContainer}>
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => onPressReport()}
          gradient
          label={'Report'}
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={() => onPressBlock()}
          gradient
          label={blockLabel}
          textStyle={styles.actionButtonTextStyle}
        />
        <ActionButton
          containerStyle={styles.actionButtonStyles}
          onPress={onClose}
          label="Cancel"
          textStyle={[styles.actionButtonTextStyle, { color: colors.primary }]}
        />
      </View>
    </View>
  );
});

export default ReportBlockModal;
