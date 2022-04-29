import React, { ReactElement } from 'react';
import { Button, View } from 'react-native';
import { Paragraph } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import PageSheetModal from 'components/Modals/PageSheetModal';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderModal from 'components/Modals/HeaderModal';

export const ChatsReportModalSubCat2 = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ flex: 1 }}>
      <HeaderModal
        title="test2"
        leftIcon="chevron-left"
        theme={theme}
        onPress={() => null}
        onPressClose={() => navigation.pop()}
      />
      <Paragraph color={colors.text}>some nest 2</Paragraph>
    </View>
  );
};

export const ChatsReportModalSubCat = ({
  navigation,
}: {
  navigation: any;
}): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ flex: 1 }}>
      <HeaderModal
        title="test1"
        theme={theme}
        onPress={() => null}
        leftIcon="chevron-left"
        onPressClose={() => navigation.pop()}
      />
      <Paragraph color={colors.text}>some nest</Paragraph>
      <Button
        title="goto2"
        onPress={() => navigation.navigate('MESSAGING_REPORT_SUBSCREEN2')}
      />
    </View>
  );
};

export const ChatsReportModalMenu = ({
  navigation,
}: {
  navigation: any;
}): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{}}>
      <HeaderModal
        title="test0"
        theme={theme}
        onPress={() => null}
        onPressClose={() => navigation.pop()}
      />
      <Paragraph color={colors.text}>test</Paragraph>
      <Button
        title="goto"
        onPress={() => navigation.navigate('MESSAGING_REPORT_SUBSCREEN')}
      />
    </View>
  );
};

const MessagingReportStack = createStackNavigator();
const MessagingReportStackNavigator = () => (
  <MessagingReportStack.Navigator>
    <MessagingReportStack.Screen
      name="MESSAGING_REPORT_MENU"
      component={ChatsReportModalMenu}
    />
    <MessagingReportStack.Screen
      name="MESSAGING_REPORT_SUBSCREEN"
      component={ChatsReportModalSubCat}
    />
    <MessagingReportStack.Screen
      name="MESSAGING_REPORT_SUBSCREEN2"
      component={ChatsReportModalSubCat2}
    />
  </MessagingReportStack.Navigator>
);

const ChatsReportModal = ({ navigation }) => {
  return (
    <PageSheetModal isVisible={false}>
      <MessagingReportStackNavigator />
    </PageSheetModal>
  );
};

export default ChatsReportModal;
