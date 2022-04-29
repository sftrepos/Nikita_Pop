import React, { ReactElement, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Paragraph, Title, Title3 } from 'components/Text';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import ChatBubble from 'components/Messaging/ChatBubble';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { styles } from 'screens/Requests/RequestCarousel';
import { IRequestItem } from 'services/types';
import { useSelector } from 'react-redux';
import { GlobalModalHandler } from 'components/Modals/GlobalModal/GlobalModal';
import TouchableScale from 'react-native-touchable-scale';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActionButton from 'components/Buttons/ActionButton';
import { touchableScaleTensionProps } from 'styles/commonStyles';
import useAnalytics from 'util/analytics/useAnalytics';

interface IRequestCarouselItem {
  item: IRequestItem;
  index: number;
  deleteRequest: (id: string) => void;
  acceptRequest: (id: string, msg: string) => void;
}

const currentStyles = EStyleSheet.create({
  containerTextBubble: {
    marginTop: '1rem',
    width: 200,
  },
  wrapperItem: {
    justifyContent: 'space-between',
    padding: '1rem',
    marginVertical: '1rem',
    marginBottom: '3rem',
    borderRadius: 15,
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 1,
  },
  hasInvitedButton: {},
  declineContainer: {
    width: '40%',
    marginTop: '1rem',
    alignSelf: 'center',
  },
  card: {},
  acceptInviteContainer: {},
  acceptInvite: {
    width: '100%',
    alignSelf: 'center',
  },
  textDecline: {
    fontWeight: '700',
    alignSelf: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textDeclineButton: {
    alignSelf: 'center',
  },
  cardBottom: {},
});

const TextWithIcon = (text: string, icon: string) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.rowTextIconWrap]}>
      <View style={[styles.textWithIconWrap]}>
        <Icon name={icon} size={16} color={colors.text} />
        <Paragraph numberOfLines={4} style={styles.rowText} color={colors.text}>
          {text}
        </Paragraph>
      </View>
    </View>
  );
};

const CardHeaderItemWithIcon = (
  major: string,
  location: string,
  uni: string,
) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.cardHeaderItemWithIcon]}>
      {TextWithIcon(major, 'school')}
      <>
        <View style={[styles.locationWrapper]}>
          <Paragraph style={[styles.rowText]} color={colors.gray}>
            {uni}
          </Paragraph>
        </View>
      </>
      {TextWithIcon(location, 'map-marker')}
    </View>
  );
};

const RequestCarouselItem = ({
  item,
  deleteRequest,
  acceptRequest,
}: IRequestCarouselItem): ReactElement => {
  const analytics = useAnalytics();
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  // const [hasInvited, setHasInvited] = useState(false);
  // const widgets = item.request?.widgets ?? [];
  const message = item.request?.message ?? '';
  const userInfo = item.userInfo;

  const {
    username = '',
    name = '',
    card = {},
    avatar = {},
    timestamp = '',
    hometown = '',
    university = '',
    identityId = '',
  } = userInfo;
  const { major } = university;

  const success: boolean =
    useSelector(
      (state): boolean => state.requests.successfulRequest[identityId],
    ) || false;
  const failed: boolean =
    useSelector((state): boolean => state.requests.failedRequest[identityId]) ||
    false;
  const isLoading: boolean = useSelector(
    (state: boolean) => state.requests.acceptingRequest[identityId],
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (success) {
      navigation.navigate('CHATS_SCREEN');
    }
  }, [success, failed]);

  const onPressProfile = (data) => {
    GlobalModalHandler.showModal({ type: 'c_expand_requests', data });
  };

  const renderCardHeaderMiddle = () => (
    <View style={[styles.wrapCardHeaderMiddle]}>
      <Title style={{ fontSize: 15 }} color="black">
        {username}
      </Title>
      {CardHeaderItemWithIcon(major, hometown, university.name)}
    </View>
  );

  const renderCardHeader = () => {
    return (
      <Pressable
        onPress={() =>
          onPressProfile({
            username,
            avatar,
            university,
            hometown,
            identityId,
            card,
          })
        }>
        {({ pressed }) => (
          <View style={styles.cardHeader}>
            <CustomAvatar scale={0.35} {...avatar} />
            {renderCardHeaderMiddle()}
          </View>
        )}
      </Pressable>
    );
  };

  const renderCardBodyMessage = () => {
    return (
      <>
        {!!message && (
          <View style={{ marginTop: 20 }}>
            <ChatBubble
              isCarousel={true}
              leftTextProps={{
                numberOfLines: 5,
              }}
              containerStyle={[
                {
                  backgroundColor: colors.purple,
                  flexDirection: 'row',
                },
                currentStyles.containerTextBubble,
              ]}
              textStyle={{
                flexWrap: 'wrap',
                color: 'white',
              }}
              text={message}
              borderColor={colors.purple}
            />
          </View>
        )}
        {/*{!!widgets && !!widgets.length && <WidgetDisplay widget={widgets[0]} />}*/}
      </>
    );
  };

  const renderCardBody = () => (
    <Pressable
      onPress={() => {
        onPressProfile({
          username,
          avatar,
          university,
          hometown,
          identityId,
          card,
        });
        analytics.logEvent(
          { name: 'OPEN PROFILE', data: { userId: identityId } },
          true,
        );
      }}>
      {({ pressed }) => (
        <View style={[styles.cardBody]}>
          {!!message && (
            <>
              <Paragraph
                color={colors.text}
                style={[
                  styles.italicText,
                  { color: colors.gray },
                ]}>{`${username} commented:`}</Paragraph>
              {renderCardBodyMessage()}
            </>
          )}
        </View>
      )}
    </Pressable>
  );

  const onPressInputBox = () => {
    GlobalModalHandler.showModal({
      data: {
        cb: (text: string) => acceptRequest(identityId, text),
        recipient: username,
        recipientId: identityId,
      },
      type: 'invite_send',
    });
  };

  const acceptInvite = () => {
    acceptRequest(identityId, input);
    analytics.logEvent(
      { name: 'INVITATION ACCEPT', data: { userId: identityId } },
      true,
    );
    // setHasInvited(!hasInvited);

    // navigation.navigate('MESSAGING_STACK', {
    //   chatId: _id,
    //   otherUser: userData[otherUserId],
    // });
  };

  const renderCardBottom = () => (
    <View style={[currentStyles.cardBottom]}>
      <Pressable onPress={onPressInputBox} style={{}}>
        {({ pressed }) => (
          <View
            style={[
              currentStyles.acceptInviteContainer,
              pressed && { backgroundColor: colors.border },
            ]}>
            <ActionButton
              label="Accept invite"
              gradient
              containerStyle={[
                currentStyles.acceptInvite,
                // hasInvited && { backgroundColor: 'red' },
              ]}
              onPress={acceptInvite}
              loading={isLoading}
            />
          </View>
        )}
      </Pressable>
      <TouchableScale
        {...touchableScaleTensionProps}
        onPress={() => {
          deleteRequest(identityId);
          analytics.logEvent(
            { name: 'INVITATION DECLINE', data: { userId: identityId } },
            true,
          );
        }}
        style={currentStyles.declineContainer}>
        <View style={currentStyles.textDeclineButton}>
          <Title3 color={colors.primary} style={currentStyles.textDecline}>
            decline
          </Title3>
        </View>
      </TouchableScale>
    </View>
  );

  return (
    <View style={[currentStyles.wrapperItem, { backgroundColor: colors.card }]}>
      <View>
        {renderCardHeader()}
        {renderCardBody()}
      </View>
      <View>{renderCardBottom()}</View>
    </View>
  );
};

export default RequestCarouselItem;
