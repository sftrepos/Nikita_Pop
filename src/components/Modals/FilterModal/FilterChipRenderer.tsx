import React, { ReactElement, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Title2 } from 'components/Text';
import { Theme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Chip from 'components/Chip';

const styles = EStyleSheet.create({
  textTitle: {
    marginVertical: '1rem',
  },
  stretchTextBoldCenter: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  _calcContainerStretch: {
    width: '100% - 3rem',
  },
  container: {
    paddingHorizontal: '1rem',
  },
  containerChips: {
    flexDirection: 'row',
  },
  flatlist: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flatlistStretch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  icon: { marginLeft: '0.5rem' },
  stretch: {
    marginRight: 0,
    alignItems: 'center',
    borderRadius: 5,
  },
  chip: {
    marginBottom: '0.5rem',
    marginRight: '0.5rem',
    padding: '0.75rem',
  },
});

export type SelectColorTypes = {
  text: string;
  bg: string;
};

interface FilterChipRendererProps {
  data: string[];
  type: 'selective' | 'stretch' | 'selective-any';
  theme: Theme;
  title: string;
  globalSelected?: string[];
  selectedColors?: SelectColorTypes;
  unselectedColors?: SelectColorTypes;
  getSelected: (selected: string[]) => void;
}

const FilterChipRenderer = ({
  data,
  type,
  title,
  theme,
  selectedColors,
  unselectedColors,
  globalSelected,
  getSelected,
}: FilterChipRendererProps): ReactElement => {
  const [selected, setSelected] = useState<string[]>(['any']);

  useEffect(() => {
    if (globalSelected) {
      setSelected(globalSelected);
    }
  }, [globalSelected]);

  const onPressChip = (item: string) => {
    let currentSelectList = [...selected];
    const doesListHaveItem = currentSelectList.includes(item);

    function updateList() {
      getSelected(currentSelectList);
    }

    switch (type) {
      case 'stretch':
        if (!doesListHaveItem) {
          currentSelectList = [item];
          updateList();
        }
        break;

      case 'selective-any':
        if (item === 'any') {
          currentSelectList = [item];
        } else {
          if (currentSelectList.includes('any')) {
            currentSelectList = [item];
          } else {
            if (doesListHaveItem) {
              if (currentSelectList.length === 1) {
                currentSelectList = ['any'];
              } else {
                currentSelectList = currentSelectList.filter((e) => e !== item);
              }
            } else {
              currentSelectList.push(item);
            }
          }
        }
        updateList();
        break;

      case 'selective':
        if (currentSelectList.length === data.length || doesListHaveItem) {
          if (currentSelectList.length === 1) {
            currentSelectList = [...data];
          } else {
            currentSelectList = currentSelectList.filter((e) => e !== item);
          }
        } else {
          currentSelectList.push(item);
        }
        updateList();
        break;
    }
  };

  const renderItem = ({ item }: { item: string; index: number }) => {
    switch (type) {
      case 'selective':
        return (
          <Chip
            text={item}
            theme={theme}
            style={[
              styles.chip,
              { borderColor: selectedColors?.bg, borderWidth: 2 },
            ]}
            onPress={() => onPressChip(item)}
            selected={selected.includes(item)}
            selectedColors={selectedColors}
            unselectedColors={unselectedColors}
          />
        );
      case 'selective-any':
        return (
          <Chip
            text={item}
            theme={theme}
            style={[
              styles.chip,
              { borderColor: selectedColors?.bg, borderWidth: 2 },
            ]}
            onPress={() => onPressChip(item)}
            selected={selected.includes(item)}
            selectedColors={selectedColors}
            unselectedColors={unselectedColors}
          />
        );
      case 'stretch':
        return (
          <Chip
            selectedColors={selectedColors}
            unselectedColors={unselectedColors}
            selected={selected.includes(item)}
            onPress={() => onPressChip(item)}
            style={[
              styles.chip,
              {
                width: styles._calcContainerStretch.width / data.length,
                borderColor: selectedColors?.bg,
                borderWidth: 2,
              },
            ]}
            textStyle={styles.stretchTextBoldCenter}
            theme={theme}
            text={item}
          />
        );
    }
  };

  const { colors } = theme;
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Title2 style={[styles.textTitle]} color={colors.text}>
          {title}
        </Title2>
      </View>
      <View style={styles.containerChips}>
        <FlatList
          contentContainerStyle={[styles.flatlist]}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => `i-${item}`}
        />
      </View>
    </View>
  );
};

export default FilterChipRenderer;
