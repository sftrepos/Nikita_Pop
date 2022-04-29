import React, { ReactElement, useState, useEffect } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
  TextProps,
  GestureResponderEvent,
  TextStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Spinner from 'react-native-spinkit';
import { WidgetDisplayType } from 'screens/Profile';
import WidgetDisplay from '../Widgets/WidgetDisplay';
import { useTheme } from '@react-navigation/native';
import { TMessageDate } from 'components/Messaging/MessageDate';
import FastImage from 'react-native-fast-image';
import { LinkPreview } from '@flyerhq/react-native-link-preview';

export interface ChatBubbleProps {
  text: string;
  item?: any;
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  borderColor?: string;
  right?: boolean;
  animationDuration?: number;
  textStyle?: StyleProp<TextStyle>;
  content?: contentInterface;
  username?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftTextProps?: TextProps;
  dateParam?: TMessageDate;
  isCarousel?: boolean;
}

interface contentInterface {
  contentType: 'widget';
  data: WidgetDisplayType;
}

const styles = EStyleSheet.create({
  bubbleContainer: {
    borderColor: '$raspberry20',
    paddingHorizontal: '1rem',
    paddingVertical: '0.5rem',
    borderWidth: 1,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  gif: {
    height: '7.5 rem',
    width: '7.5 rem',
    borderRadius: 5,
  },

  bubbleRight: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderWidth: 0,
    backgroundColor: '$raspberry20',
  },
  text: {
    fontSize: '$fontMd',
  },
  container: {
    flexShrink: 1,
    flexDirection: 'row',
    marginVertical: '0.25rem',
    width: '100%',
    // borderWidth: 1
  },
  right: {
    justifyContent: 'flex-end',
  },
  textOverlay: {
    // position: 'absolute',
    // bottom: '-15%',
    marginTop: '-1.5rem',
    backgroundColor: '#5359E3',
    paddingVertical: '.25rem',
    borderWidth: 0,
  },
  textInverse: {
    color: 'white',
  },
  fullWidth: {
    width: '100%',
    maxWidth: '100%',
    marginBottom: 25,
  },
  like: {
    textAlign: 'center',
    width: '100%',
    marginTop: '.75rem',
    color: '$grey3',
    fontStyle: 'italic',
  },
});

const ChatBubble = ({
  onPress,
  text,
  item,
  reactionList,
  onPressIn,
  onPressOut,
  right = false,
  borderColor,
  onLongPress,
  textStyle,
  containerStyle,
  animationDuration = 0,
  content,
  isCarousel,
  // = {
  //   contentType: 'widget',
  //   data: {

  //     type: 'question',
  //     question: 'Hello how are u',
  //     response: 'very well sir hbu'

  //     }
  //   },
  username,
  leftTextProps,
  dateParam,
}: ChatBubbleProps): ReactElement => {
  const [animating, setAnimating] = useState<boolean>(!!animationDuration);
  const { colors } = useTheme();

  useEffect(() => {
    if (animating && animationDuration)
      setTimeout(() => setAnimating(false), animationDuration);
  }, []);

  const MessageDisplay = () => {
    if (!item || isCarousel) {
      return (
        <>
          <CarouselMessageDisplay />
        </>
      );
    }
    return (
      <>
        {item.messageType === 'user' ? (
          // <Text {...leftTextProps} style={[styles.text, textStyle]}>
          //   {text}
          // </Text>
          <LinkPreview
            text={text}
            {...leftTextProps}
            renderText={() => (
              <Text {...leftTextProps} style={[styles.text, textStyle]}>
                {text}
              </Text>
            )}
            touchableWithoutFeedbackProps={{ onLongPress }}
            textContainerStyle={[{ marginVertical: 0, marginHorizontal: 0 }]}
          />
        ) : (
          <FastImage style={styles.gif} source={{ uri: item.plainUrl }} />
        )}
      </>
    );
  };

  const CarouselMessageDisplay = () => {
    if (!item) {
      return (
        <>
          {text && (
            <View style={[styles.bubbleContainer, styles.textOverlay]}>
              <Text style={[styles.text, styles.textInverse, textStyle]}>
                {text}
              </Text>
            </View>
          )}
        </>
      );
    }

    return (
      <>
        {item.messageType === 'user' ? (
          text && (
            <View style={[styles.bubbleContainer, styles.textOverlay]}>
              <Text style={[styles.text, styles.textInverse, textStyle]}>
                {text}
              </Text>
            </View>
          )
        ) : (
          <FastImage style={styles.gif} source={{ uri: `${item.plainUrl}` }} />
        )}
      </>
    );
  };

  // console.log(item.plainUrl, item.messageType);

  return (
    <>
      {!right && content?.contentType == 'widget' && text && (
        <Text style={styles.like}>{`${username} liked your ${
          content?.data?.type !== 'question'
            ? content.data?.type !== 'game'
              ? content.data?.type
              : 'truth'
            : 'response'
        }`}</Text>
      )}
      <View style={[styles.container, right ? styles.right : null]}>
        <Pressable
          style={[{ maxWidth: '75%' }, content && styles.fullWidth]}
          onPress={onPress}
          onLongPress={onLongPress}>
          <View
            style={
              item?.messageType === 'user' && [
                styles.bubbleContainer,
                borderColor && borderColor != '#FFFFFF'
                  ? { borderColor }
                  : null,
                content && { borderWidth: 0 },
                right ? styles.bubbleRight : { backgroundColor: colors.card },
                containerStyle,
              ]
            }>
            {!animating ? (
              !content ? (
                <MessageDisplay />
              ) : content?.contentType ? (
                <View style={{ flex: 1 }}>
                  <WidgetDisplay widget={{ ...content.data }} />
                  <CarouselMessageDisplay />
                </View>
              ) : null
            ) : (
              <Spinner type="ThreeBounce" color="#DDD" />
            )}
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default ChatBubble;
