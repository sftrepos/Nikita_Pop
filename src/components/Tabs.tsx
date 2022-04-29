import React, { ReactElement, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Surface from 'components/Surface';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph } from 'components/Text';

const styles = EStyleSheet.create({
  navbarTitleContainer: {
    paddingHorizontal: '1rem',
  },
  navbarTitleInnerContainer: {
    paddingBottom: '0.5rem',
  },
  navbarContainer: {
    marginTop: '1rem',
  },
  navbarText: {
    fontWeight: '600',
  },
});

interface TabProps {
  tabs: Array<string>;
  tabAlias?: Array<string>;
  setTab: (tab: string) => void;
}

const Tabs = ({ tabs, tabAlias, setTab }: TabProps): ReactElement => {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState(tabs[0]); //assumes at least one tab

  const borderBottomStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const borderBottomActiveStyle = {
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  };

  const switchTab = (title: string) => {
    setActiveCategory(title);
    setTab(title);
  };

  return (
    <View style={[styles.navbarContainer, borderBottomStyle]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((category, index) => (
          <View
            style={[
              styles.navbarTitleInnerContainer,
              category === activeCategory && borderBottomActiveStyle,
            ]}>
            <Surface
              onPress={() => switchTab(category)}
              containerStyle={styles.navbarTitleContainer}>
              <Paragraph style={styles.navbarText} color={colors.text}>
                {tabAlias ? tabAlias[index] : category}
              </Paragraph>
            </Surface>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Tabs;
