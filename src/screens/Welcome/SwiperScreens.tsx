import React from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import EStylesheet from 'react-native-extended-stylesheet';
import Slide1 from './images/slide1';
import Slide2 from './images/slide2';
import Slide3 from './images/slide3';
import ActionButton from 'components/Buttons/ActionButton';
import useAnalytics from 'util/analytics/useAnalytics';

interface ISwiperScreen {
  navigation: any;
}

const SwiperScreen = ({ navigation }: ISwiperScreen): React.ReactElement => {
  const analytics = useAnalytics();

  return (
    <Swiper style={styles.wrapper} loop={false} activeDotStyle={styles.dot}>
      <View testID="Hello" style={styles.slide}>
        <View style={styles.container}>
          <Slide1 />
        </View>
        <View style={styles.textStack}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>your </Text>
            <Text style={[styles.text, styles.highlight]}>personality</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>comes first</Text>
          </View>
          <View style={styles.bar} />
          <View style={styles.textContainer}>
            <Text style={styles.textSmall}>
              meet verified students with like interests and experiences
            </Text>
          </View>
        </View>
      </View>
      <View testID="Beautiful" style={styles.slide}>
        <View style={styles.container}>
          <Slide2 />
        </View>
        <View style={styles.textStack}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>your conversations</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>start </Text>
            <Text style={[styles.text, styles.highlight]}>anonymously</Text>
          </View>
          <View style={styles.bar} />
          <View style={styles.textContainer}>
            <Text style={styles.textSmall}>
              chat openly with those you feel a connection
            </Text>
          </View>
        </View>
      </View>
      <View testID="Simple" style={styles.slide}>
        <View style={styles.container}>
          <Slide3 />
        </View>
        <View style={styles.textStack}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>you decide</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>who's </Text>
            <Text style={[styles.text, styles.highlight]}>interesting</Text>
          </View>
          <View style={styles.bar} />
          <View style={styles.textContainer}>
            <Text style={styles.textSmall}>
              discover more as you get to know each other
            </Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <ActionButton
            label="Done"
            rightIcon="chevron-right"
            containerStyle={styles.btn}
            textStyle={styles.highlight}
            iconStyle={styles.highlight}
            onPress={() => {
              navigation.navigate('REGISTER_STACK');
              analytics.logEvent(
                {
                  name: 'APP INTRO FINISH',
                },
                true,
              );
            }}
          />
        </View>
      </View>
    </Swiper>
  );
};

const styles = EStylesheet.create({
  wrapper: {},
  btnContainer: { flex: 0.25, alignItems: 'flex-end', width: '100%' },
  btn: {
    backgroundColor: null,
  },
  container: { flex: 0.75 },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    flexDirection: 'row',
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: '2.5rem',
    paddingTop: '3.5rem',
  },
  text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  highlight: {
    color: '$raspberry',
  },
  textSmall: {
    color: 'black',
    fontSize: '$fontMd',
  },
  textStack: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: '2rem',
    flex: 1,
  },
  bar: {
    backgroundColor: '$raspberry50',
    height: '.25rem',
    width: '25%',
    marginTop: '2.5rem',
    marginBottom: '.5rem',
  },
  dot: {
    backgroundColor: '$raspberry',
  },
});

export default SwiperScreen;
