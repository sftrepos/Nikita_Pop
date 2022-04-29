import React, { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { isIphoneX } from 'util/phone';

const styles = EStyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: '0.5rem',
    top: isIphoneX() ? 44 : 10,
    width: 100,
    elevation: 1,
  },
});

interface DistributionMapMenuProps {
  onToggle: () => void;
  onSparse: () => void;
  onRegular: () => void;
  onConcentrated: () => void;
  isToggled: boolean;
}

interface DistributionMapMenuButtonProps {
  color: string;
  onPress: () => void;
  icon: string;
}
const DistributionMapMenuButton = ({
  color,
  icon,
  title,
  onPress,
  type,
}: DistributionMapMenuButtonProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.iconWrapper, !icon && { paddingLeft: 10 }]}>
        {icon ? (
          <Icon name={icon} size={35} color={color} />
        ) : (
          <Text style={{ marginVertical: 5 }}>{title}</Text>
        )}
      </View>
    )}
  </Pressable>
);

const DistributionMapMenuItem = ({
  color,
  title,
  onPress,
  type,
}: DistributionMapMenuButtonProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.iconWrapper, !icon && { paddingLeft: 10 }]}>
        <Text style={{ marginVertical: 5 }}>{title}</Text>
      </View>
    )}
  </Pressable>
);

const DistributionMapMenu = ({
  onToggle,
  onSparse,
  onRegular,
  onConcentrated,
  isToggled,
}: DistributionMapMenuProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const wrapToggleStyle = {
    backgroundColor: 'white',
    top: 0,
    paddingTop: 30,
  };

  const wrapToggleStyleT = {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 5,
    top: 30,
    width: 100,
    elevation: 1,
  };

  return (
    <View style={[styles.wrap]}>
      <Menu
        visible={isToggled}
        onDismiss={onToggle}
        anchor={
          <DistributionMapMenuButton
            color={colors.text}
            icon="menu-outline"
            onPress={onToggle}
            type={'icon'}
          />
        }>
        <Menu.Item onPress={() => onRegular()} title="Regular distribution" />
        <Divider />
        <Menu.Item onPress={() => onSparse()} title="Sparse distribution" />
        <Divider />
        <Menu.Item
          onPress={() => onConcentrated()}
          title="Concentrated distribution"
        />
      </Menu>
    </View>
  );
};

export default DistributionMapMenu;
