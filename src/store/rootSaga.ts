import { all } from 'redux-saga/effects';
import LoginSaga from 'features/Login/LoginSaga';
import AppSaga from 'features/App/AppSaga';
import ChatSaga from 'features/Chat/ChatSaga';
import RequestSaga from 'features/Request/RequestSaga';
import UserSaga from 'features/User/UserSaga';
import RegisterSaga from 'features/Register/RegisterSaga';
import WidgetSaga from 'features/Widgets/WidgetSaga';
import AnalyticsSaga from 'features/Analytics/AnalyticsSaga';

const rootSaga = function* root(): Generator {
  yield all([
    AppSaga(),
    LoginSaga(),
    ChatSaga(),
    RequestSaga(),
    UserSaga(),
    RegisterSaga(),
    WidgetSaga(),
    AnalyticsSaga(),
  ]);
};

export default rootSaga;
