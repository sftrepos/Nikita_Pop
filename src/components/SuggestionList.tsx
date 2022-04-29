import React from 'react';
import { FlatList, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph } from './Text';

interface SuggestionListProps {
  data: string[];
  onPress: (s: string) => void;
  skipValues?: string[];
  optionStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const styles = EStyleSheet.create({
  suggestContainer: {
    marginTop: '0.75 rem',
    maxHeight: '5.75 rem',
  },
  suggestOption: {
    paddingVertical: '0.5 rem',
    marginHorizontal: '0.75 rem',
    borderTopWidth: 0,
    borderColor: '$grey4',
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
});

const SuggestionList = (props: SuggestionListProps): React.ReactElement => {
  const { data, onPress, skipValues, optionStyle, containerStyle } = props;
  const scrollRef = React.createRef<FlatList<string>>();

  const renderItem = (props: { item: string }) =>
    !skipValues || skipValues.indexOf(props.item) === -1 ? (
      <TouchableOpacity
        style={[styles.suggestOption, optionStyle]}
        onPress={() => {
          onPress(props.item);
          if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
          }
        }}>
        <Paragraph color={EStyleSheet.value('$grey3')}>{props.item}</Paragraph>
      </TouchableOpacity>
    ) : (
      <></>
    );
  return (
    <FlatList
      ref={scrollRef}
      style={[styles.suggestContainer, containerStyle]}
      showsVerticalScrollIndicator
      persistentScrollbar
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      nestedScrollEnabled
    />
  );
};

export default SuggestionList;
