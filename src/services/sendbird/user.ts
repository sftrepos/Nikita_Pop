import { Platform } from 'react-native';
import SendBird from 'sendbird';
import firebase from '@react-native-firebase/app';
import { getApiUrl, axiosPost, axiosGet, axiosDelete } from 'services/api';
import Config from 'react-native-config';

const APP_ID =
  Config.env === 'dev' ? Config.SENDBIRD_APPID_DEV : Config.SENDBIRD_APPID_PROD;

export const sbRegisterPushToken = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (Platform.OS === 'ios') {
        // FCM token doesn't work in request to APNs.
        firebase
          .messaging()
          .getAPNSToken()
          .then((token) => {
            if (token) {
              sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                console.log(
                  'sb.registerAPNSPushTokenForCurrentUser result:',
                  result,
                );
                if (!error) {
                  resolve();
                } else reject(error);
              });
            } else {
              console.info('No APNs token detected');
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        firebase
          .messaging()
          .getToken()
          .then((token) => {
            if (token) {
              sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
                console.log(
                  'sb.registerGCMPushTokenForCurrentUser result:',
                  result,
                );
                if (!error) {
                  resolve();
                } else reject(error);
              });
            } else {
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    } else {
      reject('SendBird is not initialized');
    }
  });
};

export const sbUnregisterPushToken = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    firebase
      .messaging()
      .getToken()
      .then((token) => {
        const sb = SendBird.getInstance();
        if (sb) {
          if (Platform.OS === 'ios') {
            firebase
              .messaging()
              .getAPNSToken()
              .then((apnsToken) => {
                if (!apnsToken) {
                  return resolve();
                }
                sb.unregisterAPNSPushTokenForCurrentUser(
                  apnsToken,
                  (_, error) => {
                    if (!error) {
                      resolve();
                    } else reject(error);
                  },
                );
              })
              .catch((err) => reject(err));
          } else {
            sb.unregisterGCMPushTokenForCurrentUser(token, (_, error) => {
              if (!error) {
                resolve();
              } else reject(error);
            });
          }
        } else {
          reject('SendBird is not initialized');
        }
      })
      .catch((err) => reject(err));
  });
};

export type SBToken = {
  expires_at: number;
  session_token: string;
};

// Setting Push Notification Template for Sendbird
export const sbSetPushPreference = () => {
  const sb = SendBird.getInstance();
  sb.setPushTriggerOption('all');
  sb.setPushTemplate('PUSH_TEMPLATE_DEFAULT');
};

export const sbConnect = (
  userId: string,
  sbToken: SBToken,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject('UserID is required.');
      return;
    }
    if (!sbToken) {
      reject('SB session_token is required.');
      return;
    }
    const sb = new SendBird({ appId: APP_ID });
    sb.connect(userId, sbToken.session_token, (_, error) => {
      if (error) {
        reject('SendBird Login Failed.');
      } else {
        resolve(sbToken.session_token);
      }
    });
  });
};

export const sbDisconnect = (): Promise<null> => {
  return new Promise((resolve, _) => {
    const sb = SendBird.getInstance();
    if (sb) {
      sb.disconnect(() => {
        resolve(null);
      });
    } else {
      resolve(null);
    }
  });
};

export const sbConversationsQuery = (): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      const testQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      if (testQuery.hasNext) {
        testQuery.next((groupChannels, error) => {
          if (error) {
            reject('SendBird GroupChannelListQueryFailed');
          }
          resolve(groupChannels);
        });
      }
    }
  });
};

export const reportUser = (data, headers) => {
  return axiosPost(`${getApiUrl()}/user/v3/report`, data, headers);
};
export const blockUser = (data, headers) => {
  return axiosPost(`${getApiUrl()}/user/v3/block`, data, headers);
};
export const getBlockedUser = (params) => {
  return axiosGet(`${getApiUrl()}/user/v3/block`, params);
};
export const unblockUser = (params) => {
  return axiosDelete(`${getApiUrl()}/user/v3/block`, params);
};
