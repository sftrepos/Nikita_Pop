import { Paragraph } from 'components/Text';
import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import CustomAvatar, {
  CustomAvatarProps,
} from '../../../assets/vectors/pochies/CustomAvatar';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useAnalytics from 'util/analytics/useAnalytics';
import { navigate } from 'nav/RootNavigation';
import { isIphone } from 'util/phone';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    height: 20,
    fontWeight: '600',
    marginLeft: '.25rem',
  },
});

interface IMessagingHeader {
  avatar: CustomAvatarProps;
  displayName: string;
  onPress?: () => void;
}

const MessagingHeader = ({
  avatar,
  displayName,
  onPress,
}: IMessagingHeader): ReactElement => {
  const {
    colors: { text },
  } = useTheme();

  const analytics = useAnalytics();

  return (
    <Pressable
      onPress={() => {
        // Profile modal
        onPress && onPress();
        analytics.logEvent({ name: 'CHATROOM PROFILE OPEN', data: {} }, true);
      }}>
      <View style={styles.container}>
        <CustomAvatar
          scale={0.2}
          {...avatar}
          customAvatarContainerStyle={{ padding: 0 }}
        />
        <Paragraph color={text} style={styles.displayName}>
          {displayName}
        </Paragraph>
      </View>
    </Pressable>
  );
};

interface IGroupMessagingHeader {
  avatar: CustomAvatarProps;
  displayName: string;
}

export const GroupMessagingHeader = ({
  avatar,
  displayName,
}: IGroupMessagingHeader): ReactElement => {
  const {
    colors: { text },
  } = useTheme();

  const analytics = useAnalytics();

  return (
    <Pressable
      onPress={() => {
        // analytics.logEvent({ name: 'CHATROOM PROFILE OPEN', data: {} }, true);
      }}>
      <View style={styles.container}>
        <CustomAvatar
          scale={0.2}
          {...avatar}
          customAvatarContainerStyle={{ padding: 0 }}
        />
        <Paragraph color={text} style={styles.displayName}>
          {displayName}
        </Paragraph>
      </View>
    </Pressable>
  );
};

interface IEventMessagingHeader {
  displayName: string;
  emoji: string;
  onPress?: () => void;
}

export const EventMessagingHeader = ({
  emoji,
  displayName,
  onPress,
}: IEventMessagingHeader): ReactElement => {
  const {
    colors: { text },
  } = useTheme();
  const [headerHeight, setHeaderHeight] = React.useState(30);

  const analytics = useAnalytics();

  return (
    <Pressable
      onPress={() => {
        // analytics.logEvent({ name: 'CHATROOM PROFILE OPEN', data: {} }, true);
        if (onPress) {
          onPress();
        }
      }}>
      <View
        style={styles.container}
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}>
        <Paragraph
          style={{
            fontSize: isIphone() ? headerHeight * 0.9 : headerHeight * 0.75,
          }}>
          {emoji}
        </Paragraph>
        <Paragraph color={text} style={styles.displayName}>
          {displayName}
        </Paragraph>
      </View>
    </Pressable>
  );
};

export default MessagingHeader;
