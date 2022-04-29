import React, { ReactElement, useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import HeaderModal from 'components/Modals/HeaderModal';
import { useTheme } from '@react-navigation/native';
import { GlobalModalHandler } from 'components/Modals/GlobalModal/GlobalModal';
import { classDesignations } from 'util/misc';

import Filter, {
  FilterType,
  initialFilters,
} from 'components/Modals/FilterModal/Filter';
import { getFilters, getLocalUserData } from 'util/selectors';
import { setAllFilters } from 'features/Request/RequestActions';
import {
  SET_FILTERS_DEFAULTS,
  SET_FILTERS_SUCCESS,
} from 'features/Request/RequestTypes';
import { Interest } from 'services/types';
import { RootReducer } from 'store/rootReducer';
import EStyleSheet from 'react-native-extended-stylesheet';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  containerHeader: {
    paddingTop: '1rem',
    flex: 1,
  },
});

interface FilterModalProps {
  globalFilters: typeof initialFilters;
  dispatchUpdateFilters: (filter: IFilters) => void;
  isFiltersLoading: boolean;
  data?: Record<string, unknown>;
  dispatchSetFilterLoading: () => void;
  dispatchResetFilters: () => void;
  localInterestData: Interest[];
}

export interface IFilters {
  class: string[];
  interests: string[];
  isHomebase: boolean;
}

const FilterModal = ({
  data,
  globalFilters,
  isFiltersLoading,
  dispatchUpdateFilters,
  dispatchSetFilterLoading,
  dispatchResetFilters,
  localInterestData,
}: FilterModalProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const [areChangesWritten, setChangesWrote] = useState(false);
  const [localFilters, setLocalFilters] = useState<IFilters>(globalFilters);

  const analytics = useAnalytics();

  const updateFilters = (filter: UpdateFilterType) => {
    setChangesWrote(false);
    const currentFilters = { ...localFilters };
    if (filter.type === 'isHomebase') {
      currentFilters[filter.type] =
        filter.filter[0] === 'Campus' ? true : false;
    } else {
      currentFilters[filter.type] = filter.filter;
    }
    setLocalFilters(currentFilters);
  };

  const resetFilters = () => {
    setChangesWrote(false);
    const currentFilters = {
      isHomebase: true,
      class: [...classDesignations],
      interests: ['any'],
    };
    setLocalFilters(currentFilters);
  };

  const onPressClose = () => {
    dispatchUpdateFilters(localFilters);
    analytics.logEvent(
      {
        name: 'FILTER MODAL CLOSE',
        data: globalFilters,
      },
      true,
    );
    GlobalModalHandler.hideModal();
  };

  // const onPressReset = () => {
  //   dispatchResetFilters();
  // };

  useEffect(() => {
    if (isFiltersLoading) {
      setChangesWrote(true);
      dispatchSetFilterLoading();
    }
  }, [isFiltersLoading]);

  return (
    <SafeAreaView
      style={[styles.containerHeader, { backgroundColor: colors.card }]}>
      <HeaderModal
        rightLabel="Reset"
        isLoading={isFiltersLoading}
        onPress={resetFilters}
        hasSuccess={areChangesWritten}
        title="Filter"
        theme={theme}
        onPressClose={onPressClose}
      />
      <ScrollView>
        <Filter
          filters={localFilters}
          updateFilters={updateFilters}
          theme={theme}
          type="isHomebase"
        />
        <Filter
          filters={localFilters}
          updateFilters={updateFilters}
          theme={theme}
          type="class"
        />
        <Filter
          filters={localFilters}
          updateFilters={updateFilters}
          theme={theme}
          type="interests"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export type UpdateFilterType = {
  type: FilterType;
  filter: string[];
};

const mapStateToProps = (state: RootReducer) => ({
  globalFilters: getFilters(state),
  isFiltersLoading: state.requests.isFiltersLoading,
  localInterestData: getLocalUserData(state).interest,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchUpdateFilters: (filter: IFilters) => dispatch(setAllFilters(filter)),
  dispatchSetFilterLoading: () => dispatch({ type: SET_FILTERS_SUCCESS }),
  dispatchResetFilters: () => dispatch({ type: SET_FILTERS_DEFAULTS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);
