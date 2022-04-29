import React, { ReactElement, useEffect } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRequests,
  acceptRequest,
  rejectRequest,
} from 'features/Request/RequestActions';
import { NotifierWrapper } from 'react-native-notifier';
import RequestCarousel from 'screens/Requests/RequestCarousel';
import { getChats } from 'features/Chat/ChatActions';

interface IRequestsProps {
  navigation: any;
}

const Requests = ({ navigation }: IRequestsProps): ReactElement => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests?.requests);
  const loading = useSelector((state) => state.requests.loadingRequests);
  const setupComplete = useSelector(
    (state) => state.user.localUser?.meta?.setupComplete,
  );

  const fetchRequests = () => {
    dispatch(getRequests());
  };

  const dispatchAcceptRequest = (id: string, msg: string) =>
    dispatch(acceptRequest(id, msg));
  const dispatchDeleteRequest = (id: string) => dispatch(rejectRequest(id));
  const refreshChats = () => dispatch(getChats(15));

  const handleAcceptRequest = (id: string, msg: string) => {
    dispatchAcceptRequest(id, msg);
    setTimeout(() => refreshChats(), 1000);
  };

  const handleDeleteRequest = (id: string) => {
    dispatchDeleteRequest(id);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const theme = useTheme();
  return (
    <NotifierWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar theme={theme} />
        {setupComplete && requests && !loading && (
          <RequestCarousel
            acceptRequest={handleAcceptRequest}
            deleteRequest={handleDeleteRequest}
            navigation={navigation}
            requests={requests}
            fetchRequests={fetchRequests}
          />
        )}
        {loading && (
          <View style={styles.screen}>
            <ActivityIndicator color="grey" size={32} />
          </View>
        )}
      </SafeAreaView>
    </NotifierWrapper>
  );
};

const styles = EStyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Requests;
