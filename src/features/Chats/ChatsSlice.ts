import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupChannel } from 'sendbird';
import { SBToken } from 'services/sendbird/user';

export type ChatsState = {
  sbToken: SBToken | null;
  currentChannel: string;
  channelList: GroupChannel[];
  numUnreadChat: number;
  groupId: string | undefined | null;
  inviteLink: string | undefined | null;
};

const initialState: ChatsState = {
  sbToken: null,
  currentChannel: '',
  channelList: [] as GroupChannel[],
  numUnreadChat: 0,
  groupId: null,
  inviteLink: null,
} as const;

const ChatsSlice = createSlice({
  name: 'chats',
  initialState: initialState,
  reducers: {
    // Add SB's session token to the store
    registerSBToken(state, action: PayloadAction<SBToken>) {
      state.sbToken = action.payload;
    },
    //update all group channels
    updateChannels(state, action: PayloadAction<GroupChannel[]>) {
      state.channelList = action.payload;
    },
    addChannel(state, action: PayloadAction<GroupChannel>) {
      state.channelList = [...state.channelList, action.payload];
    },
    removeChannel(state, action: PayloadAction<GroupChannel>) {
      state.channelList = state.channelList.filter(
        (channel) => channel.url != action.payload.url,
      );
    },
    setCurrentChannel(state, action: PayloadAction<string>) {
      // console.log('changing to', action.payload);
      state.currentChannel = action.payload;
    },
    setNumUnreadChat(state, action: PayloadAction<number>) {
      state.numUnreadChat = action.payload;
    },
    setGroupId(state, action: PayloadAction<string>) {
      state.groupId = action.payload;
    },
    setInviteLink(state, action: PayloadAction<string>) {
      state.inviteLink = action.payload;
    },
  },
});

export default ChatsSlice;
