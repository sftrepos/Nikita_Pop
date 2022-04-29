import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FileMessage,
  GroupChannelListQuery,
  Member,
  UserMessage,
  GroupChannel,
} from 'sendbird';
import { CustomAvatarProps } from '../../../assets/vectors/pochies/CustomAvatar';

//TODO additional user information as need arises
export type ConversationState = {
  type: string;
  avatar: CustomAvatarProps | null;
  currentChannel: string;
  progress: number;
  name: string;
  messageList: (UserMessage | FileMessage)[];
  memberCount: number;
  typing: string;
  selectedList: (UserMessage | FileMessage)[];
  otherUser: Member[];
  otherUserId: string;
  profileOpen: boolean;
  channelList: GroupChannel[];
};

const initialState: ConversationState = {
  type: '',
  avatar: null,
  currentChannel: '',
  progress: 0,
  name: '',
  messageList: [] as (UserMessage | FileMessage)[],
  memberCount: 0,
  typing: '',
  selectedList: [] as (UserMessage | FileMessage)[],
  otherUser: [] as Member[],
  otherUserId: '',
  profileOpen: false,
  channelList: [] as GroupChannel[],
} as const;

const ConversationSlice = createSlice({
  name: 'chats',
  initialState: initialState,
  reducers: {
    //update message list
    updateMessages(
      state,
      action: PayloadAction<(UserMessage | FileMessage)[]>,
    ) {
      state.messageList = action.payload;
    },
    updateTyping(state, action: PayloadAction<string>) {
      state.typing = action.payload;
    },
    // select message by messageId
    selectMessage(state, action: PayloadAction<number>) {
      const selectedMessage = state.messageList.find(
        (message) => message.messageId == action.payload,
      ) as UserMessage | FileMessage;
      state.selectedList = [...state.selectedList, selectedMessage];
    },
    // deselect message by messageId
    deselectMessage(state, action: PayloadAction<number>) {
      const newSelectedMessages = state.messageList.filter(
        (message) => message.messageId != action.payload,
      );
      state.selectedList = newSelectedMessages;
    },
    setUsers(state, action: PayloadAction<Member[]>) {
      state.otherUser = action.payload;
    },
    setOtherUserId(state, action: PayloadAction<string>) {
      state.otherUserId = action.payload;
    },
    setProfileOpen(state, action: PayloadAction<boolean>) {
      state.profileOpen = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setAvatar(state, action: PayloadAction<CustomAvatarProps>) {
      state.avatar = action.payload;
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    setAllChannelList(state, action: PayloadAction<SendBird.GroupChannel[]>) {
      state.channelList = action.payload;
    },
  },
});

export default ConversationSlice;
