import DeviceInfo, {
  isHeadphonesConnected,
  LocationProviderInfo,
  PowerState,
} from 'react-native-device-info';
import { isIphone } from './phone';

const {
  getApplicationName,
  getAvailableLocationProviders,
  getBuildId,
  getBuildNumber,
  getBatteryLevel,
  getBrand,
  getCarrier,
  getDeviceType,
  getDeviceName,
  getDeviceId,
  getFontScale,
  getFreeDiskStorage,
  getManufacturer,
  getPowerState,
  getReadableVersion,
  getSystemName,
  getSystemVersion,
  getIpAddress,
  getTotalDiskCapacity,
  getTotalMemory,
  getUserAgent,
  getVersion,
  isBatteryCharging,
  isEmulator,
  isLandscape,
  isLocationEnabled,
  isPinOrFingerprintSet,
  isTablet,
} = DeviceInfo;

async function getAdditionalLogInfo() {
  return {
    powerState: await getPowerState().then((state) => state),
    carrier: await getCarrier().then((carrier) => carrier),
    deviceName: await getDeviceName().then((deviceName) => deviceName),
    manufacturer: await getManufacturer().then((manu) => manu),
    headphones: await isHeadphonesConnected().then((headphones) => headphones),
  };
}

export interface LogInfo {
  powerState: Record<string, unknown> | PowerState;
  carrier: string;
  deviceName: string;
  manufacturer: string;
  build: string;
  version: string;
  deviceId: string;
  systemVersion: string;
}

export interface AvailableUserInfo extends LogInfo {
  batteryLevel: number;
  isLocationEnabled: boolean;
  isBatteryCharging: boolean;
  availableLocationProviders: LocationProviderInfo;
  brand: string;
  buildId: string;
  isTablet: boolean;
  fontScale: number;
  userAgent: string;
  deviceType: string;
  isHeadphonesConnected: boolean;
  isEmulator: boolean;
  systemName: string;
  isLandscape: boolean;
  totalMemory: number;
  manufacturer: string;
  systemVersion: string;
  applicationName: string;
  freeDiskStorage: number;
  readableVersion: string;
  totalDiskCapacity: number;
  isPinOrFingerprintSet: boolean;
}

export const logInfo = {
  async getInfo(): Promise<LogInfo> {
    const res = await getAdditionalLogInfo();
    const info = {
      build: getBuildNumber(),
      version: getVersion(),
      deviceId: getDeviceId(),
      systemVersion: getSystemVersion(),
      ...res,
    };
    if (isIphone()) {
      return {
        ...info,
      };
    } else {
      return {
        ...info,
      };
    }
  },
};

export const ip = {
  async getIp(): Promise<string> {
    const res = await getIpAddress();
    return res;
  },
};

const usrDeviceInfo = {
  async getAvailableUserInfo(): Promise<AvailableUserInfo> {
    const info = {
      powerState: await getPowerState(),
      batteryLevel: await getBatteryLevel(),
      isHeadphonesConnected: await isHeadphonesConnected(),
      isLocationEnabled: await isLocationEnabled(),
      isBatteryCharging: await isBatteryCharging(),
      availableLocationProviders: await getAvailableLocationProviders(),
      brand: getBrand(),
      version: getVersion(),
      carrier: await getCarrier(),
      buildId: await getBuildId(),
      build: getBuildNumber(),
      deviceId: getDeviceId(),
      isTablet: isTablet(),
      fontScale: await getFontScale(),
      userAgent: await getUserAgent(),
      deviceType: getDeviceType(),
      isEmulator: await isEmulator(),
      systemName: getSystemName(),
      deviceName: await getDeviceName(),
      isLandscape: await isLandscape(),
      totalMemory: await getTotalMemory(),
      manufacturer: await getManufacturer(),
      systemVersion: getSystemVersion(),
      applicationName: getApplicationName(),
      freeDiskStorage: await getFreeDiskStorage(),
      readableVersion: getReadableVersion(),
      totalDiskCapacity: await getTotalDiskCapacity(),
      isPinOrFingerprintSet: await isPinOrFingerprintSet(),
    };
    return { ...info };
  },
};

export default usrDeviceInfo;
