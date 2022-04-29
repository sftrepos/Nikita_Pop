import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connectInfiniteHits } from 'react-instantsearch/connectors';

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});

const InfiniteHits = ({ hits, hasMore, refineNext }) => (
  // <FlatList
  //   data={hits}
  //   keyExtractor={item => item.objectID}
  //   onEndReached={() => hasMore && refineNext()}
  //   renderItem={({ item }) => (
  //     <View style={styles.item}>
  //     </View>
  //   )}
  // />
  <></>
);

export default connectInfiniteHits(InfiniteHits);
