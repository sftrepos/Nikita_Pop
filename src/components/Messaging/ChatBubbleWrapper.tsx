import React, { useState } from 'react';
import { View, Pressable, Text, LayoutChangeEvent } from 'react-native';
import ChatBubble, { ChatBubbleProps } from 'components/Messaging/ChatBubble';
import EStyleSheet from 'react-native-extended-stylesheet';
import reactions, { reaction } from 'constants/reactions';
import { getId, getStoreToken } from 'util/selectors';
import store from 'store/index';
import { useTheme } from '@react-navigation/native';
import MessageDate, {
  MESSAGE_THRESHOLD,
  TMessageDate,
} from 'components/Messaging/MessageDate';
import { Reaction } from 'sendbird';
import CustomAvatar, {
  CustomAvatarProps,
} from '../../../assets/vectors/pochies/CustomAvatar';
import { useEffect } from 'react';
import { PopApi } from 'services';
import { Paragraph } from 'components/Text';

interface ChatBubbleWrapperProps extends ChatBubbleProps {
  reactionList: Array<Reaction>;
  onPressReaction?: (reaction: Reaction) => void;
  onLongPressReaction?: (reaction: Reaction) => void;
  avatarOnPress?: (userId: string) => void;
  avatar?: CustomAvatarProps;
  differentSender: boolean;
  differentNextSender: boolean;
  username: string;
}

const ChatBubbleWrapper = (props: ChatBubbleWrapperProps) => {
  const {
    reactionList,
    onPressReaction,
    right,
    dateParam,
    onPress,
    onLongPressReaction,
    avatar,
    avatarOnPress,
    differentSender,
    differentNextSender,
    username,
  } = props;
  const id = getId(store.getState());
  const { colors } = useTheme();
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showAvatar, setShowAvatar] = useState<boolean>(true);
  const [showUsername, setShowUsername] = useState<boolean>(true);

  const [yPos, setYPos] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setYPos(y);
    // console.log(y);
  };

  const handleOnPress = (pressableProp: any) => {
    setShowDate(true);
    onPress?.(pressableProp);
  };

  useEffect(() => {
    if (dateParam) {
      const messageDateDiff = dateParam.date - dateParam.prevDate;
      if (
        !differentSender &&
        messageDateDiff < MESSAGE_THRESHOLD &&
        !dateParam.isFirstMessage
      ) {
        setShowUsername(false);
      }

      if (!differentNextSender && !dateParam.isFirstMessage) {
        setShowAvatar(false);
      }
    }
  }, []);

  const AvatarDisplay = (show: boolean | undefined) => {
    if (show && avatar) {
      if (showAvatar) {
        return (
          <CustomAvatar
            scale={0.2}
            {...avatar}
            onPress={() => {
              avatarOnPress();
            }}
            customAvatarContainerStyle={[
              styles.avatarDisplay,
              { marginBottom: reactionList.length > 0 ? 35 : 0 },
            ]}
          />
        );
      } else {
        return <View style={styles.avatarDisplay} />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <View onLayout={onLayout} style={[{ transform: [{ translateY: yPos }] }]}>
      {dateParam && (
        <MessageDate
          date={dateParam?.date}
          prevDate={dateParam?.prevDate}
          isFirstMessage={dateParam?.isFirstMessage} // last index b/c of  inverted
          alwaysShow={showDate}
        />
      )}
      {!right && showUsername && (
        <Paragraph color={colors.gray} style={styles.username}>
          {username}
        </Paragraph>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: right ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
        }}>
        {AvatarDisplay(!right)}
        <View style={{ flexDirection: 'column', width: '100%' }}>
          <ChatBubble {...props} onPress={handleOnPress} />
          {reactionList.length > 0 && (
            <View style={[styles.container, right ? styles.right : null]}>
              {reactionList.map((item) => {
                const reactionType = reactions.find(
                  (el) => el.key === item.key,
                );
                return (
                  <Pressable
                    style={[
                      styles.emoji,
                      !item.userIds.find((el) => el === id) &&
                        styles.selectedEmoji && {
                          backgroundColor: colors.background,
                          borderColor: colors.background,
                        },
                    ]}
                    onPress={() => onPressReaction && onPressReaction(item)}
                    onLongPress={() => {
                      onLongPressReaction && onLongPressReaction(item);
                    }}>
                    <Text>{reactionType?.unicode}</Text>
                    {item.userIds.length > 1 && (
                      <Text style={styles.text}>{item.userIds.length}</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
        {/* {AvatarDisplay(right)} */}
      </View>
    </View>
  );
};

// prevents rerender every state change
const areEqual = (
  prevProps: ChatBubbleWrapperProps,
  nextProps: ChatBubbleWrapperProps,
) => {
  const { item } = nextProps;
  const { item: prevItem } = prevProps;

  /*if the props are equal, it won't update*/
  const isSelectedEqual = item === prevItem;

  return isSelectedEqual;
};

const styles = EStyleSheet.create({
  text: {
    // fontSize: '$fontMd',
    paddingLeft: '.1rem',
  },
  container: {
    flexShrink: 1,
    flexDirection: 'row',
    marginBottom: '0.25rem',
    width: '100%',
    // borderWidth: 1
  },
  right: {
    justifyContent: 'flex-end',
  },
  emoji: {
    paddingHorizontal: '.5rem',
    paddingVertical: '.3rem',
    backgroundColor: '$raspberry5',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '$raspberry50',
    marginHorizontal: '.2rem',
    marginBottom: '.2rem',
    flexDirection: 'row',
  },
  selectedEmoji: {
    borderColor: 'gray',
  },
  avatarDisplay: {
    padding: 0,
    margin: '.3rem',
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  username: {
    marginLeft: 50,
    marginTop: '1rem',
    fontSize: '.8rem',
  },
});

// export default ChatBubbleWrapper;
export default React.memo(ChatBubbleWrapper, areEqual);
