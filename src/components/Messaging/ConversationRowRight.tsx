import React, { ReactElement } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';
import { DateTime } from 'luxon';
import { date } from 'yup';

const styles = EStyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
  },
  online: {
    width: 10,
    height: 10,
    borderRadius: 25,
    marginTop: '0.5rem',
  },
});

type TConversationRowRight = {
  isOnline: boolean;
  t: number;
};

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

const ConversationRowRight = ({
  isOnline,
  t,
}: TConversationRowRight): ReactElement => {
  const { colors } = useTheme();

  const parseDate = (): string => {
    const dt = DateTime.fromMillis(t);
    const formatStandardDt = DateTime.fromISO(dt.toString()).toFormat('MMM d');
    const isOnSameDay = dt.hasSame(DateTime.now(), 'day');

    const formatSimpleTime = () => dt.toLocaleString(DateTime.TIME_SIMPLE);

    if (isOnSameDay) {
      return formatSimpleTime();
    } else if (Date.now() - t < 6.048e8) {
      return days[new Date(t).getDay()];
    } else {
      return formatStandardDt;
    }
  };

  return (
    <View style={styles.wrap}>
      <Paragraph color={colors.gray}>{parseDate()}</Paragraph>
      {isOnline && (
        <View style={[styles.online, { backgroundColor: colors.primary }]} />
      )}
    </View>
  );
};

export default ConversationRowRight;
