import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import WidgetRenderer from 'components/WidgetsV2/WidgetRenderer';
import { WidgetDisplayType } from 'screens/Profile';

interface IExpandedCarouselWidget {
  data: WidgetDisplayType;
}

const ExpandedCarouselWidget = ({
  data,
}: IExpandedCarouselWidget): ReactElement => {
  const { colors } = useTheme();
  const onPress = () => {};
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[{ backgroundColor: colors.card }]}>
          <WidgetRenderer data={data} />
        </View>
      )}
    </Pressable>
  );
};

const WidgetsV2 = {
  ExpandedCarouselWidget,
};

export default WidgetsV2;
