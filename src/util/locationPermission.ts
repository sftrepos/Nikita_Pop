import { PermissionsAndroid, Platform } from 'react-native';
import Permissions, {
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';

// checking for location permission
export const checkLocationPermission = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        checkMultiple([
          'ios.permission.LOCATION_ALWAYS',
          'ios.permission.LOCATION_WHEN_IN_USE',
        ]).then((statuses) => {
          if (Object.values(statuses).includes('granted')) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        const [permissionStatus, permissionStatus2] = await Promise.all([
          PermissionsAndroid.check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
          PermissionsAndroid.check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
        ]);
        if (permissionStatus || permissionStatus2) {
          resolve(true);
        } else {
          resolve(true);
        }
      }
    } catch (err) {
      resolve(true);
    }
  });
};
