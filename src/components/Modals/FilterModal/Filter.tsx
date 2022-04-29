import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FilterChipRenderer from 'components/Modals/FilterModal/FilterChipRenderer';
import { Theme } from '@react-navigation/native';
import {
  IFilters,
  UpdateFilterType,
} from 'components/Modals/FilterModal/index';
import { classDesignations, getStringArrayByKey } from 'util/misc';
import { getLocalUserData } from 'util/selectors';
import store from 'store/index';
import { Interest } from 'services/types';
import { Subtitle } from 'components/Text';
import _ from 'lodash';

const styles = EStyleSheet.create({
  interestSubtitleText: {
    marginLeft: '1rem',
  },
});

export type FilterType = 'class' | 'interests' | 'isHomebase';

export const initialFilters = {
  class: [...classDesignations],
  interests: ['any'],
  isHomebase: true,
};

interface FilterProps {
  type: FilterType;
  theme: Theme;
  filters: IFilters;
  updateFilters: (filter: UpdateFilterType) => void;
}

const classFilter = ['any', ...classDesignations];
const homebaseFilter = ['National', 'Campus'];
const getInterestsFilterData = () => {
  const localUserInterests = getLocalUserData(store.getState()).interest;
  const localUserInterestsStrArr = getStringArrayByKey<Interest[]>(
    localUserInterests,
    'title',
  );

  localUserInterestsStrArr.unshift(...initialFilters.interests);
  return localUserInterestsStrArr;
};

const Filter = ({
  type,
  theme,
  filters,
  updateFilters,
}: FilterProps): ReactElement => {
  const { colors } = theme;
  // console.log('filters', filters);

  const updateFilter = (selected: string[], type: FilterType) => {
    updateFilters({ filter: selected, type });
  };

  const renderFilter = () => {
    switch (type) {
      case 'interests': {
        const interestData = getInterestsFilterData();
        return (
          <>
            <FilterChipRenderer
              selectedColors={{ text: 'white', bg: colors.secondary }}
              unselectedColors={{
                text: colors.secondary,
                bg: colors.card,
              }}
              globalSelected={filters.interests}
              data={interestData}
              type="selective-any"
              theme={theme}
              title="Interests"
              getSelected={(data) => updateFilter(data, 'interests')}
            />

            {interestData.length === 1 && (
              <Subtitle style={styles.interestSubtitleText} color={colors.gray}>
                Update your interests to see new filters!
              </Subtitle>
            )}
          </>
        );
      }
      case 'class':
        return (
          <FilterChipRenderer
            type="selective-any"
            selectedColors={{ text: colors.text, bg: colors.purple }}
            unselectedColors={{
              text: colors.purple,
              bg: colors.card,
            }}
            data={classFilter}
            title="Class"
            theme={theme}
            globalSelected={
              _.isEqual(filters.class, classDesignations)
                ? ['any']
                : filters.class
            }
            getSelected={(data) => {
              data[0] === 'any' && data.length === 1
                ? updateFilter(classDesignations, 'class')
                : updateFilter(data, 'class');
            }}
          />
        );
      case 'isHomebase':
        return (
          <FilterChipRenderer
            globalSelected={filters.isHomebase ? 'Campus' : 'National'}
            selectedColors={{ text: 'white', bg: EStyleSheet.value('$mango') }}
            unselectedColors={{
              text: EStyleSheet.value('$mango'),
              bg: colors.card,
            }}
            getSelected={(data) => updateFilter(data, 'isHomebase')}
            title="Campus"
            data={homebaseFilter}
            type="stretch"
            theme={theme}
          />
        );
      default:
        return <></>;
    }
  };
  return <View style={styles.container}>{renderFilter()}</View>;
};

export default Filter;
