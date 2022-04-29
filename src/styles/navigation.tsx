import React, { useEffect, useState } from 'react';
import routes from 'nav/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CustomHeaderButton,
  SubmitHeaderButton,
} from 'components/HeaderButtons';
import { PopLogoTeal } from '../../assets/vectors/PopLogo';
import { StackNavigationOptions } from '@react-navigation/stack';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
  MessagingNavigationProp,
  MessagingRouteProp,
  SendFeedbackNavigationProp,
  SendFeedbackRouteProp,
  OnboardStackRouteProp,
} from 'nav/types';
import { ChangeFieldScreenProps } from 'screens/Settings/ChangeFieldScreen';
import { ReportBugProps } from 'screens/ReportBug';
import { GlobalModalHandler } from 'components/Modals/GlobalModal/GlobalModal';
import Avatar from 'components/Avatar';
import {
  getAvatar,
  getFilters,
  getProfileData,
  getNumUnreadChatAndInvite,
} from 'util/selectors';
import LagoonGradient from '../components/Gradients/LagoonGradient';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import ChatHeader from '../components/Messaging/ChatHeader';
import { FACE_TYPES } from 'assets/vectors/pochies/parts/constants';
import { useDispatch, useSelector } from 'react-redux';
import ChatReportModal from '../components/ChatReportModal';
import { UpdateFilterType } from '../components/Modals/FilterModal';
import { setFilters } from '../features/Request/RequestActions';
import { MATCH_CLEAR_DECK } from '../features/Request/RequestTypes';
import ProgressBar from '../screens/Quiz/ProgressBar';
import { RootReducer } from 'store/rootReducer';
import { Title3 } from 'components/Text';
import PopQuizIcon from 'assets/vectors/NavigationIcons/PopQuizIcon';
import PopQuizIconPressed from 'assets/vectors/NavigationIcons/PopQuizIconPressed';
import useAnalytics from 'util/analytics/useAnalytics';
import MessagingHeader, {
  GroupMessagingHeader,
} from 'components/Messaging/MessagingHeader';
// import MessagesScreenSideMenu from 'screens/Chats/MessagesScreenSideMenu';
import { navigate } from 'nav/RootNavigation';
import store from 'store';
import ProfileModal from 'components/Modals/ProfileModal';
import generalConstants from 'constants/general';
import MessagesScreenSideMenu from 'screens/Chats/MessagesScreenSideMenu';
import NumberBadge from 'components/NumberBadge';

export const navigationStyles = EStyleSheet.create({
  _s: {
    padding: '1rem',
  },
  _hs: {
    padding: '0.5rem',
  },
  textBottomTabLabel: {
    fontSize: '1 rem',
  },
  containerBottomTabStyle: {
    height: '2.5 rem',
  },
  containerWrapperBottomTabStyle: {
    height: '4 rem',
  },
  containerOnboardHeaderLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '0.1 rem',
    borderRadius: 50,
    width: '2 rem',
    height: '2 rem',
  },
  dot: {
    marginLeft: '0.5 rem',
    width: '0.5 rem',
    height: '0.5 rem',
    borderRadius: 50,
  },
  mRight: { marginRight: '0.5 rem', marginLeft: 0 },
  avatarProfileIcon: {
    padding: '1 rem',
  },
  topNavContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topNavContainerNational: {
    marginLeft: '1rem',
  },
});

const HEADER_PADDING_HORIZONTAL = 0;

export const defaultNavigationOptions = {
  headerLeftContainerStyle: {
    paddingLeft: HEADER_PADDING_HORIZONTAL,
  },
  headerRightContainerStyle: {
    paddingRight: HEADER_PADDING_HORIZONTAL,
  },
};

