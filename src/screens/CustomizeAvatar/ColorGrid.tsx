import React, { ReactElement, ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

interface ColorGridProps {
  setColor: (color: string) => void;
  colors: string[];
  selectedColor: string;
}

const ColorGrid = ({
  setColor,
  colors,
  selectedColor,
}: ColorGridProps): ReactElement => {
  return (
    <View style={styles.grid}>
      {colors.map((col) => (
        <ColorBubble
          onPress={setColor}
          color={col}
          selectedColor={selectedColor}
        />
      ))}
    </View>
  );
};

interface ColorBubbleProps {
  color: string;
  onPress: (color: string) => void;
  selectedColor: string;
}

const ColorBubble = ({ color, onPress, selectedColor }: ColorBubbleProps) => {
  const handleOnPress = () => onPress(color);

  const isSelected = selectedColor === color;

  return (
    <View style={styles.bubbleContainer}>
      <TouchableOpacity onPress={handleOnPress}>
        <View
          style={[
            styles.bubbleOuter,
            isSelected ? styles.bubbleSelected : null,
          ]}>
          <View style={[styles.bubble, { backgroundColor: color }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = EStyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleOuter: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white',
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.62,

    elevation: 4,
  },
  bubble: {
    borderRadius: 65,
    height: 65,
    width: 65,
  },
  bubbleContainer: {
    margin: '1.5rem',
  },
  bubbleSelected: {
    backgroundColor: 'black',
  },
});

export default ColorGrid;
