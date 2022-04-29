import React, { ReactElement, useState } from 'react';
import { TextInput, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Title3 } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import SafeAreaView from 'components/SafeAreaView';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { touchableScaleTensionProps } from 'styles/commonStyles';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store/rootReducer';
import { ActivityIndicator } from 'react-native-paper';
import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '2.5rem',
    paddingHorizontal: '1rem',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {},
});

interface IInviteSendModal {
  onPressClose: () => void;
  data: {
    cb: (text: string) => void;
    recipient: string;
    recipientId: string;
  };
}

const InviteSendModal = ({
  data,
  onPressClose,
}: IInviteSendModal): ReactElement => {
  const [text, setText] = useState('');
  const callback = data?.cb ?? function (_) {};

  const requesterId = data?.recipientId ?? undefined;

  // Accept invite loading
  const isLoading = useSelector(
    (state: RootReducer) => state.requests.acceptingRequest[requesterId],
  ) as boolean;

  const { colors } = useTheme();

  const renderSend = (disabled: boolean) => (
    <Paragraph
      style={{ fontWeight: 'bold' }}
      color={disabled ? colors.border : colors.primary}>
      SEND
    </Paragraph>
  );

  const renderHeader = () => {
    const analytics = useAnalytics();
    return (
      <View style={styles.header}>
        <Icon
          size={32}
          color={colors.text}
          name="close"
          onPress={() => {
            onPressClose;
            analytics.logEvent(
              {
                name: 'SEND INVITATION',
                data,
              },
              true,
            );
          }}
        />
        <Title3 color={colors.text}>Replying to {data?.recipient ?? ''}</Title3>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {text.length < 1 || text.length > 250 ? (
              renderSend(true)
            ) : (
              <TouchableScale
                {...touchableScaleTensionProps}
                onPress={() => callback(text)}>
                {renderSend(false)}
              </TouchableScale>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        autoFocus
        multiline
        placeholder="Reply"
      />
    </SafeAreaView>
  );
};

export default InviteSendModal;
