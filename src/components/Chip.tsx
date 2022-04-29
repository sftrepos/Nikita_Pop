import React from 'react';
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Theme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph } from 'components/Text';
import { SelectColorTypes } from 'components/Modals/FilterModal/FilterChipRenderer';

const styles = EStyleSheet.create({
  chip: {
    borderRadius: 25,
    marginRight: '1rem',
    padding: '1rem',
  },
  text: {
    textTransform: 'capitalize',
  },
});

interface ChipProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  theme: Theme;
  text?: string;
  selected?: boolean;
  selectedColors?: SelectColorTypes;
  unselectedColors?: SelectColorTypes;
  onPress?: () => void;
}

const Chip = React.memo<ChipProps>(
  ({
    style,
    theme,
    textStyle,
    text,
    selectedColors,
    unselectedColors,
    selected,
    onPress,
  }) => {
    const { colors } = theme;

    const getBackgroundColor = () => {
      if (selected) {
        if (selectedColors) {
          return selectedColors.bg;
        }
        return colors.border;
      } else {
        if (unselectedColors) {
          return unselectedColors.bg;
        }
        return colors.card;
      }
    };

    const getTextColor = () => {
      if (selected) {
        if (selectedColors) {
          return 'white';
        }
        return colors.text;
      } else {
        if (unselectedColors) {
          return unselectedColors.text;
        }
        return colors.text;
      }
    };

    const renderChip = () => (
      <View
        style={[styles.chip, style, { backgroundColor: getBackgroundColor() }]}>
        <Paragraph
          style={[styles.text, textStyle, { color: getTextColor() }]}
          color={colors.text}>
          {text}
        </Paragraph>
      </View>
    );

    return (
      <>
        {onPress ? (
          <Pressable onPress={onPress}>{renderChip()}</Pressable>
        ) : (
          <>{renderChip()}</>
        )}
      </>
    );
  },
);

export default Chip;
