import { createReducer } from 'typesafe-actions';
import {
  WIDGET_ADD_WIDGET,
  WIDGET_ORDER_WIDGET,
  WIDGET_GET_WIDGET,
  WIDGET_ADD_WIDGET_SUCCESS,
  WIDGET_ADD_WIDGET_FAILURE,
  WIDGET_EDIT_WIDGET_SUCCESS,
  WIDGET_DELETE_FAILURE,
  WIDGET_SET_DATA,
} from 'features/Widgets/WidgetTypes';
import { LOGOUT } from 'features/Login/LoginTypes';

const initialState = {
  widgets: [],
  numWidgets: 0,
  widgetHistory: {},
  error: null,
  failed: false,
  isLoading: false,
  addSuccess: false,
  data: null,
};

const WidgetReducer = createReducer(initialState)
  .handleAction(WIDGET_ADD_WIDGET, (state, action) => ({
    ...state,
    isLoading: true,
    addSuccess: false,
    failed: false,
    error: null,
  }))
  .handleAction(WIDGET_ORDER_WIDGET, (state, action) => ({
    ...state,
    widgets: action.payload,
  }))
  .handleAction(WIDGET_GET_WIDGET, (state, action) => {
    return {
      ...state,
      widgets: action.payload.widgets,
      widgetHistory: action.payload.widgetHistory,
      numWidgets: action.payload.widgets.length,
    };
  })
  .handleAction(WIDGET_SET_DATA, (state, action) => {
    return {
      ...state,
      data: action.payload.data,
    };
  })
  .handleAction(WIDGET_DELETE_FAILURE, (state, action) => ({
    ...state,
  }))
  .handleAction(WIDGET_ADD_WIDGET_SUCCESS, (state, action) => {
    let widgets = [...state.widgets];
    if (action.payload.newWidget) {
      widgets.push(action.payload.newWidget);
    }
    if (action.payload.replace) {
      widgets = action.payload.replaceWidgets;
    }
    return {
      ...state,
      widgets,
      numWidgets: widgets.length,
      addSuccess: true,
      failed: false,
      error: null,
    };
  })
  .handleAction(WIDGET_ADD_WIDGET_FAILURE, (state, action) => {
    return {
      ...state,
      addSuccess: false,
      failed: true,
      error: action.payload.error,
    };
  })
  .handleAction(WIDGET_EDIT_WIDGET_SUCCESS, (state, action) => {
    return {
      ...state,
      widgets: action.payload.widgets,
      failed: false,
      error: null,
    };
  })
  .handleAction(LOGOUT, () => initialState);

export default WidgetReducer;
