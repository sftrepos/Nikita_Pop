import Reactotron from 'reactotron-react-native';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import rootReducer from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import reduxFlipper from 'redux-flipper';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'analytics',
  storage: AsyncStorage,
};

const sagaMonitor = Reactotron.createSagaMonitor?.();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const persistedReducer = persistReducer(persistConfig, rootReducer);

// App state rehydration
const initialState = {};

const middlewares = [sagaMiddleware];

if (__DEV__) {
  const flipper = reduxFlipper();
  middlewares.push(flipper);
}

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default store;