const TabBarAvatar = ({
  isSelected,
  onPress,
}: {
  isSelected: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const avatar = useSelector(getAvatar);
  const renderAvatar = () => {
    return (
      <Avatar
        scale={0.15}
        customAvatarContainerStyle={[
          navigationStyles.avatarProfileIcon,
          isSelected && { borderColor: colors.primary },
        ]}
        avatar={avatar}
        onPress={onPress}
        theme={theme}
        isNav
      />
    );
  };
  return <>{renderAvatar()}</>;
};

export const TabScreenOptions = ({ route, navigation }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName = '';
    let iconSize = size;
    let showNotificationCount = false;
    const numTotalUnreadChatAndInvite: number = useSelector(
      (state: RootReducer) => getNumUnreadChatAndInvite(state),
    );

    switch (route.name) {
      case routes.RECEPTION_STACK:
        iconName = focused ? 'message' : 'message-outline';
        showNotificationCount = true;
        break;
      case routes.BROWSE_CARDS_STACK:
        iconName = focused ? 'home' : 'home-outline';
        iconSize = 30;
        break;
      case routes.MAP_TAB:
        iconName = focused ? 'account-multiple' : 'account-multiple';
        iconSize = 30;
        break;
      case routes.QUIZ_STACK:
        return focused ? <PopQuizIconPressed /> : <PopQuizIcon />;
      case routes.PROFILE_STACK:
        return (
          <TabBarAvatar
            isSelected={focused}
            onPress={() => {
              navigation.navigate('PROFILE_STACK');
            }}
          />
        );
      case routes.NATIONAL:
        iconName = focused ? 'view-carousel' : 'view-carousel-outline';
        break;
      default:
        break;
    }
    return (
      <View style={styles.tabScreenOptionsContainer}>
        <Icon name={iconName} size={iconSize} color={color} />
        {showNotificationCount && (
          <NumberBadge
            containerStyle={styles.tabIcon}
            number={numTotalUnreadChatAndInvite}
          />
        )}
      </View>
    );
  },
});

export const TabScreenBarOptions = { showLabel: false };

export const BrowseStackScreenOptions = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}): StackNavigationOptions => {
  const setupComplete =
    useSelector(
      (state: RootReducer) => state.user.localUser?.meta?.setupComplete,
    ) || false;
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();

  const setFilter = (filter: UpdateFilterType) => dispatch(setFilters(filter));
  const clear = () => dispatch({ type: MATCH_CLEAR_DECK });
  const analytics = useAnalytics();

  const handleToggle = () => {
    clear();
    setFilter({ type: 'isHomebase', filter: !filters.isHomebase });
    analytics.logEvent(
      {
        name: 'CAROUSEL CHANGE BASE',
        data: { isHomebase: !filters.isHomebase },
      },
      true,
    );
  };
  const onCloseFilterCallback = route.params?.onCloseFilterCallback;
  const { colors } = useTheme();

  const isHomebase = useSelector((state) => getFilters(state).isHomebase);

  return {
    headerLeftContainerStyle: {
      paddingLeft: navigationStyles._s.padding,
    },
    headerRightContainerStyle: {
      paddingRight: navigationStyles._s.padding,
    },
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
    headerLeft: () => (
      <View style={navigationStyles.topNavContainerLeft}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={handleToggle}>
            <PopLogoTeal />
          </TouchableOpacity>
        </View>
        <View style={navigationStyles.topNavContainerNational}>
          <Title3 color={colors.text} style={styles.textHomebase}>
            {isHomebase ? 'CAMPUS' : 'NATIONAL'}
          </Title3>
        </View>
      </View>
    ),
    headerTitle: () => null,
    headerRight: () =>
      setupComplete ? (
        <View style={navigationStyles.topNavContainerLeft}>
          <CustomHeaderButton
            iconSize={30}
            style={styles.topNavIconLeft}
            onPress={() => {
              GlobalModalHandler.showModal({
                type: 'filter',
                data: { onCloseFilterCallback },
              });
              analytics.logEvent({ name: 'FILTER MODAL OPEN', data: {} }, true);
            }}
            name="tune"
          />
          <TabBarAvatar
            isSelected={false}
            onPress={() => {
              navigation.navigate('PROFILE_STACK');
              analytics.logEvent({ name: 'EDIT PROFILE OPEN', data: {} }, true);
            }}
          />
        </View>
      ) : (
        <></>
      ),
  };
};

