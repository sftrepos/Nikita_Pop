import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/AntDesign';
import LagoonGradient from '../Gradients/LagoonGradient';

interface ResponsePanelProps {
  options?: IResponseChoice[];
  onPress: (value: IResponseChoice) => void;
  answer?: string;
  paginate?: boolean;
  onPressNext?: () => void;
  fetching: boolean;
  onPressMulti: (resp: IResponseChoice) => void;
  multiAnswers?: IResponseChoice[];
  isMulti: boolean;
}

export interface IResponseChoice {
  key: string;
  label: string;
}

const MAX_PAGE = 4;

const ResponsePanel = ({
  options = [],
  onPress,
  answer,
  paginate,
  onPressNext,
  fetching,
  onPressMulti,
  multiAnswers,
  isMulti,
}: ResponsePanelProps): React.ReactElement<ResponsePanelProps> => {
  const [page, setPage] = useState<number>(0);

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleForward = () => {
    if (page < MAX_PAGE) {
      setPage(page + 1);
      if (!!onPressNext && options.length <= (page + 1) * 4) {
        onPressNext();
      }
    }
  };

  useEffect(() => {
    if (paginate && options.length) {
      setDisplayedOpts(
        options.slice(page * 4, Math.min(options.length, (page + 1) * 4)),
      );
    } else if (options.length) {
      setDisplayedOpts(options);
    }
  }, [options, page]);

  const [displayedOpts, setDisplayedOpts] = useState<IResponseChoice[]>(
    paginate && options.length
      ? options.slice(0, Math.min(options.length, 4))
      : options,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {paginate && (
        <View style={styles.arrowContainer}>
          <TouchableOpacity
            style={styles.arrow}
            onPress={handleBack}
            disabled={page == 0}>
            <Icon
              name="arrowleft"
              size={28}
              color={page === 0 ? EStylesheet.value('$grey3') : 'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrow}
            onPress={handleForward}
            disabled={fetching || page === MAX_PAGE}>
            <Icon
              name="arrowright"
              color={
                page === MAX_PAGE || fetching
                  ? EStylesheet.value('$grey3')
                  : 'black'
              }
              size={28}
            />
          </TouchableOpacity>
        </View>
      )}
      {displayedOpts.map((opt: IResponseChoice) => (
        <Button
          option={opt}
          onPress={isMulti ? onPressMulti : onPress}
          selected={
            isMulti
              ? !!multiAnswers?.find((x) => x.key == opt.key)
              : opt.key === answer
          }
        />
      ))}
      {fetching && <ActivityIndicator style={{ margin: 24 }} />}
    </ScrollView>
  );
};

interface IBtn {
  option: IResponseChoice;
  onPress: (e: IResponseChoice) => void;
  selected: boolean;
}

const Button = ({ option, onPress, selected }: IBtn) => {
  return (
    <TouchableOpacity onPress={() => onPress(option)}>
      {selected ? (
        <LagoonGradient style={styles.selected}>
          <View
            style={[
              styles.buttonContainer,
              selected ? styles.buttonSelected : null,
            ]}>
            <Text style={styles.text}>{option.label}</Text>
          </View>
        </LagoonGradient>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.text}>{option.label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = EStylesheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grey4',
    padding: '1rem',
  },
  content: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    backgroundColor: 'white',
    width: '11rem',
    height: '3.5rem',
    padding: '.75rem',
    borderRadius: '.75rem',
    marginVertical: '0.5rem',

    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 400)': {
      width: '9rem',
      height: '2.5rem',
      padding: 0,
      marginHorizontal: '0.5rem',
    },
  },
  buttonSelected: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    '@media (max-width: 400)': {
      fontSize: '$fontXS',
    },
  },
  selected: {
    borderRadius: '.75rem',
    padding: '0.1rem',
    marginVertical: '0.5rem',
    '@media (max-width: 400)': {
      marginHorizontal: '0.5rem',
    },
  },
  arrowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginVertical: '.5rem',
  },
  arrow: {
    marginHorizontal: '2rem',
  },
});

export default ResponsePanel;
