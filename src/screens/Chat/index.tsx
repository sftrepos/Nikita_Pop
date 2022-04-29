import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ChatsView from 'screens/Chats/ChatsView';
import { getChats } from 'features/Chat/ChatActions';
import { ChatsScreenNavigationProp } from 'nav/types';
import { getId } from 'util/selectors';
import { RootReducer } from 'store/rootReducer';
import { ChatItem } from 'screens/Chats/ConversationList';
import useAnalytics from 'util/analytics/useAnalytics';

export interface IChats {
  chats: Map<string, ChatItem>;
  identityId: string;
  chatsLoaded: boolean;
  dispatchGetChats: (querySize?: number) => void;
  navigation: ChatsScreenNavigationProp;
  tutorialStage: number;
  setupComplete: boolean;
  requests: any;
  chatsLoading: boolean;
}

const Chats = ({
  dispatchGetChats,
  chats,
  navigation,
  chatsLoaded,
  identityId,
  setupComplete,
  tutorialStage,
  requests,
  chatsLoading,
}: IChats) => {
  const [chatState, setChatState] = useState(chats);

  useEffect(() => {
    if (!chats && setupComplete) {
      dispatchGetChats();
    }
    setChatState(chats);
  }, [chats]);

  useEffect(() => {
    if (!chatsLoading) dispatchGetChats();
  }, [requests]);

  const analytics = useAnalytics();

  return (
    <ChatsView
      chatsLoading={chatsLoading}
      tutorialStage={tutorialStage}
      requests={requests}
      identityId={identityId}
      chatsLoaded={chatsLoaded}
      navigation={navigation}
      dispatchGetChats={dispatchGetChats}
      chats={chatState}
      setupComplete={setupComplete}
    />
  );
};

const mapStateToProps = (state: RootReducer) => ({
  chats: state.chats.chats,
  chatsLoaded: state.chats.chatsLoaded,
  identityId: getId(state),
  setupComplete: state.user.localUser.meta?.setupComplete,
  tutorialStage: state.user.localUser.meta?.tutorialStage,
  chatsLoading: state.chats.chatsLoading,
  requests: state.requests.requests,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchGetChats: (querySize?: number) => dispatch(getChats(querySize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chats);