export const MapStackScreenOptions = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}): StackNavigationOptions => {
  const setupComplete =
    useSelector(
      (state: RootReducer) => state.user.localUser?.meta?.setupComplete,
    ) || false;
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();

  const setFilter = (filter: UpdateFilterType) => dispatch(setFilters(filter));
  const clear = () => dispatch({ type: MATCH_CLEAR_DECK });
  const analytics = useAnalytics();

  const handleToggle = () => {
    clear();
    setFilter({ type: 'isHomebase', filter: !filters.isHomebase });
    analytics.logEvent(
      {
        name: 'CAROUSEL CHANGE BASE',
        data: { isHomebase: !filters.isHomebase },
      },
      true,
    );
  };
  const onCloseFilterCallback = route.params?.onCloseFilterCallback;
  const { colors } = useTheme();

  const isHomebase = useSelector((state) => getFilters(state).isHomebase);

  return {
    headerLeftContainerStyle: {
      paddingLeft: navigationStyles._s.padding,
    },
    headerRightContainerStyle: {
      paddingRight: navigationStyles._s.padding,
    },
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
    headerShown: false,
    // headerLeft: () => (
    //   <View style={navigationStyles.topNavContainerLeft}>
    //     <View
    //       style={{
    //         alignItems: 'center',
    //       }}>
    //       <TouchableOpacity onPress={handleToggle}>
    //         <PopLogoTeal />
    //       </TouchableOpacity>
    //     </View>
    //     <View style={navigationStyles.topNavContainerNational}>
    //       <Title3 color={colors.text} style={styles.textHomebase}>
    //         {isHomebase ? 'CAMPUS' : 'NATIONAL'}
    //       </Title3>
    //     </View>
    //   </View>
    // ),
    // headerTitle: () => null,
    // headerRight: () =>
    //   setupComplete ? (
    //     <View style={navigationStyles.topNavContainerLeft}></View>
    //   ) : (
    //     <></>
    //   ),
  };
};

export const SettingsStackOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'Settings',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
  };
};

export const EditProfileOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'Edit Profile',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    headerStyle: {
      shadowColor: 'transparent',
      elevation: 0,
    },
  };
};

export const ThemeScreenOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'Theme',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
  };
};

export const HeaderWithBack = ({ route, navigation }) => {
  const { title } = route.params;

  return {
    ...defaultNavigationOptions,
    title,
    cardShadowEnabled: false,
    headerStyle: { shadowColor: 'transparent' },
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => {
          navigation.pop();
        }}
      />
    ),
  };
};

export const SendFeedbackScreenOptions = ({
  route,
  navigation,
}: {
  route: SendFeedbackRouteProp;
  navigation: SendFeedbackNavigationProp;
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'Send Feedback',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
  };
};

export const ReportBugScreenOptions = ({
  route,
  navigation,
}: ReportBugProps): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'Report a Bug',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
  };
};

export const AboutUsScreenOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    title: 'About Us',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
  };
};

export const ChangeFieldScreenOptions = ({
  route,
  navigation,
}: ChangeFieldScreenProps): StackNavigationOptions => {
  const { onPress, type, title, label } = route.params;
  return {
    ...defaultNavigationOptions,
    title,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    headerRight: () => <SubmitHeaderButton label={label} onPress={onPress} />,
  };
};

export const WelcomeScreenOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  return {
    headerShown: false,
  };
};

