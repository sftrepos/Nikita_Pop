import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { ReportSchema } from '../util';
import { Title } from './Text';
import TextInput from './TextInput';
import { useTheme } from '@react-navigation/native';

interface IReportView {
  onCancel: () => void;
  onSubmit: (s: string) => void;
}

const ReportView = ({ onCancel, onSubmit }: IReportView) => {
  const { register, watch, unregister, setValue, errors } = useForm({
    validationSchema: ReportSchema,
  });

  useEffect(() => {
    register('report');
  }, [register]);

  const value = watch('report');

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={{ paddingLeft: 15 }}>Report User</Title>
        <TouchableOpacity
          disabled={!value || errors.report}
          onPress={() => onSubmit(value)}>
          <Text
            style={[styles.done, (errors.report || !value) && styles.disabled]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        label="Report"
        placeholderTextColor={colors.gray}
        placeholder="Tell us what happened..."
        onChangeText={(txt) => setValue('report', txt, true)}
        containerStyle={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingTop: 15,
        }}
        style={{ flex: 1 }}
        multiline
        value={value}
      />
    </View>
  );
};

const styles = EStylesheet.create({
  container: {
    height: '20rem',
    backgroundColor: '$lychee',
    borderRadius: 25,
    padding: '1rem',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  done: {
    color: '$raspberry',
    fontSize: '$fontMd',
  },
  disabled: {
    color: '$grey4',
  },
});

export default ReportView;
