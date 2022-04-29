import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ExtendedTheme } from '@react-navigation/native';
import CustomAvatar, {
  CustomAvatarProps,
} from 'assets/vectors/pochies/CustomAvatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = EStyleSheet.create({
  avatar: {
    alignSelf: 'center',
  },
});

interface IAvatarWithHeaders {
  containerStyle?: ViewStyle;
  leftChild?: any;
  rightChild?: any;
  avatarProps: AvatarProps;
}

export interface AvatarProps {
  text?: string;
  size?: number;
  url?: string;
  style?: ViewStyle;
  avatar?: CustomAvatarProps;
  children?: ReactNode;
  onPress?: () => void;
  theme: ExtendedTheme;
  pochi?: string;
  isNav?: boolean;
  scale?: number;
  containerStyle?: StyleProp<ViewStyle>;
  customAvatarContainerStyle?: StyleProp<ViewStyle>;
}

interface AvatarCustomProps {
  avatar: CustomAvatarProps;
  scaleXY?: number;
  customAvatarContainerStyle?: StyleProp<ViewStyle>;
}

const AvatarCustom = React.memo<AvatarCustomProps>(
  ({ avatar, scaleXY, customAvatarContainerStyle }) => {
    const { faceColor, hat, scale, faceType, bubbleColor, special } = avatar;
    return (
      <CustomAvatar
        faceColor={faceColor}
        scale={scaleXY || scale}
        faceType={faceType}
        bubbleColor={bubbleColor}
        hat={avatar.hat || false}
        customAvatarContainerStyle={customAvatarContainerStyle}
        special={special}
      />
    );
  },
);

const Avatar = React.memo<AvatarProps>(
  ({
    text,
    size,
    url,
    style,
    avatar,
    children,
    onPress,
    theme,
    customAvatarContainerStyle,
    containerStyle,
    isNav,
    pochi,
    scale,
  }) => {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View style={[styles.avatar, containerStyle]}>
            {avatar ? (
              <AvatarCustom
                scaleXY={scale}
                customAvatarContainerStyle={customAvatarContainerStyle}
                avatar={avatar}
              />
            ) : (
              <Icon name="question" size={20} color={theme.colors.text} />
            )}
          </View>
        )}
      </Pressable>
    );
  },
);

export const AvatarWrapper = React.memo<IAvatarWithHeaders>(
  ({ containerStyle, leftChild, avatarProps, rightChild }) => {
    return (
      <View style={containerStyle}>
        {leftChild}
        <Avatar {...avatarProps} />
        {rightChild}
      </View>
    );
  },
);

export default Avatar;
