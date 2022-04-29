import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: '1rem',
    top: 0,
    padding: '0.5rem',
    elevation: 1,
    borderRadius: 25,
    zIndex: 100,
  },
  iconWrapper: {
    paddingBottom: '0.5rem',
  },
});

interface WidgetModifierMenuProps {
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isToggled: boolean;
}

interface WidgetModifierMenuButtonProps {
  color: string;
  onPress: () => void;
  icon: string;
}

const WidgetModifierMenuButton = ({
  color,
  icon,
  onPress,
}: WidgetModifierMenuButtonProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.iconWrapper]}>
        <Icon name={icon} size={25} color={color} />
      </View>
    )}
  </Pressable>
);

const WidgetModifierMenu = ({
  onToggle,
  onDelete,
  onEdit,
  isToggled,
}: WidgetModifierMenuProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  const wrapToggleStyle = {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,

    elevation: 5,
  };

  return (
    <View style={[styles.wrap, isToggled && wrapToggleStyle]}>
      {isToggled ? (
        <>
          <WidgetModifierMenuButton
            color={colors.gray}
            icon="dots-vertical"
            onPress={onToggle}
          />
          <WidgetModifierMenuButton
            color={colors.gray}
            icon="pencil-outline"
            onPress={onEdit}
          />
          <WidgetModifierMenuButton
            color={colors.gray}
            icon="trash-can-outline"
            onPress={onDelete}
          />
        </>
      ) : (
        <WidgetModifierMenuButton
          color={colors.text}
          icon="dots-vertical"
          onPress={onToggle}
        />
      )}
    </View>
  );
};

export default WidgetModifierMenu;