export const SwiperOnboardingOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,

    headerTitle: () => (
      <View
        style={{
          alignItems: 'center',
        }}>
        <PopLogoTeal />
      </View>
    ),
    headerRight: () => <View />,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const MessagingScreenOptions = ({
  route,
  navigation,
}: {
  route: MessagingRouteProp;
  navigation: MessagingNavigationProp;
}): StackNavigationOptions => {
  const { avatar, displayName, type } = route.params;

  const dummyAvatar = {
    faceColor: '#FFFFFF',
    bubbleColor: '#FFFFFF',
  };

  return {
    ...defaultNavigationOptions,
    headerLeft: () => (
      <View style={{ flexDirection: 'row' }}>
        <CustomHeaderButton
          name="chevron-left"
          onPress={() => {
            navigation.pop();
          }}
        />
        {type === 'group' && (
          <GroupMessagingHeader displayName={displayName} avatar={avatar} />
        )}
        {type === 'event' && (
          <GroupMessagingHeader displayName={displayName} avatar={avatar} />
        )}
      </View>
    ),
    headerStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6.62,
      elevation: 5,
      zIndex: 11,
    },
    headerTitle: () => {
      return (
        <>
          {type !== 'group' && type !== 'event' && (
            <MessagingHeader
              displayName={displayName}
              avatar={avatar ? avatar : dummyAvatar}
            />
          )}
        </>
      );
    },
    // headerTitle: () => {
    //   return (
    //     <>
    //       {type === 'group' ? (
    //         <GroupMessagingHeader displayName={displayName} avatar={avatar} />
    //       ) : (
    //         <MessagingHeader
    //           displayName={displayName}
    //           avatar={avatar ? avatar : dummyAvatar}
    //         />
    //       )}
    //     </>
    //   );
    // },
    // headerRight: () => <MessagesScreenSideMenu route={route} />,
    cardShadowEnabled: false,
  };
};

export const PopinDetailsScreenOptions = ({
  route,
  navigation,
}: {
  route: MessagingRouteProp;
  navigation: MessagingNavigationProp;
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => {
          navigation.pop();
        }}
      />
    ),
    headerStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6.62,
      elevation: 5,
      zIndex: 11,
    },
    headerTitle: 'Pop-In Details',
    cardShadowEnabled: false,
  };
};

export const EditPopinDetailsOptions = ({
  route,
  navigation,
}: {
  route: MessagingRouteProp;
  navigation: MessagingNavigationProp;
}): StackNavigationOptions => {
  return {
    ...defaultNavigationOptions,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => {
          navigation.pop();
        }}
      />
    ),
    headerStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6.62,
      elevation: 5,
      zIndex: 11,
    },
    headerTitle: 'Edit Pop-In',
    cardShadowEnabled: false,
  };
};

const OnboardProgressMap = {
  NAME_SCREEN: 0.1,
  CODENAME_SCREEN: 0.225,
  GENDER_SCREEN: 0.35,
  GRADYEAR_SCREEN: 0.475,
  MAJOR_SCREEN: 0.6,
  SECONDMAJOR_SCREEN: 0.725,
  LOCATION_SCREEN: 0.85,
  CONTENT_SCREEN: 1,
  WIDGET_PICKER_SCREEN: 1,
} as const;

export const OnboardScreenOptions = ({
  route,
  navigation,
}: {
  route: OnboardStackRouteProp;
  navigation: any;
}): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitleAlign: 'center',
    headerTitle: () => (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <ProgressBar
          progress={OnboardProgressMap[route.name]}
          containerStyle={{
            height: EStyleSheet.value('0.5rem'),
            width: '100%',
          }}
        />
      </View>
    ),
    headerLeft: () => null,
    cardShadowEnabled: false,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const WidgetPickerScreenOptions = ({
  route,
  navigation,
}): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitleAlign: 'center',
    headerTitle: 'Content Types',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const OuterScreenOptions = ({ navigation }): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitle: () => (
      <View
        style={{
          alignItems: 'center',
        }}>
        <PopLogoTeal />
      </View>
    ),
    headerRight: () => <View />,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const CustomizeAvatarOptions = ({
  navigation,
}): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitle: 'Customize Avatar',
  headerLeft: () => (
    <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  ),
  cardShadowEnabled: false,
  headerStyle: { shadowColor: 'transparent' },
});

export const ProfileEditOptions = ({ navigation }): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitleStyle: { alignSelf: 'center' },
  headerTitle: 'Profile',
  headerRight: () => (
    <CustomHeaderButton
      style={{ marginRight: navigationStyles._hs.padding }}
      onPress={() => navigation.navigate('SETTINGS_STACK')}
      name="cog-outline"
    />
  ),
  headerLeft: () => (
    <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  ),
  cardShadowEnabled: false,
  headerStyle: { shadowColor: 'transparent', elevation: 0 },
});

