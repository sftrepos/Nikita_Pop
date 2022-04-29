import React, { ReactElement } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';

interface AutocompleteProps {
  options: Array<string>;
  searchString: string;
  onPress: (opt: string) => void;
  numChoices?: number;
}

//Warning do not allow special regex characters in searchString!
const Autocomplete = ({
  searchString = '',
  options,
  onPress,
  numChoices = 3,
}: AutocompleteProps): ReactElement => {
  const regex = RegExp(searchString?.toLowerCase());
  const shownOptions = options
    .filter((txt) => regex.test(txt?.toLowerCase()))
    .slice(0, numChoices);
  if (
    searchString?.length > 0 &&
    shownOptions?.length > 0 &&
    searchString !== shownOptions[0]
  )
    return (
      <View style={styles.container}>
        {shownOptions.map((opt) => (
          <TouchableOpacity onPress={() => onPress(opt)}>
            <View style={styles.optionContainer}>
              <Text style={styles.text}>{opt}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  else return <></>;
};

const styles = EStylesheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: '1.5rem',
  },
  optionContainer: {
    flexGrow: 1,
    paddingVertical: '1rem',
    borderTopWidth: EStylesheet.hairlineWidth,
    borderColor: '$grey4',
  },
  text: {
    fontSize: '$fontMd',
  },
});

export default Autocomplete;
