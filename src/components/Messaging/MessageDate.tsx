import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  dateText: {
    // fontFamily: 'Quicksand',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '.7rem',
    lineHeight: 12,
    textAlign: 'center',
    letterSpacing: 1,
    borderRadius: 25,
  },
});

export type TMessageDate = {
  // unix timestamps
  date: number;
  prevDate: number;
  isFirstMessage: boolean;
  alwaysShow?: boolean;
};

const MILISECOND = 1000;
// const SECOND = 1;
const MINUTE = 60 * MILISECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 4 * WEEK;
const YEAR = 12 * MONTH;

// used to determine AM or PM
const MIDDAY_HOUR = 12;

// display MessageDate view by default when 5 min between messages
export const MESSAGE_THRESHOLD = 1 * MINUTE;

const WEEK_DAY_LIST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_LIST = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul ',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// const MessageDate = React.memo<TMessageDate>(
const MessageDate = ({
  date,
  prevDate,
  isFirstMessage,
  alwaysShow = false,
}: TMessageDate) => {
  const { colors } = useTheme();
  const [displayDate, setDisplayDate] = useState('');
  const [showDate, setShowDate] = useState(true);

  const messageDateDiff = date - prevDate;
  const messageDateObject = new Date(date);
  const prevMessageDateObject = new Date(prevDate);

  useEffect(() => {
    setShowDate(messageDateDiff > MESSAGE_THRESHOLD || alwaysShow);
  }, [alwaysShow]);

  const getHourAndMinute = () => {
    // 8:32 AM
    const hr = messageDateObject.getHours();
    let midHour = hr % MIDDAY_HOUR;
    // if midHour is 0 set to 12
    midHour = midHour ? midHour : 12;
    const min = messageDateObject.getMinutes();
    const minText = min < 10 ? `0${min}` : `${min}`;
    const middayText = hr >= MIDDAY_HOUR ? 'PM' : 'AM';
    const result = `${midHour}:${minText} ${middayText}`;
    return result;
  };

  const getWeekName = () => {
    // Mon
    const result = WEEK_DAY_LIST[messageDateObject.getDay()];
    return result;
  };

  const getMonthAndDate = () => {
    // January
    const month = MONTH_LIST[messageDateObject.getMonth()];
    const monthDate = messageDateObject.getDate();
    const result = `${month} ${monthDate}`;
    return result;
  };

  const getYear = () => {
    // 2020
    const result = messageDateObject.getFullYear();
    return result;
  };

  useEffect(() => {
    setShowDate(messageDateDiff > MESSAGE_THRESHOLD || alwaysShow);
    const currentDate = Date.now();
    const currentDateDiff = currentDate - date;
    if (
      messageDateDiff &&
      messageDateObject.getDate() == prevMessageDateObject.getDate()
    ) {
      // if messageDateDiff 0 means trailingIndex == lastIndex in MessageScreen
      // today:  "8:32 AM"
      setDisplayDate(getHourAndMinute());
    } else if (currentDateDiff < WEEK) {
      // week (last 7days): "Mon at 2:31 PM"
      setDisplayDate(`${getWeekName()} ${getHourAndMinute()}`);
    } else if (currentDateDiff < YEAR) {
      // Month: "Mar 12 at 2:39 PM"
      setDisplayDate(`${getMonthAndDate()} ${getHourAndMinute()}`);
    } else {
      // Year: "Mar 12, 2020 at 2:39 PM"
      setDisplayDate(
        `${getMonthAndDate()}, ${getYear()} ${getHourAndMinute()}`,
      );
    }
    // console.log("SHOW: 1", DAY, WEEK, MONTH, YEAR, currentDateDiff)
    // console.log("SHOW: 2", displayDate, showDate, messageDateDiff, MESSAGE_THRESHOLD, isFirstMessage)
    // console.log("SHOW: 3", styles.dateText.fontSize)
  }, []);

  if (!showDate && !isFirstMessage) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <Text style={[styles.dateText, { color: colors.gray }]}>
          {displayDate}
        </Text>
      </View>
    );
  }
};

export default MessageDate;
