import React, { ReactElement, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';
import { useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';
import { CardImg } from 'components/Card';
import { CardHeader } from 'components/Card/CardHeader';
import Avatar, { AvatarProps } from 'components/Avatar';
import { getLocalUserData } from 'util/selectors';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import { Interest, UniversityData } from 'services/types';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { useNavigation } from '@react-navigation/native';

const styles = EStyleSheet.create({
  $width: '100%',
  SA: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    alignSelf: 'center',
    borderRadius: 25,
    width: '80%',
    height: '90%',
  },
  avatar: {
    marginTop: '-1.0 * 5rem',
  },
  expdCard: {
    marginBottom: '1rem',
  },
  editTip: {
    color: '$grey3',
    textAlign: 'center',
    marginBottom: '.25rem',
    marginTop: '-.75rem',
  },
});

export type WidgetPlainType = 'interests' | 'game' | 'gif' | 'question';

export type WidgetUpdateType = {
  type: string;
  gameName: string;
  gameData: {
    truth: string[];
    lie: string[];
  };
  sequence: number;
  isNewData: boolean;
};

export type WidgetDisplayType = {
  type: WidgetPlainType;
  interests?: Interest[];
  question?: string;
  response?: string;
  _id: string;
  sequence: number;
  gif?: string;
  caption?: string;
};

interface ProfileProps {
  dispatchWidgetGet: () => void;
  avatar: CustomAvatarProps;
  globalWidgets: WidgetDisplayType[];
  localUser: {
    avatar: AvatarProps;
    username: string;
    university: UniversityData;
    hometown: string;
    card: {
      widgets: WidgetDisplayType[];
      background: string;
    };
  };
}

const Profile = ({ localUser, globalWidgets }: ProfileProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const navigation = useNavigation();
  const [user, setUser] = useState(localUser);
  const { hometown, username } = user;
  //have to reset memory references to trigger a refresh
  const avatar = { ...user.avatar };
  const university = { ...user.university };
  const card = { ...user.card };
  const { widgets, background } = card;
  const primaryWidget = globalWidgets?.[0] || widgets?.[0];
  const { gradDate, major } = university;
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      setUser({ ...localUser });
    });

    // setListener(focusListener)
  }, []);

  const navigateToProfileEditStack = () =>
    navigation.navigate('PROFILE_EDIT_STACK');

  return (
    <SafeAreaView style={[styles.SA]}>
      <StatusBar theme={theme} />
      <View style={[styles.container]}>
        <Text style={styles.editTip}>Tap Card To Edit Profile</Text>
        <Pressable onPress={navigateToProfileEditStack}>
          <View
            style={[
              {
                backgroundColor: colors.card,
                borderRadius: 25,
                height: '100%',
                paddingBottom: 15,
              },
            ]}>
            <CardImg datasrc={background} />
            <Avatar
              scale={0.8}
              theme={theme}
              onPress={navigateToProfileEditStack}
              avatar={avatar}
              containerStyle={styles.avatar}
            />
            <CardHeader
              codename={username}
              theme={theme}
              major={major}
              gradClass={gradDate?.toString()}
              location={hometown}
              secondMajor={secondMajor}
            />
            <WidgetDisplay widget={primaryWidget} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  localUser: getLocalUserData(state),
  globalWidgets: state.widget.widgets,
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
