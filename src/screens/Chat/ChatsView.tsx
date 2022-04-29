import React, { ReactElement } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import { IChats } from 'screens/Chats/index';
import ConversationList from 'screens/Chats/ConversationList';
import { ActivityIndicator } from 'react-native';
import commonStyles from 'styles/commonStyles';
import EStylesheet from 'react-native-extended-stylesheet';
import PochiRow from 'screens/Chats/PochiRow';

const styles = EStylesheet.create({
  refresh: {
    color: '$raspberry',
  },
});

const ChatsView = ({
  chats,
  dispatchGetChats,
  navigation,
  chatsLoaded,
  identityId,
  setupComplete,
  chatsLoading,
}: IChats): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <SafeAreaView>
      <StatusBar theme={theme} />
      {!setupComplete && <PochiRow navigation={navigation} />}
      {chatsLoaded && chats && setupComplete ? (
        <ConversationList
          identityId={identityId}
          navigation={navigation}
          chats={chats}
          dispatchGetChats={dispatchGetChats}
        />
      ) : setupComplete && chatsLoading ? (
        <View style={commonStyles.container}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : setupComplete ? (
        <View style={commonStyles.container}>
          <TouchableOpacity onPress={() => dispatchGetChats(15)}>
            <Text style={styles.refresh}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ChatsView;
