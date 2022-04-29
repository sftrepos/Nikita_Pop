import React, { ReactElement, ReactNode } from 'react';
import TouchableScale from 'react-native-touchable-scale';
import { touchableScaleTensionProps } from 'styles/commonStyles';
import { View } from 'react-native';
import { Paragraph } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

const styles = EStyleSheet.create({
  lieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0.5rem',
    paddingHorizontal: '1rem',
    marginTop: '0.5rem',
    borderRadius: 25,
  },
  refreshIcon: {
    position: 'absolute',
    right: 0,
    paddingRight: '1rem',
  },
});

interface IGameLie {
  onPressLie: (idx: number) => void;
  id: number;
  children: ReactNode;
}

const GameLie = ({ onPressLie, id, children }: IGameLie): ReactElement => {
  const { colors } = useTheme();
  return (
    <TouchableScale
      {...touchableScaleTensionProps}
      onPress={() => onPressLie(id)}>
      <View style={styles.lieContainer}>
        <Paragraph color={colors.text}>{children}</Paragraph>
        <View style={[styles.refreshIcon]}>
          <Icon name="sync" size={15} color={colors.text} />
        </View>
      </View>
    </TouchableScale>
  );
};

export default GameLie;
