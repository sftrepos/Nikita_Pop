import EStyleSheet from 'react-native-extended-stylesheet';

const commonStyles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    height: '100%',
    width: '90%',
  },
  widgetOuterContainer: {
    //adds outer shadow
    flex: 1,
    width: '100%',
    elevation: 10, //check in android
    shadowOffset: { width: 0, height: '.5 rem' },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const touchableScaleTensionProps = {
  activeScale: 0.9,
  hapticType: 'impactLight',
  pressInFriction: 20,
  pressInTension: 200,
  pressOutFriction: 20,
  pressOutTension: 300,
  useNativeDriver: true,
};

export default commonStyles;
