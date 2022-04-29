import React from 'react';
import { Pressable, View } from 'react-native';
import { Paragraph, Title2 } from 'components/Text';
import { GroupChannel } from 'sendbird';
import EStyleSheet from 'react-native-extended-stylesheet';

type TOptionsModal = {
  channel: GroupChannel;
  close: () => void;
  openReportModal: () => void;
  openMembersModal: () => void;
  openLeaveModal: () => void;
};

const OptionsModal = ({
  close,
  openReportModal,
  openMembersModal,
  openLeaveModal,
}: TOptionsModal): React.ReactElement => {
  return (
    <View style={[styles.container]}>
      <Pressable
        style={styles.option}
        onPress={() => {
          close();
          openMembersModal();
        }}>
        <Paragraph style={styles.optionText}>View Members</Paragraph>
      </Pressable>
      <Pressable
        style={styles.option}
        onPress={() => {
          close();
          openReportModal();
        }}>
        <Paragraph style={styles.optionText}>Report Pop-in</Paragraph>
      </Pressable>
      <Pressable
        style={[styles.option, { borderBottomWidth: 0 }]}
        onPress={() => {
          close();
          openLeaveModal();
        }}>
        <Paragraph style={[styles.optionText, { color: 'red' }]}>
          Leave Pop-in
        </Paragraph>
      </Pressable>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    // paddingVertical: '1rem',
  },
  option: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: '1rem',
    alignItems: 'center',
  },
  optionText: {
    fontSize: '1.1rem',
  },
});

export default OptionsModal;
