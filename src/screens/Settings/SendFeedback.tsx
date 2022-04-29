import React, { ReactElement, useRef, useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SendFeedbackNavigationProp, SendFeedbackRouteProp } from 'nav/types';
import { SubmitHeaderButton } from 'components/HeaderButtons';
import { Paragraph, Title3 } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import Separator from 'components/Separator';
import { AuthAPI } from 'services/api';
import { useSelector } from 'react-redux';
import { getId } from 'util/selectors';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  textCenter: {
    padding: '1 rem',
  },
  textInput: {
    padding: '1rem',
    marginHorizontal: '1rem',
    borderRadius: 15,
  },
});

interface ISendFeedback {
  navigation: SendFeedbackNavigationProp;
  route: SendFeedbackRouteProp;
}

const SendFeedback = ({ navigation }: ISendFeedback): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const id = useSelector(getId);

  const postFeedback = () => {
    AuthAPI.postFeedback({
      id,
      data: {
        subject,
        description,
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
          label="Send"
          onPress={() => {
            if (subject.length && description.length) {
              postFeedback();
            } else {
              Toast.show({
                text1: 'Please complete all fields.',
                type: 'error',
                position: 'bottom',
              });
            }
          }}
        />
      </View>
    ),
  });

  const textInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Paragraph style={styles.textCenter} color={colors.text}>
        Help us improve the POP app. Please describe the technical issue you
        encountered within the app with as much detail as possible.
      </Paragraph>
      <Separator />
      <ScrollView style={styles.scroll}>
        <Title3 style={styles.textCenter} color={colors.text}>
          Subject
        </Title3>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.card }]}
          returnKeyType="done"
          autoFocus
          placeholder="How can we help?"
          value={subject}
          onChangeText={setSubject}
          onSubmitEditing={() => textInputRef.current?.focus()}
        />
        <Title3 style={styles.textCenter} color={colors.text}>
          Description
        </Title3>
        <TextInput
          ref={textInputRef}
          style={[styles.textInput, { backgroundColor: colors.card }]}
          returnKeyType="done"
          placeholder="A detailed description"
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>
    </View>
  );
};

export default SendFeedback;
