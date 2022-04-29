import React, { ReactElement } from 'react';
import { ScrollView, View } from 'react-native';
import { CardImg } from 'components/Card';
import {
  DetailedUserCardData,
  SERVICE_LOADED,
  UniversityData,
} from 'services/types';
import Avatar from 'components/Avatar';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlobalModalHandler } from 'components/Modals/GlobalModal/GlobalModal';
import { CardHeader } from 'components/Card/CardHeader';
import { AuthAPI, useServiceHook } from 'services/api';
import { getId } from 'util/selectors';
import store from 'store/index';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { Title3 } from 'components/Text';

export interface IRequestCarouselModal {
  data: {
    background: string;
    university: UniversityData;
    avatar: string;
    username: string;
    hometown: string;
    identityId: string;
  };
}

const styles = EStyleSheet.create({
  avatar: {
    marginTop: '-1.0 * 6rem',
  },
  img: {
    height: 150,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1rem',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    marginLeft: '1rem',
  },
});

const RequestCarouselModal = ({
  data,
}: IRequestCarouselModal): ReactElement => {
  const { avatar, username, university, hometown, identityId, card } = data;
  const { major, gradDate, name, secondMajor } = university;
  const theme = useTheme();
  const { colors } = theme;

  const getCardService = useServiceHook<
    DetailedUserCardData,
    { id: string; userId: string }
  >(
    AuthAPI.getSpecificUserCard,
    {
      id: getId(store.getState()),
      userId: identityId,
    },
    [data],
  );

  return (
    <>
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: colors.card,
          },
          styles.chevronContainer,
        ]}>
        <Icon
          name="chevron-down"
          onPress={() => {
            GlobalModalHandler.hideModal();
          }}
          size={35}
          color={colors.text}
        />
        <Title3 style={styles.titleText} color={colors.text}>
          Invite from {username}
        </Title3>
        <Icon name="close" size={35} color={colors.card} />
      </View>
      <ScrollView
        style={{ marginTop: 50, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <CardImg datasrc={card.background} style={styles.img} />
          <Avatar
            onPress={() => {}}
            theme={theme}
            avatar={avatar}
            containerStyle={styles.avatar}
          />

          <CardHeader
            codename={username}
            theme={theme}
            major={major}
            gradClass={gradDate?.toString()}
            location={hometown}
            name={name}
            secondMajor={secondMajor}
          />
          {getCardService.status === SERVICE_LOADED &&
            getCardService.payload.card.card.widgets.map((e, i) => {
              return (
                <View style={styles.expdCard}>
                  <WidgetDisplay style={{}} widget={e} data={data} nonExpand />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </>
  );
};

export default RequestCarouselModal;
