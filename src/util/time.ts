export const isToday = (date: Date) =>
  date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);

/**
 * Convert a date to yyyymmdd
 * @param date Date
 */
export const formatYmd = (date: Date) => date.toISOString().slice(0, 10);

export const getMonthName = (date: Date) =>
  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][date.getMonth()];
