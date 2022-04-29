import { createAction } from 'typesafe-actions';
import {
  WIDGET_ADD_WIDGET,
  WIDGET_ORDER_WIDGET,
  WIDGET_DELETE,
  WIDGET_GET_WIDGET,
  WIDGET_ADD_WIDGET_SUCCESS,
  WIDGET_ADD_WIDGET_FAILURE,
  WIDGET_DELETE_FAILURE,
  WIDGET_SET_DATA,
  WIDGET_EDIT,
  WIDGET_EDIT_WIDGET_SUCCESS,
  WidgetType,
} from 'features/Widgets/WidgetTypes';
import { WidgetDisplayType } from 'screens/Profile';

export const widgetAdd = createAction(
  WIDGET_ADD_WIDGET,
  (widgets) => widgets,
)();

export const widgetAddSuccess = createAction(
  WIDGET_ADD_WIDGET_SUCCESS,
  (widgets) => widgets,
)();

export const widgetSetData = createAction(WIDGET_SET_DATA, (data) => data)();

// What screen are they on? Helps do navigation.pop only when on dedicated screen
export type WidgetDeleteCtx = 'DEDICATED_SCREEN';

export interface WidgetDeleteParams {
  widgets: WidgetType[];
  ctx: WidgetDeleteCtx;
}

export const widgetDelete = createAction(WIDGET_DELETE, (widgets, ctx) => ({
  widgets,
  ctx,
}))();

export const widgetDeleteFailure = createAction(
  WIDGET_DELETE_FAILURE,
  (error) => error,
)();

export const widgetEdit = createAction(WIDGET_EDIT, (widgets) => widgets)();

export const widgetEditSuccess = createAction(
  WIDGET_EDIT_WIDGET_SUCCESS,
  (widgets) => widgets,
)();

export const widgetAddFailure = createAction(
  WIDGET_ADD_WIDGET_FAILURE,
  (error) => error,
)();

export const widgetOrder = createAction(
  WIDGET_ORDER_WIDGET,
  (widgets) => widgets,
)();

export const widgetGet = createAction(
  WIDGET_GET_WIDGET,
  (widgets, widgetHistory) => {
    return {
      widgets,
      widgetHistory,
    };
  },
)();

//widget add fail
//widget add success

// export const widgetUpdateFailure = createAction(
//   WIDGET_UPDATE_WIDGET_FAILURE,
//   (error) => error,
// )();
