import React, { useEffect, useState } from 'react';
import { View, Modal, KeyboardAvoidingView } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { getId } from 'util/selectors';
import useAnalytics from 'util/analytics/useAnalytics';
import { useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Paragraph, Title3 } from 'components/Text';
import _ from 'lodash';
import InviteInputBox from './InviteInputBox';
import { ISendRequest } from 'services/types';
import { initialFilters } from 'components/Modals/FilterModal/Filter';
import { RootReducer } from 'store/rootReducer';
import { TCard } from 'screens/Browse';
import IconButton from 'components/Buttons/IconButton';
import Chip from 'components/Chip';
import TouchableScale from 'react-native-touchable-scale';
import { touchableScaleTensionProps } from 'styles/commonStyles';

const textList = [
  'I like your profile',
  'Love that city 🏙️',
  'We share interests',
  'Funny gif 😂',
];

interface IQuickInviteScreen {
  onClose: () => void;
  isSendRequestSuccess: boolean;
  onKeyboardFocus: () => void;
  isLoading: boolean;
  sendRequest: (requestProps: ISendRequest) => void;
  data: TCard;
}

const QuickInviteScreen = ({
  onClose,
  isSendRequestSuccess,
  onKeyboardFocus,
  isLoading,
  sendRequest,
  data,
}: IQuickInviteScreen) => {
  const analytics = useAnalytics();
  const theme = useTheme();
  const { colors } = theme;

  const [isKbFocused, setKbFocus] = useState(true);
  const [text, setText] = useState('');
  const [hideSampleText, setHideSampleText] = useState(false);
  const [showSucces, setShowSucces] = useState(false);

  const { identityId } = data;

  const onKeyboardTap = () => {
    onKeyboardFocus();
    setKbFocus(true);
    analytics.logEvent(
      { name: 'QUICK INVITATION MESSAGE TYPE', data: { userId: identityId } },
      true,
    );
  };

  const currentlyLoadedFilters = useSelector(
    (state: RootReducer) => state.requests.filters,
  );

  // Determine if the card is a "filter" or a "regular" card
  const getCurrentCardSendType = () => {
    const omittedFilters = [initialFilters, currentlyLoadedFilters].map((e) =>
      _.omit(e, 'isHomebase', 'gender'),
    );

    return _.isEqual(omittedFilters[0], omittedFilters[1])
      ? 'regular'
      : 'filter';
  };

  const onPressSend = () => {
    analytics.logEvent(
      { name: 'QUICK INVITATION SEND', data: { userId: identityId } },
      true,
    );
    const { cardNum, createdAt } = data;
    sendRequest({
      receiverId: identityId,
      message: text,
      card: {
        type: getCurrentCardSendType(),
        cardNum,
        createdAt,
      },
    });
  };

  const onIconClose = () => {
    setKbFocus(false);
    onClose();
  };

  const handleChipPress = (sampleText: string) => {
    if (!hideSampleText) {
      setText(sampleText);
      setKbFocus(true);
    }
  };

  useEffect(() => {
    if (text) {
      setHideSampleText(true);
    }
  }, [text]);

  return (
    <View style={styles.container}>
      <IconButton
        iconColor={'white'}
        style={styles.iconButton}
        containerStyle={styles.iconButtonContainer}
        size={styles._c.r}
        onPress={onIconClose}
        iconName={'chevron-down'}
        pressedStyle={styles.iconButtonPressed}
      />
      <Title3
        style={[styles.title, hideSampleText && styles.disableView]}
        color={styles._c.textColor}>
        Quick Messages
      </Title3>
      <View
        style={[styles.chipContainer, hideSampleText && styles.disableView]}>
        {textList.map((sampleText) => (
          <TouchableScale
            {...touchableScaleTensionProps}
            onPress={() => handleChipPress(sampleText)}>
            <Chip
              theme={theme}
              text={sampleText}
              textStyle={styles.chipText}
              style={styles.chip}
            />
          </TouchableScale>
        ))}
      </View>
      <InviteInputBox
        isSendRequestSuccess={isSendRequestSuccess}
        text={text}
        isKbFocused={isKbFocused}
        onKeyboardTap={onKeyboardTap}
        setKbFocus={setKbFocus}
        onKeyboardFocus={onKeyboardFocus}
        setText={setText}
        isLoading={isLoading}
        onPressSend={onPressSend}
        containerStyle={styles.inviteInputBoxContainer}
      />
    </View>
  );
};

const styles = EStylesheet.create({
  _c: {
    textColor: 'white',
    r: '2rem',
  },
  container: {
    padding: '2rem',
    flex: 1,
  },
  iconButtonContainer: {
    width: '2rem',
    right: '1rem',
    marginBottom: '1rem',
  },
  iconButton: {
    backgroundColor: 'transparent',
  },
  iconButtonPressed: {
    backgroundColor: 'grey',
  },
  title: {
    marginBottom: '.5rem',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  chip: {
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    paddingHorizontal: '0.75rem',
    paddingVertical: '0.5rem',
    marginBottom: '.5rem',
  },
  chipText: {
    textTransform: 'none',
  },
  inviteInputBoxContainer: {
    margin: 0,
  },
  disableView: {
    opacity: 0,
  },
});

export default QuickInviteScreen;
