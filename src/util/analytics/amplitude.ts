import Config from 'react-native-config';
import { Amplitude } from '@amplitude/react-native';

export const initAmplitude = (): Amplitude => {
  const ampInstance = Amplitude.getInstance();
  ampInstance.init(
    Config.env === 'prod'
      ? 'ea104851c1b4e389295682612d244f3f'
      : '56621e5ea7781218352f9eb15a1a8167',
  );

  return ampInstance;
};
