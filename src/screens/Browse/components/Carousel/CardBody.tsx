import React, { ReactElement, useState } from 'react';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import { useTheme } from '@react-navigation/native';
import { CardImg } from 'components/Card';
import Avatar, { AvatarProps, AvatarWrapper } from 'components/Avatar';
import { CardHeader } from 'components/Card/CardHeader';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { WidgetDisplayType } from 'screens/Profile';

import IconButton from 'components/Buttons/IconButton';
import VaccineInfoModal from 'components/Modals/VaccineInfoModal';
import AvatarWithIcons from './AvatarWithIcons';

const styles = EStyleSheet.create({
  _measurements: {
    rem_1: '1rem',
    rem_15: '1.5rem',
  },
  container: {
    height: '100%',
    // overflow: 'hidden',
  },
  avatar: {
    flex: 1,
    marginTop: '-1.0 * 5rem',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '1rem',
    marginVertical: '.5rem',
    height: '4rem',
  },
  iconButton: {
    flex: 1,
    // alignSelf: 'center',
  },
  icon: {
    alignSelf: 'flex-end',
  },
});

interface ICardBody {
  avatar: CustomAvatarProps;
  username: string;
  major: string;
  gradDate: number;
  hometown: string;
  datasrc: string;
  card: WidgetDisplayType & { identityId: string; sequence: number };
  onPress: () => void;
  name: string;
  meta: any;
}

const CardBody = ({
  avatar,
  username,
  major,
  gradDate,
  hometown,
  datasrc,
  card,
  onPress,
  name,
  meta,
}: ICardBody): ReactElement => {
  // hack for smaller iphone (iphone SE 2nd gen)
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <CardImg datasrc={datasrc} />
      <AvatarWithIcons
        avatar={avatar}
        username={username}
        onPress={onPress}
        meta={meta}
      />
      <CardHeader
        codename={username}
        theme={theme}
        major={major}
        gradClass={gradDate?.toString()}
        location={hometown}
        name={name}
        meta={meta}
      />
      <WidgetDisplay widget={card} browseView={true} />
    </View>
  );
};

export default CardBody;
