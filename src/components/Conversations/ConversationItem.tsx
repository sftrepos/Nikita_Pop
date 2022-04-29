import React, { ReactElement, useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConversationRowRight from 'components/Messaging/ConversationRowRight';
import CustomAvatar, {
  CustomAvatarProps,
} from '../../../assets/vectors/pochies/CustomAvatar';
import { Paragraph } from 'components/Text';

// This renders each conversation in the conversation list

const styles = EStyleSheet.create({
  list: {},
  avatar: {},
  renderEventAvatar: {
    height: '4.15625rem',
    width: '4.15625rem',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export type TConversationItem = {
  user: string;
  lastMessage: string;
  onPress: () => void;
  isOnline: boolean;
  avatar?: CustomAvatarProps;
  lastMessageDate: number;
};

const ConversationItem = ({
  user,
  lastMessage,
  onPress,
  isOnline,
  avatar,
  lastMessageDate,
  index,
}: TConversationItem): ReactElement => {
  const { colors } = useTheme();
  return (
    <List.Item
      style={[styles.list, { backgroundColor: colors.card }]}
      title={user}
      titleStyle={{ color: colors.text }}
      descriptionStyle={{ color: colors.gray }}
      description={lastMessage}
      descriptionNumberOfLines={2}
      onPress={onPress}
      left={() => (
        <CustomAvatar
          {...avatar}
          customAvatarContainerStyle={styles.avatar}
          scale={0.35}
        />
      )}
      right={() => (
        <ConversationRowRight isOnline={isOnline} t={lastMessageDate} />
      )}
    />
  );
};

// This is rendering for group conversations in the conversation list

export type TGroupConversationItem = {
  groupName?: string;
  users: string[];
  lastMessage: string;
  onPress: () => void;
  isOnline: boolean;
  avatar?: CustomAvatarProps;
  lastMessageDate: number;
};

const MAX_NAME_DISPLAY = 2;

export const GroupConversationItem = ({
  groupName,
  users,
  lastMessage,
  onPress,
  isOnline,
  avatar,
  lastMessageDate,
  index,
}: TGroupConversationItem): ReactElement => {
  const { colors } = useTheme();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (groupName) {
      setDisplayName(groupName);
    } else {
      let newDisplayName: string;
      if (users.length === 0) {
        newDisplayName = 'You';
      } else if (users.length === 1) {
        newDisplayName = users[0];
      } else {
        newDisplayName = `${users[0]}, + ${users.length - 1} more`;
      }
      setDisplayName(newDisplayName);
    }
  }, [groupName]);

  return (
    <List.Item
      style={[styles.list, { backgroundColor: colors.card }]}
      title={displayName}
      titleStyle={{ color: colors.text }}
      descriptionStyle={{ color: colors.gray }}
      description={lastMessage}
      descriptionNumberOfLines={2}
      onPress={onPress}
      left={() => (
        <CustomAvatar
          {...avatar}
          customAvatarContainerStyle={styles.avatar}
          scale={0.35}
        />
      )}
      right={() => (
        <ConversationRowRight isOnline={isOnline} t={lastMessageDate} />
      )}
    />
  );
};

// This is rendering for popins in the conversation list

export type TEventConversationItem = {
  groupName: string;
  lastMessage: string;
  onPress: () => void;
  isOnline: boolean;
  emoji: string;
  lastMessageDate: number;
  groupId: string;
};

export const EventConversationItem = ({
  groupName,
  lastMessage,
  onPress,
  groupId,
  isOnline,
  emoji,
  lastMessageDate,
}: TEventConversationItem): ReactElement => {
  const { colors } = useTheme();
  const colorTypes = ['#66CAEA', '#FFA48F', '#FFD97B'];

  const getRandomColor = (id: String) => {
    let hash = 0,
      i,
      chr;
    for (i = 0; i < id.length; i++) {
      chr = id.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    const randomColor = colorTypes[Math.abs(hash) % colorTypes.length];
    return randomColor;
  };
  const color = getRandomColor(groupId);

  return (
    <List.Item
      style={[styles.list, { backgroundColor: colors.card }]}
      title={groupName}
      titleStyle={{ color: colors.text }}
      descriptionStyle={{ color: colors.gray }}
      description={lastMessage}
      descriptionNumberOfLines={2}
      onPress={onPress}
      left={() => {
        return (
          <View style={[styles.renderEventAvatar, { backgroundColor: color }]}>
            <Paragraph style={{ fontSize: 36 }}>{emoji}</Paragraph>
          </View>
        );
      }}
      right={() => (
        <ConversationRowRight isOnline={isOnline} t={lastMessageDate} />
      )}
    />
  );
};

export default ConversationItem;
