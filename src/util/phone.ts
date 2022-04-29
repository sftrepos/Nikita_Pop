import { Dimensions, Platform, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isPhoneIOS = Platform.OS === 'ios';
export const uniqueDeviceId = DeviceInfo.getUniqueId();
export const { width, height } = Dimensions.get('screen');

export const isDevMode = __DEV__;

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

export function isIphone(): boolean {
  return Platform.OS === 'ios';
}

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

export const vw = (percentageWidth: number): number =>
  Dimensions.get('window').width * (percentageWidth / 100);

export const vh = (percentageHeight: number): number =>
  Dimensions.get('window').height * (percentageHeight / 100);

export const getWidthFromDisplay = (widthPercentage: string): number => {
  const percentage = parseFloat(widthPercentage);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percentage) / 100);
};

export const getHeightFromDisplay = (heightPercentage: string): number => {
  const percentage = parseFloat(heightPercentage);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percentage) / 100);
};

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}
export const hasNotch = DeviceInfo.hasNotch();
