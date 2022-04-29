// export const WIDGET_UPDATE_WIDGET = 'widget/UPDATE_WIDGET';
// export const WIDGET_UPDATE_WIDGET_FAILURE = 'widget/UPDATE_WIDGET_FAILURE';
// export const WIDGET_UPDATE_WIDGET_SUCCESS = 'widget/UPDATE_WIDGET_SUCCESS';

// export const WIDGET_GET_WIDGET = 'widget/GET_WIDGET';
// export const WIDGET_GET_WIDGET_FAILURE = 'widget/GET_WIDGET_FAILURE';
// export const WIDGET_GET_WIDGET_SUCCESS = 'widget/GET_WIDGET_SUCCESS';

export type WidgetType = {
  type: string;
  sequence: number;
  gif: string;
  caption: string;
  isNewData: boolean;
};

export const WIDGET_ADD_WIDGET = 'widget/ADD_WIDGET';
export const WIDGET_DELETE = 'widget/DELETE';
export const WIDGET_DELETE_FAILURE = 'widget/DELETE_FAILURE';
export const WIDGET_ADD_WIDGET_SUCCESS = 'widget/ADD_WIDGET_SUCCESS';
export const WIDGET_ADD_WIDGET_FAILURE = 'widget/ADD_WIDGET_FAILURE';
export const WIDGET_ORDER_WIDGET = 'widget/ORDER_WIDGET';
export const WIDGET_GET_WIDGET = 'widget/GET_WIDGET';
export const WIDGET_SET_DATA = 'widget/SET_DATA';
export const WIDGET_EDIT = 'widget/EDIT';
export const WIDGET_EDIT_WIDGET_SUCCESS = 'widget/EDIT_WIDGET_SUCCESS';
export const WIDGET_EDIT_WIDGET_FAILURE = 'widget/EDIT_WIDGET_FAILURE';
