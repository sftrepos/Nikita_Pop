import React, { ReactElement, useState } from 'react';
import { Pressable, View } from 'react-native';
import SafeAreaView from 'components/SafeAreaView';
import { connect } from 'react-redux';
import StatusBar from 'components/StatusBar';
import { Theme, useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ThemeScreenRouteProp,
  ThemeScreenScreenNavigationProp,
} from 'nav/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { appUpdateTheme } from 'features/App/AppActions';

const styles = EStyleSheet.create({
  SA: {
    flex: 1,
  },
  padding: {
    padding: '1 rem',
  },
  textLeft: {
    marginLeft: '0.5 rem',
  },
  textRight: {
    marginRight: '0.5 rem',
  },
  rowSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1 rem',
  },
  rowSettingLeft: {
    flexDirection: 'row',
  },
  rowSettingRight: {
    flexDirection: 'row',
  },
});

interface ThemeScreenProps {
  navigation: ThemeScreenScreenNavigationProp;
  route: ThemeScreenRouteProp;
  dispatchUpdateTheme: (isDarkModeEnabled: boolean) => void;
}

interface SettingSelectorProps {
  theme: Theme;
  iconName: string;
  textLeft: string;
  textRight: string;
  onPress: () => void;
}

const SettingSelector = React.memo<SettingSelectorProps>(
  ({ theme, iconName, textLeft, textRight, onPress }) => (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.rowSetting,
            pressed
              ? {
                  borderColor: theme.colors.border,
                  borderWidth: EStyleSheet.hairlineWidth,
                }
              : { borderColor: 'transparent', borderWidth: 0 },
          ]}>
          <View style={styles.rowSettingLeft}>
            <Icon name={iconName} size={20} color={theme.colors.text} />
            <Paragraph style={styles.textLeft} color={theme.colors.text}>
              {textLeft}
            </Paragraph>
          </View>
          <View style={styles.rowSettingRight}>
            <Paragraph style={styles.textRight} color={theme.colors.text}>
              {textRight}
            </Paragraph>
            <Icon name="chevron-down" size={20} color={theme.colors.text} />
          </View>
        </View>
      )}
    </Pressable>
  ),
);

const ThemeScreen = ({
  navigation,
  route,
  dispatchUpdateTheme,
}: ThemeScreenProps): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const { showActionSheetWithOptions } = useActionSheet();

  const [darkMode, setDarkMode] = useState(theme.dark);

  const sendUpdateCall = (isDarkModeEnabled: boolean) => {
    if (isDarkModeEnabled) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  const onPressThemeMode = () => {
    showActionSheetWithOptions(
      {
        options: ['Cancel', 'Light', 'Dark'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            dispatchUpdateTheme(false);
            sendUpdateCall(false);
            break;
          case 2:
            dispatchUpdateTheme(true);
            sendUpdateCall(true);
            break;
          default:
            break;
        }
      },
    );
  };

  const renderBody = () => {
    return (
      <>
        <SettingSelector
          textLeft="Theme mode"
          textRight={darkMode ? 'Dark' : 'Light'}
          onPress={onPressThemeMode}
          theme={theme}
          iconName="weather-night"
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.SA}>
      <StatusBar theme={theme} />
      {renderBody()}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateTheme: (isDarkModeEnabled: boolean) =>
    dispatch(appUpdateTheme({ isDarkModeEnabled: isDarkModeEnabled })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeScreen);
