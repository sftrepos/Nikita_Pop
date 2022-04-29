import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import StatusBar from 'components/StatusBar';
import { connect, useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import {
  clearDeck,
  getCards,
  getRequests,
  sendRequest,
} from 'features/Request/RequestActions';
import Carousel from './components/Carousel';
import {
  getStoreToken,
  getBrowseCards,
  getFilters,
  getId,
  getProfileData,
} from 'util/selectors';
import { Interest, ISendRequest, UniversityData } from 'services/types';
import { WidgetDisplayType } from 'screens/Profile';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import EStyleSheet from 'react-native-extended-stylesheet';
import { RootReducer } from 'store/rootReducer';
import { Amplitude } from '@amplitude/react-native';
import EditVaccineModal from 'components/Modals/EditVaccineModal';
import routes from 'nav/routes';
import { navigate, navigationRef } from 'nav/RootNavigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { PopApi } from 'services/api';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import SendBird from 'sendbird';
import ChatsSlice from 'features/Chats/ChatsSlice';

const styles = EStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export type TCard = {
  university: UniversityData;
  interest: [];
  card: WidgetDisplayType & { sequence: number };
  hasNewCards: false;
  identityId: string;
  avatar: CustomAvatarProps;
  timestamp: typeof Date;
  createdAt: string;
  hometown: string;
  type: string;
  username: string;
  background: string;
  sharedInterests: Interest[];
  cardNum: number;
};

export interface IBrowse {
  cards: TCard[];
  setupComplete: boolean;
  isFiltersLoading: boolean;
  isHomebase: boolean;
  isSendRequestSuccess: boolean;
  isLoadingSendRequest: boolean;
  isLoadingBrowsing: boolean;
  storeHasClearedDeck: boolean;
  dispatchSendRequest: (requestProps: ISendRequest) => void;
  dispatchGetBrowsingCards: ({
    index,
    shownCards,
  }: DispatchGetBrowsingCards) => void;
  requestIdInProgress: string;
  vaccinatedModalSeen: boolean;
}

export interface DispatchGetBrowsingCards {
  index: number;
  shownCards: TCard[];
}

let groupId = '';
const ampInstance = Amplitude.getInstance();

const Browse = ({
  dispatchGetBrowsingCards,
  isSendRequestSuccess,
  dispatchSendRequest,
  storeHasClearedDeck,
  isLoadingSendRequest,
  cards,
  requestIdInProgress,
  setupComplete,
  id,
  isHomebase,
  isLoadingBrowsing,
  globalFilters,
  dispatchClearDeck,
  vaccinatedModalSeen,
}: IBrowse) => {
  const theme = useTheme();
  const [cleared, setCleared] = useState(false);
  const dispatch = useDispatch();
  const sb = SendBird.getInstance();

  const getCards = (pg?: number) =>
    dispatchGetBrowsingCards({ index: pg || 0, shownCards: [] });

  useEffect(() => {
    dispatch(getRequests());
    ampInstance.setUserId(id);
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        // handle link in app
        if (JSON.stringify(link?.url) != undefined) {
          let str = '' + link?.url;
          groupId = str.substr(31, str.length);
          dispatch(ChatsSlice.actions.setGroupId(groupId));
          joinUsers();
          setTimeout(() => {
            navigate(routes.RECEPTION_STACK, { groupId: id });
          }, 1000);
        }
      });
  }, []);

  const token = useSelector((state) => getStoreToken(state));
  const [isLoadingCreation, setIsLoadingCreation] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const joinUsers = () => {
    setSelectedUsers((currentUsers) => [...currentUsers, '' + getId]);
    setIsLoadingCreation(true);
    PopApi.groupInvite(
      groupId,
      {
        id,
        inviter: id,
        members: [...selectedUsers],
        type: 'join',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => {
        if (res.error) {
          Toast.show({
            text1: 'Error in join',
            type: 'error',
            position: 'bottom',
          });
        } else {
          close();
          Toast.show({
            text1: 'Successfully Join',
            type: 'success',
            position: 'bottom',
          });
        }
      })
      .finally(() => {
        setIsLoadingCreation(false);
      });
  };

  useEffect(() => {
    setCleared((v) => v);
    if (setupComplete && globalFilters) {
      dispatchClearDeck();
      getCards(0);
    } else if (setupComplete) {
      getCards();
    }
  }, [setupComplete, globalFilters]);

  const [showEditVaccineModal, setShowEditVaccineModal] = useState(
    !vaccinatedModalSeen,
  );
  const renderEditVaccineBadge = () => {
    if (!isLoadingBrowsing && showEditVaccineModal) {
      return (
        <EditVaccineModal
          state={false}
          id={id}
          onClose={() => setShowEditVaccineModal(false)}
          isVisible={showEditVaccineModal}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar theme={theme} />
      {!cleared && (
        <Carousel
          dispatchGetBrowsingCards={dispatchGetBrowsingCards}
          isSendRequestSuccess={isSendRequestSuccess}
          isLoading={isLoadingSendRequest}
          isLoadingBrowsing={isLoadingBrowsing}
          requestIdInProgress={requestIdInProgress}
          sendRequest={dispatchSendRequest}
          data={cards}
          isHomebase={isHomebase}
        />
      )}
      {renderEditVaccineBadge()}
    </View>
  );
};

const mapStateToProps = (state: RootReducer) => ({
  isLoadingBrowsing: state.requests.isLoadingMatches,
  isSendRequestSuccess: state.requests.requestSuccess,
  isFiltersLoading: state.requests.isFiltersLoading,
  isLoadingSendRequest: state.requests.isLoading,
  requestIdInProgress: state.requests.requestIdInProgress,
  hasSendRequestFailed: state.requests.sendRequestFailed,
  cards: getBrowseCards(state),
  storeHasClearedDeck: state.requests.clearDeck,
  setupComplete: getProfileData(state)?.meta?.setupComplete,
  isHomebase: getFilters(state).isHomebase,
  globalFilters: getFilters(state),
  id: getId(state),
  vaccinatedModalSeen: getProfileData(state)?.meta?.vaccinatedModalSeen,
});

const mapDispatchToProps = (dispatch: (args: any) => void) => ({
  dispatchSendRequest: ({ receiverId, message, card }: ISendRequest) => {
    dispatch(sendRequest({ receiverId, message, card }));
  },
  dispatchGetBrowsingCards: ({
    index,
    shownCards,
  }: DispatchGetBrowsingCards) => {
    dispatch(getCards(index, shownCards));
  },
  dispatchClearDeck: () => {
    dispatch(clearDeck());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
