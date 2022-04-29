import { call, put, select, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';
import {
  widgetAddFailure,
  widgetAddSuccess,
  WidgetDeleteParams,
  widgetEditSuccess,
} from 'features/Widgets/WidgetActions';
import {
  WIDGET_ADD_WIDGET,
  WIDGET_DELETE,
  WIDGET_ORDER_WIDGET,
  WIDGET_EDIT,
  WIDGET_EDIT_WIDGET_SUCCESS,
} from 'features/Widgets/WidgetTypes';
import { AuthAPI, PopApi } from 'services/api';
import { getId, getStoreToken, getWidgets } from 'util/selectors';
import { logError } from 'util/log';
import { clearDeck, getCards } from 'features/Request/RequestActions';
import { pop as navigationPop } from 'nav/RootNavigation';
import { useNavigation } from '@react-navigation/native';
import { USER_GET_PROFILE, USER_UPDATE_PROFILE } from 'features/User/UserTypes';
import Toast from 'react-native-toast-message';

function* handleWidgetAdd(this: any, { payload }) {
  const widgetsPayload = payload.newWidgets;
  const accessToken = yield select(getStoreToken);
  const id = yield select((state) => getId(state));
  const params = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  // Add "isNewData" key to widgets that don't have it, required by v1 of POST widgets
  widgetsPayload.map((el, idx) => {
    if (!_.has(el, 'isNewData')) {
      widgetsPayload[idx].isNewData = true;
    }
    widgetsPayload[idx].sequence = idx;
  });

  const body = {
    id,
    widgets: widgetsPayload,
    onlySeqChanged: false, //TODO
  };

  try {
    const res = yield call(PopApi.addWidget, body, params);
    if (res) {
      if (res.error) {
        throw res;
      } else {
        Toast.show({
          text1: 'Successfully updated widgets',
          type: 'success',
          position: 'top',
          topOffset: 50,
        });
        const successArgs = {
          newWidget: widgetsPayload[widgetsPayload.length - 1],
        };
        if (payload.replace) {
          yield put(clearDeck());
          yield put(
            widgetAddSuccess({
              newWidget: null,
              replaceWidgets: widgetsPayload,
              replace: payload.replace,
              typeChanged: payload.typeChanged,
            }),
          );
        } else {
          yield put(
            // Pass the last sequenced new widget to success as a newWidget
            widgetAddSuccess(successArgs),
          );
        }
        yield put({ type: USER_GET_PROFILE });
        navigationPop();
      }
    } else {
      throw res;
    }
  } catch (e) {
    logError(e);
    Toast.show({
      text1: 'An error occurred in adding widgets.',
      type: 'error',
      position: 'top',
      topOffset: 50,
    });
    yield put(widgetAddFailure(e));
  }
}

function* handleWidgetOrder(widgetsPayload) {
  const widgets = widgetsPayload.payload;

  widgets.map((el, idx) => {
    if (!_.has(el, 'isNewData')) {
      widgets[idx].isNewData = true;
    }
  });

  const id = yield select((state) => getId(state));
  const body = {
    id,
    widgets,
    // Force sequence changed false because of backend bug
    // Just replace the whole thing
    onlySeqChanged: false,
  };

  try {
    yield call(AuthAPI.addWidget, body);
  } catch (e) {
    logError(e);
    Toast.show({
      text1: "Couldn't reorder widgets.",
      type: 'error',
      position: 'top',
      topOffset: 50,
    });
  }
}

function* handleWidgetDelete({ payload }) {
  const { widgets, ctx } = payload;
  const accessToken = yield select(getStoreToken);
  const id = yield select((state) => getId(state));
  const params = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const currentWidgets = yield select(getWidgets);
  let newWidgets = [...currentWidgets];
  if (Array.isArray(widgets)) {
    widgets.forEach((widgetInstance, idx) => {
      newWidgets = _.reject(currentWidgets, widgetInstance);
    });
  } else {
    newWidgets = _.reject(currentWidgets, widgets);
  }
  newWidgets.map((el, idx) => {
    if (!_.has(el, 'isNewData')) {
      newWidgets[idx].isNewData = true;
      newWidgets[idx].sequence = idx;
    }
  });
  const body = {
    id,
    widgets: newWidgets,
    onlySeqChanged: false,
  };
  try {
    const res = yield call(PopApi.addWidget, body, params);
    if (res) {
      if (res.error) {
        throw res;
      }
      // Toast.show({
      //   text1: 'Successfully deleted widget',
      //   type: 'success',
      //   position: 'top',
      //   topOffset: 50,
      // });
      yield put(clearDeck());
      yield put(
        widgetAddSuccess({
          newWidget: null,
          replaceWidgets: newWidgets,
          replace: true,
        }),
      );
      if (ctx === 'DEDICATED_SCREEN') {
        navigationPop();
      }
    }
  } catch (e) {
    logError(e);
    Toast.show({
      text1: 'An error occurred in deleting widgets.',
      type: 'error',
      position: 'top',
      topOffset: 50,
    });
    yield put(widgetAddFailure(e));
  }
}

function* handleWidgetEdit({ payload }) {
  const accessToken = yield select(getStoreToken);
  const id = yield select((state) => getId(state));
  const params = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const currentWidgets = yield select(getWidgets);
  const newWidgets = [...currentWidgets];
  newWidgets[payload.sequence] = payload;

  newWidgets.forEach((el, idx) => {
    newWidgets[idx].isNewData = true;
    newWidgets[idx].sequence = idx;
  });

  const body = {
    id,
    widgets: newWidgets,
    onlySeqChanged: false,
  };

  try {
    const res = yield call(PopApi.addWidget, body, params);
    if (res) {
      if (res.error) {
        throw res;
      }
      yield put(clearDeck());
      yield put(
        widgetEditSuccess({
          widgets: newWidgets,
        }),
      );
      Toast.show({
        text1: 'Successfully edited widget!',
        type: 'success',
        position: 'top',
        topOffset: 50,
      });
      navigationPop();
    }
  } catch (e) {
    logError(e);
    Toast.show({
      text1: 'An error occurred in editing widgets.',
      type: 'error',
      position: 'top',
      topOffset: 50,
    });
    yield put(widgetAddFailure(e));
  }
}

const WidgetSaga = function* root() {
  yield takeLatest(WIDGET_ADD_WIDGET, handleWidgetAdd);
  yield takeLatest(WIDGET_ORDER_WIDGET, handleWidgetOrder);
  yield takeLatest(WIDGET_DELETE, handleWidgetDelete);
  yield takeLatest(WIDGET_EDIT, handleWidgetEdit);
};

export default WidgetSaga;
