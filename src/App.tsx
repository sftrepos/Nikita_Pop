import 'react-native-gesture-handler';
import './ReactotronConfig';
import React, { ReactNode, useEffect } from 'react';
import AppContainer from 'nav/index';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Provider } from 'react-redux';
import { Provider as Paper } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import store, { persistor } from 'store/index';
import { appRestore } from 'features/App/AppActions';
import { NotificationService } from 'services/notifications';
import FirebaseWrapper from 'services/firebaseWrapper';
import { eStyleSheetConfig } from 'styles/globalStyleConstants';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import initializeApp from 'util/initializeApp';
import { AppState } from 'react-native';
import * as Sentry from '@sentry/react-native';
import firebase from '@react-native-firebase/app';

const reactNavigationV5Instrumentation =
  new Sentry.ReactNavigationV5Instrumentation({
    routeChangeTimeoutMs: 500, // How long it will wait for the route change to complete. Default is 1000ms
  });

// Sentry
Sentry.init({
  dsn: 'https://09f6dc3761c8411e9b78a69bcd6650e1@o421536.ingest.sentry.io/5352774',
  debug: false,
  enableNative: true,
  beforeSend: (e) => {
    // console.log('Event beforeSend:', e);
    return e;
  },
  // This will be called with a boolean `didCallNativeInit` when the native SDK has been contacted.
  onReady: ({ didCallNativeInit }) => {
    // console.log('onReady called with didCallNativeInit:', didCallNativeInit);
  },
  maxBreadcrumbs: 150, // Extend from the default 100 breadcrumbs.
  integrations: [
    new Sentry.ReactNativeTracing({
      idleTimeout: 5000,
      routingInstrumentation: reactNavigationV5Instrumentation,
      tracingOrigins: ['localhost', /^\//, /^https:\/\//],
    }),
  ],
  enableAutoSessionTracking: true,
  // For testing, session close when 5 seconds (instead of the default 30) in the background.
  sessionTrackingIntervalMillis: 5000,
  // This will capture ALL TRACES and likely use up all your quota
  tracesSampleRate: 1.0,
});

const App = (): ReactNode => {
  NotificationService();
  EStyleSheet.build(eStyleSheetConfig);
  store.dispatch(appRestore());

  useEffect(() => {
    const activeListeners = initializeApp();

    return () => {
      console.info('APP_BACKGROUND');
      AppState.removeEventListener('change', activeListeners);
    };
  }, []);

  return (
    <Paper>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <FirebaseWrapper>
              <ActionSheetProvider>
                <AppContainer />
              </ActionSheetProvider>
            </FirebaseWrapper>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Paper>
  );
};

export default App;
