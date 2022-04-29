import React, { ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { Title, Paragraph } from 'components/Text';
import SafeAreaView from 'components/SafeAreaView';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StatusBar from 'components/StatusBar';

const styles = EStyleSheet.create({
  containerBody: {
    paddingHorizontal: '1 rem',
    paddingTop: '1 rem',
  },
});
const AboutUs = (): ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <SafeAreaView>
      <StatusBar theme={theme} />
      <ScrollView
        scrollEventThrottle={16}
        style={[styles.containerBody, { backgroundColor: colors.card }]}>
        <Title color={colors.text}>Pop your bubble, meet new friends!</Title>
        <Paragraph color={colors.text}>
          {
            "\nPOP is the best way to meet new friends on campus.\n\nWe're focused on creating long lasting, genuine friendships based on student's intrinsic qualities, such as personality traits and interests.\n\nToo often, students find themselves in a new environment and don't know where to start reaching out for connections. Oftentimes, we find ourselves stuck in bubbles, wanting to reach out and experience new connections, without knowing how. POP challenges this status quo by creating a centralized platform where students can pop their bubbles and meet new people and communities, whether that be students from different majors or organizations they wish they knew existed.\n\nWe are not a dating app, and we're proud of it.\n\nPOP is setting a new standard in making new friends as easy as possible. We're breaking down the stigma associated with “putting yourself out there” and forcing people to pretend to be someone they're not. We encourage users to be their absolute genuine selves. Simply put in your personality and your interests, and you're ready to meet new people!\n\nWe break down stereotypes to encourage diversity of culture and thought.\n\nNo profile pictures. No name. Those are the two main factors for stereotypes when it comes to the current social media market. We want students to feel comfortable in their own skin, without having to push forward their “best selves”"
          }
        </Paragraph>
      </ScrollView>
    </SafeAreaView>
  );
};
export default AboutUs;
