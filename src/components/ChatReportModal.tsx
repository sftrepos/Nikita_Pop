import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { ReactElement, useState } from 'react';
import Modal from 'react-native-modal';
import { CustomHeaderButton } from './HeaderButtons';
import ReportView from './ReportView';
import { useDispatch, useSelector } from 'react-redux';
import { getChats, reportUser } from '../features/Chat/ChatActions';
import { getId } from '../util/selectors';
import useAnalytics from 'util/analytics/useAnalytics';

interface IChatReportModal {
  navigation: any;
}

const ChatReportModal = ({ navigation }: IChatReportModal): ReactElement => {
  const analytics = useAnalytics();
  const { showActionSheetWithOptions } = useActionSheet();
  const id = useSelector((state) => getId(state));

  const [showReport, setShowReport] = useState<boolean>();
  const dispatch = useDispatch();
  const chat = useSelector((state) =>
    state.chats.chats.get(state.chats.currentRoom),
  );
  const otherUser = chat?.userData[chat?.users.find((u) => id !== u)];

  const handleReport = (text: string): void => {
    dispatch(reportUser(otherUser.identityId, text, chat?._id));
    // dispatch(unmatchChat(chat?._id));
    setShowReport(false);
    navigation.pop();
    setTimeout(() => dispatch(getChats(15)), 2000);
    analytics.logEvent(
      { name: 'CHATROOM REPORT SEND', data: { userId: otherUser.identityId } },
      true,
    );
  };

  return (
    <>
      <Modal
        isVisible={showReport}
        hasBackdrop
        onBackdropPress={() => setShowReport(false)}
        onBackButtonPress={() => setShowReport(false)}>
        <ReportView
          onCancel={() => setShowReport(false)}
          onSubmit={handleReport}
        />
      </Modal>
      <CustomHeaderButton
        iconSize={20}
        name="flag-outline"
        style={{ paddingRight: 30 }}
        onPress={() => {
          showActionSheetWithOptions(
            {
              options: ['Cancel', 'Report & Block'],
              cancelButtonIndex: 0,
            },
            (buttonIndex) => {
              switch (buttonIndex) {
                case 1:
                  setShowReport(!showReport);
                  break;
                default:
                  break;
              }
            },
          );
        }}
      />
    </>
  );
};

export default ChatReportModal;
