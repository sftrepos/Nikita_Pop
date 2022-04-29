import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as ChatActions from './ChatActions';
import * as types from './ChatTypes';
import { AuthAPI, PopApi } from 'services/api';
import { getId, getStoreToken } from 'util/selectors';
import { logError } from 'util/log';

function* handleGetChats({ querySize = 15 }) {
  try {
    const id = yield select(getId);
    const token = yield select(getStoreToken);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
        querySize,
      },
    };

    const { response, error } = yield call(PopApi.getChats, config);

    if (response) {
      yield put(
        ChatActions.getChatsSuccess({ data: { ...response.data } }, id),
      );
    } else {
      throw error;
    }
  } catch (e) {
    logError(e);
    yield put(ChatActions.getChatsFail(e));
  }
}

function* handleGetConversation(data) {
  const { chatId, loadEarlier, offset } = data;

  try {
    const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));
    const params = {
      params: {
        offset,
        loadEarlier,
        chatId,
        id,
      },
      headers: { Authorization: `Bearer ${token}` },
    };

    const { response, error } = yield call(PopApi.getConversation, params);

    if (response) {
      yield put(ChatActions.getConversationSuccess(response.data, id));
    } else {
      console.info('CHAT_GET_CONVERSATION_ERR', error);

      yield put(ChatActions.getConversationFail(error));
    }
  } catch (error) {
    console.info('CHAT_GET_CONVERSATION_ERR', error);
    yield put(ChatActions.getConversationFail(error));
  }
}

function* handleReceiveMessage({ message }) {
  try {
    // console.tron.log('msg', message);
    yield put(ChatActions.receiveMessageSuccess(message));
  } catch (err) {
    console.info('CHAT_RECEIVE_MESSAGE_ERR', error);
  }
}

function* handleSendMessage({ message, chatId }) {
  try {
    // console.log(message);
    // console.log(chatId);
    const token = yield select((state) => getStoreToken(state));
    const senderId = yield select((state) => getId(state));
    const users = yield select((state) => state.chats.chats.get(chatId).users);
    const username = yield select((state) => state.login.user.username);
    const body = {
      token,
      senderId,
      text: message,
      chatId,
      users,
      username,
      id: senderId,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { response, error } = yield call(PopApi.sendMessage, body, config);
    if (response) {
      // console.tron.log('res', response);

      yield put(ChatActions.sendMessageSuccess(body, response.data));
    } else {
      console.log(error);
      yield put(ChatActions.sendMessageFail(message));
    }
  } catch (err) {
    console.log(err);
    yield put(ChatActions.sendMessageFail(message));
  }
}

function* handleUnmatchChat({ chatId }) {
  try {
    const token = yield select((state) => getStoreToken(state));
    const body = {
      token,
      chatId,
    };
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { response, error } = yield call(PopApi.unmatchChat, body, params);
    if (response) {
      yield put(ChatActions.unmatchChatSuccess(response));
    } else {
      yield put(ChatActions.unmatchChatFail(error));
    }
  } catch (err) {
    console.log(err);
    yield put(ChatActions.unmatchChatFail('Failed to unmatch'));
  }
}

function* handleReportUser({ payload }) {
  const { reportedId, description, chatId } = payload;
  try {
    const token = yield select((state) => getStoreToken(state));
    const id = yield select((state) => getId(state));

    const body = {
      token,
      id,
      data: {
        type: 'chat',
        chatId,
        reportedId,
        subject: '',
        description,
      },
    };

    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { response, error } = yield call(AuthAPI.report, body, params);
    if (response) {
      yield put(ChatActions.reportUserSuccess(response));
    } else {
      yield put(ChatActions.reportUserFail(response));
    }
  } catch (err) {
    yield put(ChatActions.reportUserFail(err));
    console.log(err);
  }
}

const ChatSaga = function* ChatSaga() {
  yield takeLatest(types.REPORT_USER, handleReportUser);
  yield takeLatest(types.GET_CHATS, handleGetChats);
  yield takeLatest(types.SEND_MESSAGE, handleSendMessage);
  yield takeLatest(types.GET_CONVERSATION, handleGetConversation);
  yield takeLatest(types.RECEIVE_MESSAGE, handleReceiveMessage);
  yield takeLatest(types.UNMATCH_CHAT, handleUnmatchChat);
};
export default ChatSaga;
