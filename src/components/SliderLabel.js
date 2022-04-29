// adapted from react-native-multi-slider customLabel example

import React from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { classDesignations } from 'util/misc';
import EStyleSheet from 'react-native-extended-stylesheet';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
  leftDiff: 0,
};

const width = Dimensions.get('window').width * 0.25;

function LabelBase(props) {
  const { position, value, leftDiff, pressed } = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1.1 : 1,
      duration: 200,
      delay: pressed ? 0 : 50,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position,
            transform: [
              { translateY: width },
              { scale: scaleValue.current },
              { translateY: -width },
            ],
          },
        ]}>
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>{value}</Text>
      </AnimatedView>
    )
  );
}

export default function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  const classFilter = [...classDesignations];

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition - width / 2}
        value={classFilter[oneMarkerValue]}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition - width / 2}
        value={classFilter[twoMarkerValue]}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const styles = EStyleSheet.create({
  parentView: {
    position: 'relative',
  },
  sliderLabel: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: '100%',
    width: width,
    height: width * 0.45,
    backgroundColor: 'white',
  },
  sliderLabelText: {
    textAlign: 'center',
    borderRadius: width * 0.1,
    borderWidth: '.1rem',
    borderColor: 'gray',
    flex: 1,
    fontSize: '1.2rem',
    color: 'gray',
    paddingVertical: width * 0.1,
  },
  pointer: {
    // position: 'absolute',
    // bottom: -pointerWidth / 4,
    // left: (width + pointerWidth) / 2,
    // transform: [{ rotate: '45deg' }],
    // width: pointerWidth,
    // height: pointerWidth,
    // backgroundColor: '#999',
  },
});
