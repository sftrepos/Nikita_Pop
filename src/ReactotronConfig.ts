import Reactotron, { asyncStorage } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { NativeModules } from 'react-native';
import sagaPlugin from 'reactotron-redux-saga';

declare global {
  interface Console {
    tron: unknown;
  }
}

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
const name = 'Pop Mobile App';

if (__DEV__) {
  const tron = Reactotron.useReactNative()
    .use(sagaPlugin({}))
    .use(asyncStorage({}))
    .configure({ host, name })
    .use(reactotronRedux())
    .connect();
  tron.clear?.();
  console.tron = tron;
}
