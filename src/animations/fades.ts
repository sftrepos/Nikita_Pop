import { Animated } from 'react-native';

const fadeIn = (fadeAnim: Animated.Value | Animated.ValueXY): void => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 750,
    useNativeDriver: true,
  });
};

export default { fadeIn };
