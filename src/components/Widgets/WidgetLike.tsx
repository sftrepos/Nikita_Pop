import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { WidgetPlainType } from 'screens/Profile';

const styles = EStyleSheet.create({
  wrap: {
    position: 'absolute',
    right: '1rem',
    top: 0,
    padding: '0.5rem',
    elevation: 1,
    borderRadius: 25,
    zIndex: 100,
  },
  iconWrapper: {
    /* here is where to potentially change icon? */
    /*paddingBottom: '0.5rem'*/
  },
});

interface WidgetLikeProps {
  onLike: () => void;
  isLiked: boolean;
  widgetType: WidgetPlainType;
}

interface WidgetLikeButtonProps {
  color: string;
  onPress: () => void;
  icon: string;
}

const WidgetLikeButton = ({ color, icon, onPress }: WidgetLikeButtonProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.iconWrapper]}>
        <Icon name={icon} size={25} color={color} />
      </View>
    )}
  </Pressable>
);

const WidgetLike = ({
  onLike,
  isLiked,
  widgetType,
}: WidgetLikeProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card }]}>
      <WidgetLikeButton
        color={
          isLiked ? colors.notification : widgetType == 'gif' ? 'white' : 'gray'
        }
        icon={isLiked ? 'heart' : 'heart-outline'}
        onPress={onLike}
      />
    </View>
  );
};

export default WidgetLike;
