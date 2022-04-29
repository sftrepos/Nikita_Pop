import React from 'react';
import { connectStats } from 'react-instantsearch/connectors';
import { Text } from 'react-native';

interface StatsParams {
  processingTimeMS: number;
  nbHits: number;
  nbSortedHits: number;
  areHitsSorted: Boolean;
}

// Returning number of live users
const Stats = (input: StatsParams) => {
  return input.nbHits;
};

export default connectStats(Stats);
