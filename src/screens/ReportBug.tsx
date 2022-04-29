import React, { ReactElement, useRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import { Paragraph, Title3, Title2 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';
import {
  ReportBugScreenNavigationProp,
  ReportBugScreenRouteProp,
} from 'nav/types';
import { Picker } from '@react-native-picker/picker';
import { SubmitHeaderButton } from 'components/HeaderButtons';
import { AuthAPI } from 'services/api';
import { useSelector } from 'react-redux';
import { getId } from 'util/selectors';
import { getDevice, getDeviceId } from 'react-native-device-info';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import { isIphone } from 'util/phone';

const styles = EStyleSheet.create({
  textCenter: {
    padding: '1 rem',
  },
  containerButtonTextInput: {
    padding: '1 rem',
    marginHorizontal: '1 rem',
    marginBottom: '1 rem',
    borderRadius: 10,
  },
  modal: {
    flex: 1,
  },
  textInput: {
    padding: '1rem',
    marginHorizontal: '1rem',
    borderRadius: 15,
  },
  androidContainerLabels: {
    padding: '1rem',
  },
  androidContainerLabelWrapper: {
    margin: '1rem',
  },
});
export interface ReportBugProps {
  navigation: ReportBugScreenNavigationProp;
}

const REPORT_TYPES = [
  { label: 'Bug', value: 'bug' },
  { label: 'Enhancement/Suggestion', value: 'es' },
  { label: 'Question', value: 'question' },
  { label: 'Other', value: 'other' },
];

const ReportBug = ({ navigation }: ReportBugProps): ReactElement => {
  const theme = useTheme();
  const id = useSelector(getId);
  const [androidOpenForm, setAndroidOpenForm] = useState(false);
  const [reportType, setReportType] = useState(REPORT_TYPES[0].label);
  const [description, setDescription] = useState('');
  const { colors } = theme;

  const textInputRef = useRef<RNTextInput>(null);

  const postReportBug = () => {
    AuthAPI.reportBug({
      id,
      data: {
        subject: reportType,
        details: description,
        timestamp: Date.now(),
        userId: id,
        deviceId: getDeviceId(),
        deviceInfo: {
          device: getDevice(),
        },
        appInfo: {
          version: Config.version,
          build: Config.build,
        },
      },
    })
      .then((data) => {
        if (data) {
          Toast.show({
            text1: `Successfully sent feedback.`,
            type: 'success',
            position: 'bottom',
          });
          navigation.pop();
        }
      })
      .catch((err) => {
        console.info('SEND_FEEDBACK_ERR', err);
        Toast.show({
          text1: `An error occurred sending feedback`,
          type: 'error',
          position: 'bottom',
        });
      });
  };

  navigation.setOptions({
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <SubmitHeaderButton
          label="Report"
          onPress={() => {
            if (description.length && reportType.length) {
              postReportBug();
            } else {
              Toast.show({
                text1: 'Please enter all fields.',
                type: 'error',
                position: 'bottom',
              });
            }
          }}
        />
      </View>
    ),
  });

  return (
    <SafeAreaView>
      <StatusBar theme={theme} />
      <Paragraph style={styles.textCenter} color={colors.text}>
        Help us improve the POP app. Please describe the technical issue you
        encountered within the app with as much detail as possible.
      </Paragraph>
      <Separator />
      <ScrollView>
        <Title3 style={styles.textCenter} color={colors.text}>
          Type of Bug
        </Title3>
        {
          <>
            <TouchableOpacity
              style={[styles.textInput, { backgroundColor: colors.card }]}
              onPress={() => {
                setAndroidOpenForm(!androidOpenForm);
              }}>
              <Paragraph color={colors.gray}>
                {reportType.length ? reportType : 'Select a type'}
              </Paragraph>
            </TouchableOpacity>
            <View style={styles.androidContainerLabelWrapper}>
              {androidOpenForm &&
                REPORT_TYPES.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      setReportType(item.label);
                      setAndroidOpenForm(false);
                    }}
                    style={styles.androidContainerLabels}>
                    <Title3 color={colors.gray}>{item.label}</Title3>
                  </TouchableOpacity>
                ))}
            </View>
          </>
        }
        <Separator />
        <Title3 style={styles.textCenter} color={colors.text}>
          Description
        </Title3>
        <RNTextInput
          ref={textInputRef}
          style={[styles.textInput, { backgroundColor: colors.card }]}
          returnKeyType="done"
          placeholder="Please describe your issue"
          value={description}
          onChangeText={setDescription}
        />
        <Separator />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportBug;
