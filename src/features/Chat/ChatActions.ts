import * as types from './ChatTypes';

export function getChats(querySize) {
  return {
    type: types.GET_CHATS,
    querySize,
  };
}
export function getChatsFail(error) {
  return {
    type: types.GET_CHATS_FAIL,
    error,
  };
}
export function getChatsSuccess({ data }, id) {
  return {
    type: types.GET_CHATS_SUCCESS,
    data,
    id,
  };
}

export function sendMessage(message: string, chatId: string) {
  return {
    type: types.SEND_MESSAGE,
    message,
    chatId,
  };
}
export function sendMessageSuccess(message, progress) {
  return {
    type: types.SEND_MESSAGE_SUCCESS,
    message,
    progress,
  };
}
export function sendMessageFail(message) {
  return {
    type: types.SEND_MESSAGE_FAIL,
    message,
  };
}
export function getConversation(chatId, offset, loadEarlier) {
  return {
    type: types.GET_CONVERSATION,
    chatId,
    offset,
    loadEarlier,
  };
}
export function getConversationSuccess(data, selfId) {
  return {
    type: types.GET_CONVERSATION_SUCCESS,
    data,
    selfId,
  };
}
export function getConversationFail(error) {
  return {
    type: types.GET_CONVERSATION_FAIL,
    error,
  };
}

export function receiveMessage(message) {
  return {
    type: types.RECEIVE_MESSAGE,
    message,
  };
}

export function receiveMessageSuccess(message) {
  return {
    type: types.RECEIVE_MESSAGE_SUCCESS,
    message,
  };
}

export function unmatchChat(chatId) {
  return {
    type: types.UNMATCH_CHAT,
    chatId,
  };
}
export function unmatchChatSuccess(data) {
  return {
    type: types.UNMATCH_CHAT_SUCCESS,
    data,
  };
}
export function unmatchChatFail(error) {
  return {
    type: types.UNMATCH_CHAT_FAIL,
    error,
  };
}

export function reportUser(
  reportedId: string,
  description: string,
  chatId: string,
) {
  return {
    type: types.REPORT_USER,
    payload: {
      reportedId,
      description,
      chatId,
    },
  };
}
export function reportUserSuccess(data) {
  return {
    type: types.REPORT_USER_SUCCESS,
    data,
  };
}

export function reportUserFail(error) {
  return {
    type: types.REPORT_USER_FAIL,
    error,
  };
}

export function updateCurrentRoomView(params) {
  return {
    type: types.UPDATE_CHAT_ROOM_VIEW,
    params,
  };
}

export function storeCachedMessages(messages) {
  return {
    type: types.STORE_CACHED_MESSAGES,
    messages,
  };
}
