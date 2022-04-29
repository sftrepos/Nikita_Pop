import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Theme } from '@react-navigation/native';
import { CustomHeaderButton } from 'components/HeaderButtons';
import { OnboardStackParamList } from 'nav/types';
import { navigationStyles } from 'styles/navigation';

export const Dot = React.memo(
  ({ color, reverse }: { color: string; reverse?: boolean }) => (
    <View
      style={[
        navigationStyles.dot,
        { backgroundColor: color },
        reverse && navigationStyles.mRight,
      ]}
    />
  ),
);

const renderDots = (num: number, colors, reverse?: boolean) =>
  [...Array(num)].map(() => <Dot color={colors.border} reverse={reverse} />);

const renderIcon = (iconName: string, colors) => (
  <View
    style={[
      navigationStyles.containerOnboardHeaderLeft,
      { borderColor: colors.primary },
    ]}>
    <CustomHeaderButton iconSize={20} name={iconName} />
  </View>
);

const OnboardHeaderId = React.memo(({ theme }: { theme: Theme }) => {
  const { colors } = theme;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderIcon('badge-account-horizontal-outline', colors)}
      {renderDots(3, colors)}
    </View>
  );
});

const OnboardHeaderAcademic = React.memo(({ theme }: { theme: Theme }) => {
  const { colors } = theme;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderDots(1, colors, true)}
      {renderIcon('school', colors)}
      {renderDots(2, colors)}
    </View>
  );
});

const OnboardHeaderHeart = React.memo(({ theme }: { theme: Theme }) => {
  const { colors } = theme;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderDots(3, colors, true)}
      {renderIcon('heart', colors)}
    </View>
  );
});

const OnboardHeaderHome = React.memo(({ theme }: { theme: Theme }) => {
  const { colors } = theme;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderDots(2, colors, true)}
      {renderIcon('home', colors)}
      {renderDots(1, colors)}
    </View>
  );
});

export type OnboardCategories = 'id' | 'academic' | 'home' | 'heart';

export const OnboardLeftDetail = (
  category: OnboardCategories,
  theme: Theme,
): ReactNode => {
  switch (category) {
    case 'id':
      return <OnboardHeaderId theme={theme} />;
    case 'academic':
      return <OnboardHeaderAcademic theme={theme} />;
    case 'heart':
      return <OnboardHeaderHeart theme={theme} />;
    case 'home':
      return <OnboardHeaderHome theme={theme} />;
    default:
      return;
  }
};

export type Name = keyof OnboardStackParamList;

export interface OnboardHeaderProps {
  icon: string;
  name: Name;
}

export const ONBOARD_CATEGORIES = {
  NAME_SCREEN: 'id',
  CODENAME_SCREEN: 'id',
  GENDER_SCREEN: 'id',
  AVATAR_SCREEN: 'id',
  CLASS_SCREEN: 'academic',
  GRADYEAR_SCREEN: 'academic',
  MAJOR_SCREEN: 'academic',
  LOCATION_SCREEN: 'home',
  CATEGORIES_SCREEN: 'heart',
  TOPICS_SCREEN: 'heart',
  QUESTIONS_SCREEN: 'heart',
  PERSONALITY_SCREEN: 'heart',
};

export const getOnboardCategory = (name: Name): string => {
  return ONBOARD_CATEGORIES[name];
};
