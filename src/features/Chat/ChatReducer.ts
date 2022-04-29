import moment from 'moment';
import * as types from './ChatTypes';
import { LOGOUT } from 'features/Login/LoginTypes';

const initialState = {
  chats: new Map(), // Will be map tho
  chatsLoading: false,
  messagesLoading: false,
  chatsLoaded: false,
  messagesLoaded: false,
  reload: false,
  newMessage: false,
  currentRoom: null,
  currentConversation: null,
  messageSending: false,
  messageError: false,
};

export default function ChatReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CHATS: {
      return {
        ...state,
        chatsLoading: true,
        reload: false,
      };
    }
    case types.GET_CHATS_FAIL: {
      return {
        ...state,
        chatsLoading: false,
      };
    }
    case types.GET_CHATS_SUCCESS: {
      const mappedChats = new Map();
      const sortedChats = [...action.data.chats].sort((a, b) =>
        a.messages.length === 0
          ? -1
          : b.messages.length === 0
          ? -1
          : moment(a.messages[a.messages.length - 1].createdAt).isBefore(
              b.messages[b.messages.length - 1].createdAt,
            )
          ? 1
          : -1,
      );

      sortedChats.forEach((chat) => {
        mappedChats.set(chat._id, chat);
      });

      return {
        ...state,
        chats: mappedChats,
        users: action.data.users,
        chatsLoading: false,
        chatsLoaded: true,
      };
    }

    case types.GET_CONVERSATION: {
      return {
        ...state,
        messagesLoading: true,
        currentConversation: action.chatId,
        loadEarlier: action.loadEarlier,
        offset: action.offset,
      };
    }

    case types.GET_CONVERSATION_FAIL: {
      return {
        ...state,
        messagesLoading: false,
      };
    }

    case types.GET_CONVERSATION_SUCCESS: {
      const newChats = new Map(state.chats);

      let newMessages = [
        ...state.chats.get(state.currentConversation).messages,
      ];

      if (state.loadEarlier) {
        newMessages = action.data.concat(newMessages);
      } else {
        newMessages = newMessages.concat(action.data);
      }

      newChats.set(state.currentConversation, {
        ...newChats.get(state.currentConversation),
        messages: newMessages,
        lastRead: {
          ...action.data.lastRead,
          [action.selfId]: Date.now(),
        },
      });

      return {
        ...state,
        messagesLoading: false,
        chats: newChats,
      };
    }

    case types.STORE_CACHED_MESSAGES: {
      const newChats = new Map(state.chats);
      newChats.set(state.currentConversation, {
        ...state.chats.get(state.currentConversation),
        messages: action.messages,
      });
      return {
        ...state,
        chats: newChats,
      };
    }

    case types.RECEIVE_MESSAGE_SUCCESS: {
      const { sentTime, data } = action.message;

      const { chatId, text, senderId, progress } = data;

      const newChats = new Map(state.chats);

      newChats.set(
        chatId,

        {
          ...state.chats.get(chatId),
          lastUpdate: sentTime,
          progress:
            typeof progress === 'number' ? progress : parseFloat(progress),
          messages: [
            ...state.chats.get(chatId).messages,
            {
              user: {
                _id: senderId,
              },
              text,
              createdAt: sentTime,
            },
          ],
        },
      );

      return {
        ...state,
        newMessage: true,
        chats: newChats,
      };
    }
    case types.SEND_MESSAGE: {
      return {
        ...state,
        messageSending: true,
        messageError: false,
      };
    }
    case types.SEND_MESSAGE_FAIL: {
      return {
        ...state,
        messageError: true,
        messageSending: false,
      };
    }

    case types.SEND_MESSAGE_SUCCESS: {
      const mappedChats = new Map();

      const { chatId, text, senderId } = action.message;

      const newChats = new Map(state.chats);
      const oldChat = state.chats.get(chatId);
      newChats.set(chatId, {
        ...oldChat,
        lastUpdate: Date.now(),
        progress: action.progress.progress,
        messages: [
          ...state.chats.get(chatId).messages,
          {
            user: {
              _id: senderId,
            },
            text,
            createdAt: moment.utc(Date.now()).format(),
            index: oldChat.messages[oldChat.messages?.length - 1].index + 1,
          },
        ],
      });

      const newState = {
        ...state,
        chats: newChats,
        loadEarlier: false,
        messageSending: false,
        messageError: false,
      };
      const sortedChats = Array.from(newState.chats.values()).sort((a, b) =>
        a.messages.length === 0
          ? -1
          : b.messages.length === 0
          ? -1
          : moment(a.messages[a.messages.length - 1].createdAt).isBefore(
              b.messages[b.messages.length - 1].createdAt,
            )
          ? 1
          : -1,
      );
      sortedChats.forEach(({ _id }) => {
        mappedChats.set(_id, newState.chats.get(_id));
      });

      newState.chats = mappedChats;
      return newState;
    }
    case types.UNMATCH_CHAT:
      return {
        ...state,
        reload: true,
      };
    case types.UPDATE_CHAT_ROOM_VIEW:
      return {
        ...state,
        currentRoom: action.params,
      };
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
