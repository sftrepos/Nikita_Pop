import React, { useState } from 'react';
import {
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import ActionButton from 'components/Buttons/ActionButton';
import { Title2 } from 'components/Text';
import { Paragraph } from 'components/Text';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GroupChannel } from 'sendbird';
import IconButton from 'components/Buttons/IconButton';

type TReportModal = {
  channel: GroupChannel;
  close: () => void;
  doReport: (category: string, message: string) => void;
};

const ReportPopinModal = ({ channel, close, doReport }: TReportModal) => {
  const { colors } = useTheme();
  const [page, setPage] = useState<'Report' | 'Category' | 'Input'>('Report');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const Report = () => {
    return (
      <View style={styles.containerStyle}>
        <Title2 style={styles.titleStyle} color={colors.black}>
          Report Pop-in?
        </Title2>
        <Image
          style={styles.icon}
          source={require('assets/icons/reportIcon.png')}
        />
        <Paragraph color={colors.black} style={styles.reportBlockParagraph}>
          We won’t notify the Pop-In host or members you submitted this report.
          If you believe someone is in immediate danger, call local emergency
          services.
        </Paragraph>
        <View style={styles.buttonContainer}>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => setPage('Category')}
            gradient
            label={'Report Pop-in'}
            textStyle={styles.actionButtonTextStyle}
          />
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => close()}
            label="Nevermind"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
        </View>
      </View>
    );
  };

  const Category = () => {
    return (
      <View style={styles.containerStyle}>
        <Title2 style={styles.titleStyle} color={colors.black}>
          Report
        </Title2>
        <Paragraph
          color={colors.black}
          style={[styles.reportBlockParagraph, { textAlign: 'center' }]}>
          Help us understand the problem.
        </Paragraph>
        <View style={styles.buttonContainer}>
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => {
              setCategory('spam');
              setPage('Input');
            }}
            label="It's spam"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => {
              setCategory('inappropriate');
              setPage('Input');
            }}
            label="It's inappropriate"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
          <ActionButton
            containerStyle={styles.actionButtonStyles}
            onPress={() => {
              setCategory('other');
              setPage('Input');
            }}
            label="Other"
            textStyle={[
              styles.actionButtonTextStyle,
              { color: colors.primary },
            ]}
          />
        </View>
      </View>
    );
  };

  const Input = () => {
    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        // keyboardVerticalOffset={100}
        style={styles.containerStyle}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <Title2 style={styles.titleStyle} color={colors.black}>
            Report
          </Title2>
          <View style={{ flex: 1 }}>
            <IconButton
              containerStyle={{ alignSelf: 'flex-end' }}
              style={{ paddingRight: styles._c.r1 }}
              onPress={close}
              iconName={'close'}
              size={styles._c.r2}
            />
          </View>
        </View>
        <TextInput
          autoFocus
          style={[styles.descriptionInput, { flex: 3 }]}
          placeholder="Tell us what happened so we can investigate your concerns"
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
            onPress={() => {
              if (description.length > 0) {
                doReport(category, description);
                close();
              }
            }}
            gradient
            label="Report"
            textStyle={styles.actionButtonTextStyle}
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <>
      <View style={[styles.modalStyle, { backgroundColor: colors.card }]}>
        {page === 'Report' && <Report />}
        {page === 'Category' && <Category />}
        {page === 'Input' && <Input />}
      </View>
      <Pressable
        style={{ height: Dimensions.get('screen').height }}
        onPress={close}
      />
    </>
  );
};

const styles = EStyleSheet.create({
  _c: {
    r1: '.5rem',
    r2: '1.5rem',
  },
  modal: {
    margin: '1rem',
    height: Dimensions.get('screen').height * 0.4,
    borderRadius: 25,
  },
  containerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  modalStyle: {
    backgroundColor: '$white',
    justifyContent: 'space-between',
    margin: '1rem',
    // height: Dimensions.get('screen').height * 0.4,
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
    marginVertical: '1.5rem',
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
  icon: {
    alignSelf: 'center',
    marginTop: '1.5rem',
  },
  descriptionInput: {
    backgroundColor: '$grey5',
    // height: '70%',
    fontSize: '1rem',
    padding: '.5rem',
    borderRadius: 10,
    marginVertical: '1rem',
    minHeight: Dimensions.get('screen').height * 0.1,
    // borderBottomeColor: 'red',
  },
});

export default ReportPopinModal;
