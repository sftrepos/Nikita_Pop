import React, { ReactElement, useState } from 'react';
import { RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { getRequests } from 'features/Request/RequestActions';
import RequestRow from 'screens/Requests/RequestRow';

interface RequestListProps {
  fetchRequests: () => void;
  requests: Array<any>;
}

const styles = EStyleSheet.create({
  list: {},
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const RequestList = ({
  fetchRequests,
  requests,
}: RequestListProps): ReactElement => {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState([]);
  const theme = useTheme();
  const { colors } = theme;

  const renderItem = ({ item }) => {
    const {
      username,
      name,
      card,
      avatar,
      timestamp,
      message,
      hometown,
      university,
      identityId,
    } = item;
    return (
      <RequestRow
        theme={theme}
        username={username}
        university={university}
        hometown={hometown}
        name={name}
        card={card}
        avatar={avatar}
        timestamp={timestamp}
        message={message}
        requesterId={identityId}
      />
    );
  };

  const onEndReached = () => {
    // Load more requests?
  };

  const onRefresh = () => {
    if (searching) {
      return;
    }
    fetchRequests();
  };

  const keyExtractor = (item) => item.id;

  return (
    <SwipeListView
      data={searching ? search : requests}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      useNativeDriver
      keyExtractor={keyExtractor}
      disableLeftSwipe
      style={[{ backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={onRefresh}
          tintColor={colors.border}
        />
      }
    />
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetRequests: () => getRequests(),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestList);