export const CreatePopInOptions = ({ navigation }): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitleStyle: { alignSelf: 'center' },
  headerTitle: 'Create Pop-In',
  headerRight: () => <View />,
  headerLeft: () => (
    <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  ),
  cardShadowEnabled: false,
  headerStyle: { shadowColor: 'transparent', elevation: 0 },
});

export const PopInDetailsOptions = ({
  navigation,
}): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitleStyle: { alignSelf: 'center' },
  headerTitle: 'Pop-In Details',
  headerRight: () => <View />,
  headerLeft: () => (
    <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  ),
  cardShadowEnabled: false,
  headerStyle: { shadowColor: 'transparent', elevation: 0 },
});

export const PopInEditLocationOptions = ({
  navigation,
}): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  //headerTitleStyle: { alignSelf: 'center' },
  //headerTitle: 'Pop-In Details',
  headerShown: false,
  // headerRight: () => <View />,
  // headerLeft: () => (
  //   <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  // ),
  //cardShadowEnabled: false,
  // headerStyle: { shadowColor: 'transparent', elevation: 0 },
});

export const GiphyWidgetOptions = ({ navigation }): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitle: 'Add Gif',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const ImageBackgroundWidgetOptions = ({
  navigation,
}): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitle: 'Add Background',
  headerLeft: () => (
    <CustomHeaderButton name="chevron-left" onPress={() => navigation.pop()} />
  ),
  cardShadowEnabled: false,
  headerStyle: { shadowColor: 'transparent' },
});

export const QuestionOptions = ({ navigation }): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitle: 'Question Widget',
    headerRight: () => <View />,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const GameWidgetOptions = ({ navigation }): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitle: 'Add Game',
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const InterestsWidgetOptions = ({
  navigation,
}): StackNavigationOptions => {
  const { colors } = useTheme();
  return {
    ...defaultNavigationOptions,
    headerTitle: 'Add Interests',
    headerRight: () => <View />,
    headerLeft: () => (
      <CustomHeaderButton
        name="chevron-left"
        onPress={() => navigation.pop()}
      />
    ),
    cardShadowEnabled: false,
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.card,
      shadowColor: 'transparent',
      justifyContent: 'center',
    },
  };
};

export const IntercomOptions = ({ navigation }): StackNavigationOptions => ({
  ...defaultNavigationOptions,
  headerTitle: '',
  headerBackground: () => <LagoonGradient style={{ flex: 1 }} />,
  headerLeft: () => (
    <Pressable
      style={{ marginLeft: 15 }}
      onPress={() => navigation.navigate(routes.SETTINGS_STACK)}>
      <Icon name="cog-outline" color="white" size={32} />
    </Pressable>
  ),
  headerTitle: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CustomAvatar
        scale={0.2}
        faceColor="#FFF087"
        bubbleColor="#66CAEA"
        faceType={FACE_TYPES.smile}
        customAvatarContainerStyle={{ padding: 0, marginHorizontal: 7.5 }}
      />
      <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>
        Pochi from Pop
      </Text>
    </View>
  ),
});

const styles = EStyleSheet.create({
  _c: {
    r1: '1rem',
  },
  textHomebase: {
    letterSpacing: 2,
    color: '#555555',
    fontWeight: '400',
  },
  topNavIconLeft: {
    marginRight: '1rem',
  },
  featIndicator: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 10,
    height: 10,
    backgroundColor: '$raspberry',
    borderRadius: 10,
    zIndex: 2,
  },
  featGlow: {
    position: 'absolute',
    top: -5,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '$raspberry70',
    opacity: 0.25,
    shadowColor: '$raspberry70',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    zIndex: 1,
    elevation: 15,
  },
  tabScreenOptionsContainer: {
    flexDirection: 'row',
  },
  tabIcon: {
    position: 'absolute',
    left: '.6rem',
    bottom: '.6rem',
    // zIndex: 5,
  },
});
