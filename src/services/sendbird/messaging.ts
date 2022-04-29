import SendBird, {
  AdminMessage,
  ChannelHandler,
  FileMessage,
  GroupChannel,
  ReactionEvent,
  UserMessage,
  BaseMessageInstance,
  GroupChannelListQuery,
} from 'sendbird';
import { MESSAGES_LIMIT, SbMessage } from 'screens/Chats/MessagesScreen';
import { resolveSearchParameters } from 'instantsearch.js/es/lib/utils';

export const sbTestQuery = (): Promise<void> => {
  return new Promise(() => {
    const sb = SendBird.getInstance();
    if (sb) {
      // Test SB instances
      const testQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      if (testQuery.hasNext) {
        testQuery.next((groupChannels, error) => {
          if (error) {
            console.log('SB_TEST_QUERY_ERR', error);
          }
          console.log('SB_GROUP_CHANNELS', groupChannels);
        });
      }
    }
  });
};

interface ISbSendMessage {
  message: string;
  channel: GroupChannel;
  userIds: string[];
}

export const sbSendMessage = ({
  channel,
  message,
  userIds,
}: ISbSendMessage): Promise<SbMessage> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      // Test SB instances
      const params = new sb.UserMessageParams();
      params.message = message;
      params.mentionType = 'users';
      //params.mentionedUserIds = userIds; - Until we need mentioning func.
      params.pushNotificationDeliveryOption = 'default';
      channel.sendUserMessage(params, (msg, err) => {
        if (err) {
          console.info(err);
          console.info('COULD NOT SEND MESSAGE', params);
        } else {
          resolve(msg);
          //console.info('MESSAGE SENT', params, msg);
        }
      });
    }
  });
};

interface ISbSendFileMessage {
  file: string;
  type: string;
  currentUser?: any;
  channel: GroupChannel;
  userIds: string[];
}

export const sbSendFileMessage = ({
  channel,
  file,
  currentUser,
  type,
  userIds,
}: ISbSendFileMessage): Promise<SbMessage> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      // Test SB instances

      const params = new sb.FileMessageParams();
      params.customType = type;
      params.fileUrl = file;
      params.fileName = `${currentUser.username}: Shared a ${type}`;
      params.mimeType = 'image/gif';
      params.mentionType = 'users';
      params.mentionedUserIds = userIds;
      params.message = `Shared a ${type}`;
      params.pushNotificationDeliveryOption = 'default';
      channel.sendFileMessage(params, (msg, err) => {
        if (err) {
          console.info('COULD NOT SEND FILE MESSAGE', params);
        } else {
          resolve(msg);
          //console.info('MESSAGE SENT', params, msg);
        }
      });
    }
  });
};

interface ISbGetSingleMessage {
  messageId: number;
  channel: GroupChannel;
}

export const sbGetSingleMessage = ({
  channel,
  messageId,
}: ISbGetSingleMessage): Promise<SbMessage> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      // Test SB instances
      const params = new sb.MessageRetrievalParams();
      params.messageId = messageId;
      params.channelType = 'group';
      params.channelUrl = channel.url;
      params.includeMetaArray = true;
      sb.UserMessage.getMessage(params, (msg, err) => {
        if (err) {
          console.info('COULD NOT GET MESSAGE', params);
        } else {
          resolve(msg);
          console.info('MESSAGE GET', params, msg);
        }
      });
    }
  });
};

export const sbMessageReceiver = (): Promise<ChannelHandler> => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      const channelHandler = new sb.ChannelHandler();
      resolve(channelHandler);
    } else {
      reject("Couldn't establish channel handler");
    }
  });
};

export const sbMessagesQuery = (
  channel: GroupChannel,
): Promise<UserMessage[]> => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      const messages = channel.createPreviousMessageListQuery();

      messages.limit = MESSAGES_LIMIT;
      messages.reverse = true;
      messages.includeMetaArray = true;
      messages.includeReactions = true;
      messages.includeReplies = true;
      messages.includeParentMessageText = true;
      messages.includeReactions = true;
      messages.load((messages, err) =>
        err
          ? reject('SB_MESSAGES_LOAD_ERR')
          : resolve(messages as UserMessage[]),
      );
    } else {
      reject("Couldn't establish channel handler");
    }
  });
};

interface ISbAddReaction {
  message: UserMessage | FileMessage | AdminMessage | any;
  reaction: string;
  channel: GroupChannel;
  // userIds: string[];
}

export const sbReactMessage = ({
  channel,
  message,
  reaction,
}: // userIds,
ISbAddReaction): Promise<ReactionEvent> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb && channel) {
      channel.addReaction(message, reaction, (reactionEvent, err) => {
        console.log('reaction   ' + reaction.toString);
        if (err) {
          console.info('COULD NOT ADD REACTION');
        } else {
          console.info('REACTION ADDED', message, reaction);
          resolve(reactionEvent);
        }
      });
    }
  });
};

export const sbReactMessageRemove = ({
  channel,
  message,
  reaction,
}: // userIds,
ISbAddReaction): Promise<ReactionEvent> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb && channel) {
      channel.deleteReaction(message, reaction, (reactionEvent, err) => {
        if (err) {
          console.info('COULD NOT DELETE REACTION');
        } else {
          resolve(reactionEvent);
          // console.info('REACTION ADDED', message, reaction);
        }
      });
    }
  });
};

export const sbGetChannelByUrl = (url: string): Promise<GroupChannel> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      sb.GroupChannel.getChannel(url, (channel, err) => {
        if (err) {
          console.log(url);
          console.log(err);
          console.info('FAILED TO GET CHANNEL', url);
        } else {
          resolve(channel);
          //console.info('CHANNEL GET', channel);
        }
      });
    }
  });
};

export const sbPopInFindChannel = (url: string): Promise<GroupChannel[]> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      const listQuery = sb.GroupChannel.createPublicGroupChannelListQuery();
      listQuery.channelUrlsFilter = [url];
      listQuery.membershipFilter = 'all';
      listQuery.next((response, err) => {
        if (err) {
          console.log('hiiiii');
          console.info('ERROR FINDING CHANNEL', err);
        } else {
          resolve(response[0]);
        }
      });
    }
  });
};

export const sbLeaveChannel = (channel: GroupChannel): Promise<null> => {
  return new Promise((resolve) => {
    const sb = SendBird.getInstance();
    if (sb) {
      channel.leave((response, err) => {
        if (err) {
          console.info('ERROR LEAVING CHANNEL', err);
        } else {
          resolve(null);
        }
      });
    }
  });
};
