import React, { ReactElement } from 'react';
import { ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { CardImg } from 'components/Card';
import { CardHeader } from 'components/Card/CardHeader';
import Avatar from 'components/Avatar';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomAvatarProps } from '../../assets/vectors/pochies/CustomAvatar';
import AvatarWithIcons from 'screens/Browse/components/Carousel/AvatarWithIcons';

type TProfileCard = {
  card: unknown;
  avatar: CustomAvatarProps;
  username: string;
  university: { name: string; major: string; gradDate: number };
  hometown: string;
  wide: boolean;
  name: string;
  onBack: () => void;
  showOne: boolean;
  progress: number;
  showBack: boolean;
  otherUserId: string;
  style?: ViewStyle;
  meta: any;
};

const ProfileCard = ({
  card,
  avatar,
  username,
  university,
  hometown,
  showOne,
  wide,
  showBack,
  onBack,
  name,
  progress = 0,
  style,
  otherUserId,
  meta,
}: TProfileCard): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const { major, gradDate } = university;

  return (
    <View style={[styles.outerContainer, style]}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="chevron-down" size={32} />
        </TouchableOpacity>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          {
            backgroundColor: colors.card,
          },
          styles.card,
          wide ? styles.wideContainer : null,
        ]}>
        <CardImg datasrc={card.background} style={styles.header} />
        <AvatarWithIcons avatar={avatar} username={username} meta={meta} />
        <CardHeader
          showOptions
          otherUserId={otherUserId}
          codename={progress < 1 ? username : name}
          theme={theme}
          major={major}
          gradClass={gradDate.toString()}
          location={hometown}
          name={university.name}
        />
        {showOne ? (
          <WidgetDisplay widget={card.widgets[0]} />
        ) : (
          card.widgets.map((w) => <WidgetDisplay widget={w} />)
        )}
      </ScrollView>
    </View>
  );
};

const styles = EStyleSheet.create({
  $width: '100%',
  SA: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: { maxHeight: '17rem' },
  outerContainer: {
    // height: '40rem',
    borderRadius: 25,
    overflow: 'hidden',
  },
  wideContainer: {
    width: '100%',
    marginHorizontal: 0,
    minWidth: '21rem',
    paddingBottom: 0,
    maxHeight: '150rem',
    marginTop: 0,
  },
  avatar: {
    marginTop: '-1.0 * 5rem',
  },
  card: {
    borderRadius: 25,
    // maxHeight: '35rem',
    flexGrow: 1,
    width: '17rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    marginHorizontal: '3rem',
    marginVertical: '2rem',
    paddingBottom: '4rem',
  },
  backBtn: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    width: '2rem',
    height: '2rem',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 25,
  },
});

export default ProfileCard;
