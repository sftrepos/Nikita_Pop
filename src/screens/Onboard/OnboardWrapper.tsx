import React from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import { HugeTitle, Title3 } from 'components/Text';
import NextButton from 'screens/Register/NextButton';
import { SetupSeparator } from 'screens/Register/SetupSeparator';
import Toast from 'react-native-toast-message';
import { OnboardStackParamList } from 'nav/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardTitles } from 'screens/Onboard/OnboardTitles';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  _inset: {
    bottom: '2 rem',
  },
  stdPadding: {
    paddingHorizontal: '1 rem',
  },
  stdMargin: {
    marginBottom: '1 rem',
  },
  subTitleMargin: {
    marginBottom: '1 rem',
    marginRight: '5 rem',
  },
  center: {
    alignItems: 'center',
  },
  nextBtn: {
    paddingHorizontal: '20%',
    marginTop: 'auto',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: '3 rem',
    flexDirection: 'column',
  },
  childrenWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: '1 rem',
    justifyContent: 'center',
  },
});

interface OnboardWrapperProps {
  navigation: StackNavigationProp<
    OnboardStackParamList,
    keyof OnboardStackParamList
  >;
  titleKey: keyof typeof OnboardTitles;
  children: React.ReactNode;
  validInput: boolean;
  onSubmit: () => void;
  preventBack?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  customBtnLabel?: string;
  skipBtn?: boolean;
  onSkip?: () => void;
}

const OnboardWrapper = (props: OnboardWrapperProps): React.ReactElement => {
  const {
    navigation,
    titleKey,
    children,
    validInput,
    onSubmit,
    preventBack,
    contentContainerStyle,
    loading,
    customBtnLabel,
    skipBtn,
    onSkip,
  } = props;

  const theme = useTheme();
  const { colors } = theme;

  React.useEffect(() => {
    if (preventBack) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit onboarding?',
          [
            { text: 'No', onPress: () => null, style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false },
        );
        return true;
      });
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the current view
        e.preventDefault();

        Toast.show({
          text1: 'Please complete onboarding first!',
          text2: 'You can update your profile after onboarding is complete!',
          type: 'info',
          position: 'bottom',
        });
      });
    }
  }, [navigation, preventBack]);

  return (
    <SafeAreaView style={[{ backgroundColor: colors.card }, styles.container]}>
      <StatusBar theme={theme} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollViewContent}>
        <View style={{ flex: 1 }}>
          <HugeTitle style={[styles.stdPadding]} color={colors.text}>
            {OnboardTitles[titleKey].title}
          </HugeTitle>
          <SetupSeparator theme={theme} />
          <Title3
            style={[styles.stdPadding, styles.subTitleMargin]}
            color={EStyleSheet.value('$grey2')}>
            {OnboardTitles[titleKey].description}
          </Title3>
          <View style={[styles.childrenWrapper, contentContainerStyle]}>
            {children}
          </View>
        </View>
        <NextButton
          style={styles.center}
          containerStyle={styles.nextBtn}
          disabled={!validInput}
          onPress={onSubmit}
          isLoading={loading}
          noIcon
          label={customBtnLabel}
        />
        {skipBtn ? (
          <TouchableOpacity
            style={[styles.stdPadding, styles.center]}
            onPress={onSkip}>
            <Title3 color={colors.primary}>SKIP FOR NOW</Title3>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

OnboardWrapper.defaultProps = {
  loading: false,
};

export default OnboardWrapper;
