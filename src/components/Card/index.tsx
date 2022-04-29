import React, { ReactElement } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Theme, useTheme } from '@react-navigation/native';
import { CardHeader } from 'components/Card/CardHeader';
import FastImage from 'react-native-fast-image';
import Avatar from 'components/Avatar';
import { BrowseCard, Card as CardType } from 'services/types';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';

const styles = EStyleSheet.create({
  $width: '5rem',
  _constants: {
    height: '90%',
    r: '1rem',
    width: '$width',
  },
  containerImg: {
    height: '35%',
    '@media (min-width: 300) and (max-width: 500)': {
      height: '28%',
    },
    borderRadius: 25,
  },
  avatar: {
    marginTop: '-1.0 * 5rem',
  },
  container: {
    alignItems: 'center',
    marginVertical: '2rem',
    borderRadius: 25,
    flex: 1,
  },
});

interface CardProps {
  style?: StyleProp<ViewStyle>;
  cardData: BrowseCard;
  open: (cardData: BrowseCard) => void;
  close: () => void;
}

function validateUrl(value: string) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}

const pre = '/background_v1/';
const goog = 'https://storage.googleapis.com';

const hasPre = (datasrc) => datasrc?.includes(pre);

export const CardImg = React.memo<{
  datasrc: string;
  style?: StyleProp<ViewStyle>;
}>(({ datasrc, style }) => {
  const url = validateUrl(datasrc);
  return (
    <FastImage
      style={[styles.containerImg, style]}
      resizeMode={FastImage.resizeMode.cover}
      source={{
        priority: FastImage.priority.normal,
        uri: url
          ? datasrc
          : hasPre(datasrc)
          ? goog + datasrc
          : goog + pre + datasrc,
      }}
    />
  );
});

interface CardBodyProps {
  fake: boolean;
  avatar: CustomAvatarProps;
  username: string;
  theme: Theme;
  major: string;
  secondMajor?: string;
  gradDate: number;
  hometown: string;
  datasrc: string;
  card: CardType & { identityId: string };
  onPress: () => void;
  name: string;
}

const CardBody = ({
  avatar,
  username,
  theme,
  major,
  secondMajor,
  gradDate,
  hometown,
  datasrc,
  card,
  onPress,
  name, //university
}: CardBodyProps) => {
  return (
    <View style={[{ height: '100%' }]}>
      <CardImg datasrc={datasrc} />
      <Avatar
        avatar={avatar}
        onPress={onPress}
        scale={styles._constants.r * 0.05}
        theme={theme}
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
      <WidgetDisplay widget={card} />
    </View>
  );
};

const Card = ({ cardData, open, close }: CardProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const {
    identityId,
    username,
    university,
    hometown,
    avatar,
    card,
    background,
    fake,
  } = cardData;
  const { major, gradDate, name, secondMajor } = university;
  const type = card?.type || '';

  // TODO: (prod) type === 'game' hit handler
  return (
    <View style={[styles.container]}>
      <View
        style={{
          width: '100%',
          borderRadius: 25,
          backgroundColor: colors.card,
        }}>
        <Pressable onPress={() => open(cardData)}>
          <CardBody
            card={{ ...card, identityId }}
            onPress={() => open(cardData)}
            datasrc={background}
            avatar={avatar}
            username={username}
            theme={theme}
            major={major}
            gradDate={gradDate}
            hometown={hometown}
            fake={fake}
            name={name}
            secondMajor={secondMajor}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Card;
