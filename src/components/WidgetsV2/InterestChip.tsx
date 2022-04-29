import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Paragraph } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Interest } from 'services/types';

const styles = EStyleSheet.create({
  chip: {
    padding: '0.25rem',
    paddingHorizontal: '0.5rem',
    borderRadius: 25,
    marginRight: '0.5rem',
    marginTop: '0.25rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
});

interface InterestChipProps {
  isCommon: boolean;
  interest: Interest;
  color: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const InterestChip = React.memo<InterestChipProps>(
  ({ interest, color, containerStyle, isCommon }) => {
    return (
      <View style={[styles.chip, containerStyle]}>
        <Paragraph color={color}>{interest.title}</Paragraph>
      </View>
    );
  },
);

export default InterestChip;
