import React, { ReactElement } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActionButton from 'components/Buttons/ActionButton';
import { useTheme } from '@react-navigation/native';
import { GlobalModalHandler } from 'components/Modals/GlobalModal/GlobalModal';
import { setFilters } from 'features/Request/RequestActions';
import { UpdateFilterType } from 'components/Modals/FilterModal';
import { useDispatch, useSelector } from 'react-redux';
import { MATCH_CLEAR_DECK } from 'features/Request/RequestTypes';
import { getFilters } from 'util/selectors';

const styles = EStyleSheet.create({
  _s: {
    left: '-1.0 * 2.5rem',
  },
  refresh: {
    color: '$raspberry',
    textAlign: 'center',
    marginVertical: '1rem',
  },
  buttonContainer: {
    marginBottom: '0.5rem',
    marginHorizontal: '20%',
  },
  filterButton: {
    backgroundColor: '$grey5',
    borderWidth: 2,
    marginHorizontal: '20%',
  },
  buttonText: {
    fontStyle: 'normal',
    textAlign: 'center',
    fontSize: '$fontMd',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginHorizontal: '2rem',
  },
  textContainer: {
    marginBottom: '1rem',
  },
  textMessage: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
});

interface IEmptyCard {
  isHomebase: boolean;
}

const onPressFilter = (data) => {
  GlobalModalHandler.showModal({ type: 'filter', data });
};

const getHandleToggle = () => {
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();
  const setFilter = (filter: UpdateFilterType) => dispatch(setFilters(filter));
  const clear = () => dispatch({ type: MATCH_CLEAR_DECK });

  const handleToggle = () => {
    clear();
    setFilter({ type: 'isHomebase', filter: !filters.isHomebase });
  };
  return handleToggle;
};

const EmptyCard = ({ isHomebase }: IEmptyCard): ReactElement => {
  const { colors } = useTheme();
  const locationToCheckout = isHomebase ? 'National' : 'Campus';

  const handleToggle = getHandleToggle();

  return (
    <View>
      <View style={styles.textContainer}>
        <Text style={styles.textMessage}>
          You've seen all the people nearby!
        </Text>
        <Text style={styles.textMessage}>
          Change your filters or check later
        </Text>
      </View>
      <ActionButton
        onPress={handleToggle}
        label={'Check ' + locationToCheckout}
        type="default"
        gradient
        textStyle={styles.buttonText}
        containerStyle={styles.buttonContainer}
      />
      <ActionButton
        onPress={onPressFilter}
        label="Change Filters"
        type="outline"
        textGradient
        textStyle={[styles.buttonText]}
        containerStyle={[styles.filterButton, { borderColor: colors.primary }]}
      />
    </View>
  );
};

export default EmptyCard;
