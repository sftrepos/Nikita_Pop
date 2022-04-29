import {
  DefaultTheme,
  DarkTheme,
  ExtendedTheme,
  ExtendedColors,
} from '@react-navigation/native';
import Color from 'color';
import { width } from 'util/phone';

const globalStyleConstants = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2FD8DC',
      secondary: '#F3729E',
      tertiary: '#FFF6DF',
      purple: '#5359E3',
      mango: '#F6C856',
      success: '#63dfb2',
      pink: '#FFE8F0',
      gray: '#999999',
      darkgrey: '#555',
      grapesicle: '#8397EA',
      white: '#FFF',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#2FD8DC',
      secondary: '#F3729E',
      tertiary: '#FFF6DF',
      purple: '#5359E3',
      mango: '#F6C856',
      success: '#63dfb2',
      pink: '#FFE8F0',
      gray: '#999999',
      darkgrey: '#555',
      grapesicle: '#8397EA',
      white: '#FFF',
    },
  },
  tint: (colors: ExtendedColors): string =>
    Color(colors.text).mix(Color(colors.card), 0.5).hex(),
};

export const eStyleSheetConfig = {
  //Colors
  $raspberry: '#00B9DE',
  $raspberry70: '#4DCEE8',
  $raspberry50: '#80DCEF',
  $raspberry20: '#CCF1F8',
  $raspberry10: '#E5F8FC',
  $raspberry5: '#F2FBFD',
  $lagoonStart: '#66CAEA',
  $lagoonEnd: '#63DFB2',
  $lychee: '#F8FAFA',
  $white: '#FFF',
  $grey4: '#ddd',
  $watermelon: '#EF6E6C',
  $mango: '#F6C856',
  $mangoEnd: '#FFB775',
  $grape: '#5359E3',
  //Font Sizes
  $fontMd: 17,
  $fontSm: 14,
  $fontXS: 10,
  $grey2: '#555',
  $grey3: '#999',
  $grey5: '#F2F2F2',
  $rem: width < 345 ? 13 : 16,
};

export default globalStyleConstants;
