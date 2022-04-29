import React, { ReactElement, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Paragraph, Title } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import RequestModal from 'components/Modals/RequestModal';

const styles = EStyleSheet.create({
  listItem: {
    paddingVertical: '1 rem',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '1 rem',
  },
  wrapperListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '.5rem',
    borderBottomWidth: 1,
    borderColor: '$grey4',
  },
  containerTimeStamp: {
    alignSelf: 'flex-start',
  },
  containerCenter: {
    flex: 2,
    paddingLeft: '1 rem',
  },
  containerAction: {
    paddingBottom: '1 rem',
  },
  button: {},
  containerButton: {
    paddingHorizontal: '1 rem',
  },
});

const RequestRow = ({
  onPress,

  toggleRead,
  isRead,
  isSwipeEnabled,
  navigation,
  timestamp,
  username,
  message,
  avatar,
  card,
  hometown,
  university,
  id,
  requesterId,
  fake,
}: RequestRowProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const parseTimeStamp = moment(timestamp).isSame(moment(), 'day')
    ? moment(timestamp).format('h:mm a')
    : moment(timestamp).format('M/DD');

  const renderLeft = () => (
    <View>
      <CustomAvatar scale={0.35} {...avatar} />
    </View>
  );

  const renderCenter = () => (
    <View style={styles.containerCenter}>
      <Title color={theme.colors.text}>{username}</Title>
      <Paragraph color={theme.colors.text}>
        {message || 'Wants to meet!'}
      </Paragraph>
    </View>
  );

  const renderRight = () => (
    <View style={[styles.containerTimeStamp]}>
      <Paragraph color={theme.colors.text}>{parseTimeStamp}</Paragraph>
    </View>
  );

  const handleOnPress = () => {
    setShowModal((v) => !v);
  };

  return (
    <>
      <RequestModal
        username={username}
        university={university}
        hometown={hometown}
        card={card}
        avatar={avatar}
        timestamp={timestamp}
        message={message}
        visible={showModal}
        showHide={handleOnPress}
        requesterId={requesterId}
        fake={fake}
      />
      <Pressable onPress={handleOnPress}>
        <View
          style={[
            styles.wrapperListItem,
            { backgroundColor: theme.colors.card },
          ]}>
          <View style={styles.listItem}>
            {renderLeft()}
            {renderCenter()}
            {renderRight()}
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default RequestRow;
