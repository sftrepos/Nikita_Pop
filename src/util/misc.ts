import _ from 'lodash';
import { PixelRatio } from 'react-native';

export const classDesignations = [
  'freshman',
  'sophomore',
  'junior',
  'senior',
  'grad',
  'alumni',
];

export const getStringArrayByKey = <T>(arr: Array<T>, key: string): string[] =>
  _.map(arr, key);

export const getYearArrayFromClassArray = (classArray: string[]): number[] => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const yMap: Record<string, string> = {};
  classDesignations.map((classStr, idx) => {
    const key = (m >= 5 ? y + 4 - idx : y + 3 - idx).toString();
    yMap[key] = classStr;
  });
  return classArray.map((classStr) =>
    Number(Object.keys(yMap).find((key) => yMap[key] === classStr)),
  );
};

export const getDeviceFontSize = (): number => {
  const devicePixelRatio = PixelRatio.get();
  let fontSize = 0;
  if (devicePixelRatio >= 3.5) {
    fontSize = 16;
  } else if (devicePixelRatio >= 3) {
    fontSize = 14;
  } else if (devicePixelRatio >= 2) {
    fontSize = 12;
  } else {
    fontSize = 10;
  }
  return fontSize;
};
