import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token } from 'services/types';
import { logError } from 'util/log';

const REFRESH_TOKEN = 'REFRESH_TOKEN';
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const FCM_TOKEN = 'FCM_TOKEN';
const THEME = 'THEME';

export const wait = async (milliseconds: number): Promise<number> =>
  new Promise<number>((resolve) => setTimeout(resolve, milliseconds));

export const getCachedUserData = async (
  otherUserId: string,
): Promise<Record<string, unknown> | null | undefined> => {
  try {
    const res = await AsyncStorage.getItem(`user-${otherUserId}`);
    if (res) {
      return JSON.parse(res);
    }
    return null;
  } catch (e) {
    logError(e);
  }
  return null;
};

export async function setCachedUserData(
  otherUser: Record<string, unknown>,
  otherUserId: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `user-${otherUserId}`,
      JSON.stringify(otherUser),
    );
  } catch (e) {
    logError(e);
  }
}

export const getAccessToken = async (): Promise<string | null | undefined> => {
  try {
    const res = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (res) {
      return res;
    }
    return null;
  } catch (e) {
    logError(e);
  }
  return null;
};

export async function setAccessToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN, token);
  } catch (e) {
    logError(e);
  }
}

export async function removeAccessToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
  } catch (e) {
    logError(e);
  }
}

export async function setFCMToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(FCM_TOKEN, token);
  } catch (e) {
    logError(e);
  }
}

export async function removeFCMToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FCM_TOKEN);
  } catch (e) {
    logError(e);
  }
}

export async function getFCMToken(): Promise<string | null> {
  try {
    let storedFcmToken = await AsyncStorage.getItem(FCM_TOKEN);
    if (!storedFcmToken) {
      await messaging()
        .getToken()
        .then((token) => {
          storedFcmToken = token;
        });
      if (storedFcmToken) {
        await setFCMToken(storedFcmToken);
      }
    }
    return storedFcmToken;
  } catch (e) {
    logError(e);
  }
  return null;
}

export async function storeRefreshToken(token: Token): Promise<void> {
  try {
    await EncryptedStorage.setItem(REFRESH_TOKEN, JSON.stringify(token));
  } catch (e) {
    logError(e);
  }
}

export async function removeRefreshToken(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(REFRESH_TOKEN);
  } catch (e) {
    logError(e);
  }
}

export async function getRefreshToken(): Promise<Token | undefined | null> {
  try {
    const res = await EncryptedStorage.getItem(REFRESH_TOKEN);
    if (res) {
      return JSON.parse(res);
    }
  } catch (e) {
    logError(e);
  }
  return null;
}

export async function setTheme(isDarkEnabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME, JSON.stringify({ isDarkEnabled }));
  } catch (e) {
    logError(e);
  }
}

export async function getTheme(): Promise<
  { isDarkModeEnabled: boolean } | undefined | null
> {
  try {
    const res = await AsyncStorage.getItem(THEME);
    if (res) {
      return JSON.parse(res);
    }
  } catch (e) {
    logError(e);
  }
  return null;
}
