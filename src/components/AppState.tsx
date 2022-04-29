import React, { useRef, useState, useEffect } from 'react';
import { AppState } from 'react-native';

const AppStateExample = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
    } else if (nextAppState === 'inactive') {
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return;
};

export default AppStateExample;
