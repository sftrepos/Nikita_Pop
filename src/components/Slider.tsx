import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Theme } from '@react-navigation/native';
import { Title2 } from 'components/Text';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import EStyleSheet from 'react-native-extended-stylesheet';
import SliderLabel from 'components/SliderLabel';

const styles = EStyleSheet.create({
  container: {
    paddingHorizontal: '1rem',
    paddingBottom: '1rem',
  },
  textTitle: {
    marginVertical: '1rem',
    marginBottom: '5rem',
  },
  textLabel: {
    paddingBottom: '1rem',
  },
  marker: {
    backgroundColor: 'gray',
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '1.5rem',
  },
});

type SelectColorTypes = {
  text: string;
  trackSelected: string;
  trackUnselected: string;
};

type LabelProps = {
  leftDiff: number;
  oneMarkerValue: number;
  twoMarkerValue: number;
  oneMarkerLeftPosition: number;
  twoMarkerLeftPosition: number;
  oneMarkerPressed: boolean;
  twoMarkerPressed: boolean;
};

interface SliderProps {
  data: string[];
  title: string;
  theme: Theme;
  enableLabels?: boolean;
  sliderLength?: number;
  globalSelected?: string[];
  selectedColors?: SelectColorTypes;
  getSelected: (selected: string[]) => void;
  customLabel?:
    | React.ComponentClass<LabelProps, any>
    | React.FunctionComponent<LabelProps>;
}

const Slider = ({
  data,
  title,
  theme,
  enableLabels,
  sliderLength,
  globalSelected,
  selectedColors,
  getSelected,
  customLabel,
}: SliderProps): React.ReactElement => {
  const { colors } = theme;
  const [selected, setSelected] = useState<string[]>(
    globalSelected ? globalSelected : data,
  );
  useEffect(() => {
    if (globalSelected) {
      setSelected(globalSelected);
    }
  }, [globalSelected]);

  function updateList(arr: string[]) {
    getSelected(arr);
  }

  const callBack = (value: number[]) => {
    const arr = getBetween(value[0], value[1]);
    setSelected(arr);
    updateList(arr);
  };

  // ====== translating string array to number array ======
  const getBetween = (first: number, last: number) => {
    const arr = [];
    for (let i = first; i <= last; i++) {
      arr.push(data[i]);
    }
    return arr;
  };

  const numberArray = (array: string[]) => {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      arr.push(i);
    }
    return arr;
  };

  const initialValues = (array: string[]): number[] => {
    if (array[0] == 'any') {
      return [0, data.length];
    } else {
      const first = array[0];
      const last = array[array.length - 1];
      if (first == last) {
        const ind = getCorrespondingIndex(first);
        return [ind, ind];
      } else {
        const firstInd = getCorrespondingIndex(first);
        const lastInd = getCorrespondingIndex(last);
        return [firstInd, lastInd];
      }
    }
  };

  const getCorrespondingIndex = (item: string) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i] == item) {
        return i;
      }
    }
    return 0;
  };

  //========= slider marker ==========
  const CustomMarker = (item: number) => {
    return (
      <>
        <View style={styles.marker} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Title2 style={[styles.textTitle]} color={colors.text}>
        {title}
      </Title2>
      <View
        style={{
          alignItems: 'center',
        }}>
        <MultiSlider
          trackStyle={{
            backgroundColor: selectedColors
              ? selectedColors.trackUnselected
              : 'lightgray',
            height: 5,
          }}
          enableLabel={enableLabels != null ? enableLabels : true}
          customLabel={customLabel ? customLabel : SliderLabel}
          isMarkersSeparated={true}
          selectedStyle={{
            backgroundColor: selectedColors
              ? selectedColors.trackSelected
              : 'gray',
          }}
          values={initialValues(selected)}
          sliderLength={
            sliderLength ? sliderLength : Dimensions.get('window').width * 0.7
          }
          onValuesChangeFinish={(value) => callBack(value)}
          optionsArray={numberArray(data)}
          step={1}
          allowOverlap={true}
          customMarkerLeft={(e) => CustomMarker(e.currentValue)}
          customMarkerRight={(e) => CustomMarker(e.currentValue)}
          snapped={false}
        />
      </View>
    </View>
  );
};

export default Slider;
