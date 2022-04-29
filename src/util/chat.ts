export const getChannelIndex = (newChannel, channels) => {
  for (let i = 0; i < channels.length; i++) {
    if (channels[i].url === newChannel.url) {
      return i;
    }
  }
  return -1;
};
export const findChannelIndex = (newChannel, channels) => {
  const newChannelLastMessageUpdated = newChannel.lastMessage
    ? newChannel.lastMessage.createdAt
    : newChannel.createdAt;
  let index = channels.length;
  for (let i = 0; i < channels.length; i++) {
    const comparedChannel = channels[i];
    const comparedChannelLastMessageUpdated = comparedChannel.lastMessage
      ? comparedChannel.lastMessage.createdAt
      : comparedChannel.createdAt;
    if (
      newChannelLastMessageUpdated === comparedChannelLastMessageUpdated &&
      newChannel.url === comparedChannel.url
    ) {
      index = i;
      break;
    } else if (
      newChannelLastMessageUpdated > comparedChannelLastMessageUpdated
    ) {
      index = i;
      break;
    }
  }
  return index;
};

export const getMessageIndex = (newMessage, messages) => {
  for (let i = 0; i < messages.length; i++) {
    if (newMessage.isIdentical(messages[i])) {
      return i;
    }
  }
  return -1;
};

export const findMessageIndex = (newMessage, messages, isRequestId = false) => {
  let index = messages.length;
  for (let i = 0; i < messages.length; i++) {
    if (
      !isRequestId &&
      newMessage.messageId !== 0 &&
      messages[i].messageId !== 0 &&
      messages[i].messageId === newMessage.messageId
    ) {
      index = i;
      break;
    } else if (isRequestId && messages[i].reqId === newMessage.reqId) {
      index = i;
      break;
    } else if (messages[i].createdAt < newMessage.createdAt) {
      index = i;
      break;
    }
  }
  return index;
};

export const createChannelTitle = (channel) => {
  let title = channel.members.map((member) => member.nickname).join(', ');
  if (title.length > 21) {
    title = title.substring(0, 17) + '...';
  }
  return title;
};
