import React, { useRef, useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { InitialState, NavigationState } from '@react-navigation/routers';
import { AppState, AppStateStatus } from 'react-native';
import Auth from 'screens/Auth';
import InnerStack from 'nav/stacks/InnerStack';
import OuterStack from 'nav/stacks/OuterStack';
import { connect, useSelector } from 'react-redux';
import { APP_BACKGROUND, APP_LOADING } from 'features/App/AppTypes';
import { RootStackParamList } from 'nav/types';
import GlobalModalWrapper from 'components/Modals/GlobalModal/GlobalModalWrapper';
import { Host } from 'react-native-portalize';
import { logAnalyticsEvent } from 'util/log';
import globalStyleConstants from 'styles/globalStyleConstants';
import { RootReducer } from 'store/rootReducer';
import { isReadyRef, navigationRef } from 'nav/RootNavigation';
import useAnalytics from 'util/analytics/useAnalytics';
import EventsHandler from 'services/EventsHandler';
import { NotifierWrapper } from 'react-native-notifier';
import { is } from 'immer/dist/internal';

enableScreens();

const App = createNativeStackNavigator<RootStackParamList>();

interface AppContainerProps {
  theme: string;
  initialState?: InitialState;
  onStateChange?: (state: NavigationState | undefined) => void;
  root: string;
}

interface AppStackProps {
  root: string;
}

const AppStack = React.memo<AppStackProps>(({ root }) => {
  if (!root) {
    return null;
  }
  const { status, isAuthenticated, isWaitlisted } = useSelector(
    (state) => state.login,
  );

  return (
    <App.Navigator>
      {root === APP_BACKGROUND || root === APP_LOADING ? (
        <App.Screen
          name="AUTH"
          options={{ headerShown: false }}
          component={Auth}
        />
      ) : null}
      {!isAuthenticated || status !== 'ACTIVE' ? (
        <App.Screen
          name="OUTER_STACK"
          options={{ headerShown: false }}
          component={OuterStack}
        />
      ) : null}
      {status == 'ACTIVE' && isAuthenticated ? (
        <App.Screen
          name="INNER_STACK"
          options={{ headerShown: false }}
          component={InnerStack}
        />
      ) : null}
    </App.Navigator>
  );
});

const UNDEF_SCREEN = 'UNDEFINED_SCREEN';

const AppContainer = ({ theme, root }: AppContainerProps) => {
  const analytics = useAnalytics();
  const routeNameRef = useRef<string | null>(null);
  const appState = useRef(AppState.currentState);
  const authenticated = useSelector<RootReducer>(
    (state) => state.login.isAuthenticated,
  );
  const [, setAppStateVisible] = useState(appState.current);
  const [sentAnalytics, setSentAnalytics] = useState(false);
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      isReadyRef.current = false;
    };
  }, []);

  const getRoute = () =>
    navigationRef.current?.getCurrentRoute()?.name ?? UNDEF_SCREEN;

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    const previous = appState.current;
    appState.current = nextAppState;
    setAppStateVisible(appState.current);

    if (previous != nextAppState && authenticated) {
      const screen = getRoute();
      let action;
      nextAppState === 'active' ? (action = 'return') : (action = 'leave');
      logAnalyticsEvent({
        action,
        screen,
        status: nextAppState,
        timestamp: new Date(),
      }).finally();
      setSentAnalytics(true);
    }
  };

  const onReady = () => {
    routeNameRef.current = getRoute();
    isReadyRef.current = true;
  };

  const onStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getRoute();
    if (
      authenticated &&
      previousRouteName !== currentRouteName &&
      !sentAnalytics
    ) {
      logAnalyticsEvent({
        status: 'active',
        screen: currentRouteName,
        timestamp: new Date(),
      }).finally();
      if (currentRouteName) {
        // Do not add more screens
        switch (currentRouteName) {
          case 'REQUESTS_SCREEN':
        }
      }
    }

    routeNameRef.current = currentRouteName;
  };

  // const [globalTheme, setTheme] = useState('light');
  //
  // useEffect(() => {
  //   getTheme().then((res) => {
  //     const thisTheme = res?.isDarkModeEnabled ? 'light' : 'dark';
  //     setTheme(thisTheme);
  //   });
  // }, [theme]);
  //
  // const currentTheme =
  //   theme === 'light' ? globalStyleConstants.light : globalStyleConstants.dark;
  //
  const currentTheme = globalStyleConstants.light;

  return (
    <NavigationContainer
      theme={currentTheme}
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      <GlobalModalWrapper type="none">
        <Host>
          <NotifierWrapper>
            <EventsHandler>
              <AppStack root={root} />
            </EventsHandler>
          </NotifierWrapper>
        </Host>
      </GlobalModalWrapper>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootReducer) => ({
  root: state.app.root,
  theme: state.app.theme,
});

export default connect(mapStateToProps)(AppContainer);
