import React, { ReactElement, useEffect, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import { Paragraph, Title, Title3 } from '../../Text';
import { useTheme } from '@react-navigation/native';
import NextButton from 'screens/Register/NextButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { AuthAPI } from 'services/api';

const styles = EStyleSheet.create({
  _vars: {
    padding: '1rem',
  },
  innerModal: {
    minHeight: '20%',
    maxHeight: '95%',
    alignItems: 'center',
    borderRadius: 15,
    padding: '2rem',
  },
  outerModal: {},
  button: {
    paddingHorizontal: '1rem',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    paddingVertical: 3,
    marginBottom: 0,
  },
  prompt: {
    paddingVertical: '1rem',
  },
  reportInput: {},
  cancelButton: {
    padding: '1rem',
  },
  inputWrapper: {
    paddingHorizontal: '1rem',
    paddingVertical: '0.5rem',
    width: '100%',
    height: 100,
    borderRadius: 15,
    marginVertical: '1rem',
  },
});

interface IReportModal {
  hasToggled: boolean;
  toggle: () => void;
  // Standard Mongo DB ID
  id: string;
}

type ReportActions = 'report user' | 'block' | 'cancel' | 'report';

const REPORT_STAGE = {
  reportStart: {
    title: 'Block/Report',
    prompt:
      'Your experience finding friends here should be safe and fun. Report anyone who makes you feel unsafe and we’ll take care of the rest.',
    label: ['report user', 'block', 'cancel'],
  },
  block: {
    title: 'Block',
    prompt:
      'They will be unmatched and won’t show as any potential matches. Any messages will be hidden. Pop won’t let them know you blocked them.',
    label: ['block', 'cancel'],
  },
  report: {
    title: 'Report',
    prompt: 'Tell us what happened so we can investigate your concerns',
    label: ['report'],
  },
} as const;

const ReportModal = (props: IReportModal): ReactElement => {
  const { toggle, hasToggled, id } = props;
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [report, setReport] = useState('');
  const [reportStage, setReportStage] =
    useState<keyof typeof REPORT_STAGE>('reportStart');

  useEffect(() => {
    setIsVisible(hasToggled);
  }, [hasToggled]);

  const blockUser = (user: string) => {
    AuthAPI.blockUser({
      blockedUser: id,
    })
      .then((_) => {
        Toast.show({
          text1: `Blocked user ${user}`,
          type: 'success',
          position: 'bottom',
        });
      })
      .catch((_) => {
        Toast.show({
          text1: `An error occurred trying to block user ${user}`,
          type: 'error',
          position: 'bottom',
        });
      });
  };

  const reportUser = (user: string) => {
    AuthAPI.reportUser({
      type: 'carousel',
      description: report,
      reportedId: id,
    })
      .then((res) => {
        Toast.show({
          text1: `Reported user ${user}`,
          type: 'success',
          position: 'bottom',
        });
      })
      .catch((err) => {
        //console.log('ERROR_REPORT_USER', err);
        Toast.show({
          text1: `An error occurred trying to report user ${user}`,
          type: 'error',
          position: 'bottom',
        });
      });
  };

  const onPress = (currentLabel: Exclude<ReportActions, 'cancel'>) => {
    switch (currentLabel) {
      case 'report user':
        setReportStage('report');
        break;
      case 'block':
        if (reportStage === 'block') {
          blockUser('User');
          onReset();
          break;
        }
        setReportStage('block');
        break;
      case 'report':
        reportUser('User');
        onReset();
        break;
      default:
        break;
    }
  };

  const onReset = () => {
    toggle();
    setReportStage('reportStart');
    setReport('');
  };

  return (
    <View style={styles.outerModal}>
      <Modal onBackdropPress={onReset} isVisible={isVisible}>
        <KeyboardAvoidingView
          style={[styles.innerModal, { backgroundColor: colors.card }]}>
          <Title color={colors.text}>{REPORT_STAGE[reportStage].title}</Title>
          {reportStage !== 'report' && (
            <Paragraph style={styles.prompt} color={colors.text}>
              {REPORT_STAGE[reportStage].prompt}
            </Paragraph>
          )}
          <View style={[styles.actionsContainer]}>
            {reportStage === 'report' && (
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.background },
                ]}>
                <TextInput
                  autoFocus
                  placeholder={REPORT_STAGE.report.prompt}
                  style={[styles.reportInput]}
                  multiline
                  value={report}
                  onChangeText={setReport}
                />
              </View>
            )}
            {REPORT_STAGE[reportStage].label.map((label: ReportActions) => {
              if (label === 'cancel') {
                return (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onReset}>
                    <Title3 color={colors.primary}>
                      {label.toUpperCase()}
                    </Title3>
                  </TouchableOpacity>
                );
              }

              // TODO: stretch the buttons
              return (
                <NextButton
                  noIcon
                  style={styles.buttonWrapper}
                  containerStyle={[styles.button]}
                  label={label}
                  onPress={() => onPress(label)}
                />
              );
            })}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ReportModal;
