import React, { ReactElement, useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { WidgetDisplayType } from 'screens/Profile';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Title, Title2, Title3 } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import { BrowseCard, Interest } from 'services/types';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootReducer } from 'store/rootReducer';
import { useSelector } from 'react-redux';
import { getId } from 'util/selectors';
import { getPluralizedWithCount } from 'util/string';
import WidgetModifierMenu from 'components/Widgets/WidgetModifierMenu';
import WidgetLike from 'components/Widgets/WidgetLike';
import SendRequestModal from 'components/Modals/SendRequestModal/SendRequestModal';

const styles = EStyleSheet.create({
  _measurements: {
    rem_1: '1rem',
    rem_title2: '1.35 rem',
  },
  _s: {
    marginRight: '2rem',
    marginTop: '2rem',
    textCount: '1rem',
  },
  container: {
    borderRadius: 25,
    padding: '1rem',
    marginHorizontal: '1rem',
    shadowColor: '#000000',
    // borderWidth: 1,
    // borderColor:'red',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 1,
    flexGrow: 1,
  },
  gifContainer: {
    // overflow: 'hidden',
    // height: '45%',
    paddingHorizontal: 0,
    paddingTop: 0,
    // flexGrow: 1,
    backgroundColor: '$lychee',
    // borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  gif: {
    width: '100%',
    height: '85%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    // overflow: 'hidden',
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outerContainer: {
    marginBottom: '1rem',
    // borderWidth: 1,
    // maxHeight: 250,
    // flex: 1,
    // flexGrow: 1,
  },
  containerChips: {
    flexDirection: 'row',
    flexGrow: 1.5,
    overflow: 'hidden',
    flexWrap: 'wrap',
    padding: 0,
    paddingVertical: 0,
  },
  more: {
    // padding: '0.25rem',
    paddingVertical: '.25rem',
    // paddingHorizontal: '0.5rem',
    // marginRight: '0.5rem',
    marginTop: '0.45rem',
  },
  chip: {
    padding: '0.25rem',
    paddingHorizontal: '.9rem',
    borderRadius: 25,
    marginRight: '0.5rem',
    marginTop: '0.45rem',
    borderWidth: 1,

    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
  },
  textQuestionResponse: {
    marginTop: '0.5rem',
    fontSize: '$fontSm',
  },
  containerWidgetInterests: {
    backgroundColor: 'red',
  },
  box: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 25,
    padding: '0.25rem',
    paddingHorizontal: '1rem',
    marginBottom: '0.5rem',
  },
  wrapperInput: {
    height: 50,
    borderRadius: 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 1,
    justifyContent: 'center',
  },
  containerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    transform: [{ rotateZ: '0deg' }, { translateX: 2 }],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
    paddingBottom: 5,
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlayHeart: {
    tintColor: '#fff',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

interface WidgetProps {
  widget: WidgetDisplayType & { identityId?: string };
  browseView?: boolean;
  style?: StyleProp<ViewStyle>;
  nonExpand?: boolean;
  isDraggable?: boolean;
  isExpandedCard?: boolean;
  isSendRequestModal?: boolean;
  onToggle?: () => void;
  onEdit?: (widget: WidgetDisplayType) => void;
  onDelete?: (widget: WidgetDisplayType) => void;
  yCoordinate?: number;
  scrollTo?: (xVal: number, yVal: number) => void;
  data: BrowseCard;
  sendRequest?: (message: string, widget: WidgetDisplayType) => void;
}

interface InterestChipProps {
  isCommon: boolean | undefined;
  interest: Interest;
  color: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const InterestChip = React.memo<InterestChipProps>(
  ({ interest, color, containerStyle, isCommon }) => {
    return (
      <View style={[styles.chip, containerStyle]}>
        <Paragraph color={color}>{interest.title}</Paragraph>
      </View>
    );
  },
);

export const WidgetInterests = ({
  widget,
  style,
  browseView,
}: WidgetProps): ReactElement => {
  const { colors } = useTheme();
  const { interests } = widget;
  const [localUserInterests, setLocalUserInterests] = useState([]);
  const localIdentityId = useSelector(getId);
  const localWidgets = useSelector<RootReducer>(
    (state) => state.user.localUser.card.widgets,
  );

  const [displayedInterests, setDisplayedInterests] = useState(
    [] as Interest[],
  );

  useEffect(() => {
    if (widget.identityId) {
      if (widget.identityId !== localIdentityId) {
        const localUserInterestWidgets = _.find(localWidgets, {
          type: 'interests',
        });

        if (localUserInterestWidgets?.interests.length) {
          setLocalUserInterests(localUserInterestWidgets.interests);
        }
      }
    }
  }, []);

  const parseTitle = () => {
    const presents = _.intersectionWith(
      localUserInterests,
      widget?.interests ?? [],
      _.isEqual,
    );

    if (presents.length) {
      return `${getPluralizedWithCount(presents.length, 'Common Interest')}`;
    }
    return 'Interests';
  };

  // reduce interest array to fit within height
  const reduceInterests = ({
    interests,
    width,
    height,
  }: {
    interests: Interest[];
    width: number;
    height: number;
  }) => {
    if (interests == undefined) return;

    // dimensions of chip container
    const interestWidth = width - styles.containerChips.padding * 2;
    const interestHeight =
      height - styles.containerChips.padding * 2 - styles.chip.marginTop;

    // const interestHeight = height;
    // size of paragraph font
    const textSize = styles._measurements.rem_1;
    const textWidth = textSize * 0.65; //estimated text width in px

    const chipLineHeight =
      textSize + styles.chip.padding * 2 + styles.chip.marginTop;
    const MORE_WIDTH = '1 more'.length * textWidth;

    // console.log(interestHeight);
    // console.log(chipLineHeight);

    let numLines = Math.floor(interestHeight / chipLineHeight);
    numLines = numLines < 1 ? 1 : numLines;

    let w = 0;
    let h = 0;
    const arr = [] as Interest[];

    for (let i = 0; i < interests.length && h < numLines; i++) {
      // width of current interest chip i
      const tempw =
        interests[i].title.length * textWidth +
        styles.chip.paddingHorizontal * 2 +
        styles.chip.marginRight;

      // width exceeds widget
      if (tempw + w > interestWidth) {
        // check height limit
        if (h < numLines - 1) {
          w = tempw;
          h++;
          arr.push(interests[i]);
        } else {
          //height limit reached
          // check if room for "x more"
          if (w + MORE_WIDTH >= interestWidth) {
            arr.pop();
          }
          break;
        }
      } else {
        w += tempw;
        arr.push(interests[i]);
      }
    }
    return arr;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      <View style={styles.containerHeader}>
        <Title3 color={colors.secondary}>{parseTitle()}</Title3>
      </View>
      <View
        style={[styles.containerChips]}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (browseView) {
            setDisplayedInterests(
              reduceInterests({ interests, width, height }),
            );
          } else {
            setDisplayedInterests(interests);
          }
        }}>
        {displayedInterests?.map((interest, idx) => {
          if (!browseView || (browseView && idx < 10)) {
            const isCommon = _.find(localUserInterests, interest);

            return (
              <InterestChip
                isCommon={isCommon}
                containerStyle={[
                  isCommon
                    ? {
                        backgroundColor: colors.secondary,
                        borderColor: colors.secondary,
                      }
                    : {
                        backgroundColor: colors.card,
                        borderColor: 'lightgray',
                      },
                ]}
                interest={interest}
                color={isCommon ? colors.card : colors.text}
              />
            );
          } else {
            return null;
          }
        })}
        {browseView && displayedInterests.length !== interests?.length && (
          // <View
          //   style={{
          //     height: 200,
          //     width: 100,
          //     backgroundColor: 'black',
          //   }}></View>
          <Paragraph color={colors.gray} style={[styles.more]}>
            + {interests ? interests?.length - displayedInterests.length : 0}{' '}
            more
          </Paragraph>
        )}
      </View>
    </View>
  );
};

interface IChoiceProps {
  onPress: () => void;
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
  isRev: boolean;
}

const Choice = ({
  onPress,
  text = '',
  containerStyle,
  isRev,
}: IChoiceProps) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.box, containerStyle]}>
        <Paragraph color={isRev ? 'white' : colors.text}>{text}</Paragraph>
      </View>
    </Pressable>
  );
};

export const WidgetGame = ({ widget }): ReactElement => {
  const [rev, setRev] = useState(false);
  const { colors } = useTheme();
  const onPress = () => {
    setRev(true);
  };
  const getContainerStyle = (isTrue: boolean) => {
    if (rev) {
      if (isTrue) {
        return { backgroundColor: colors.mango, borderWidth: 0 };
      } else {
        return { backgroundColor: colors.border };
      }
    }
    return {};
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.containerHeader}>
        <Title3 style={{ paddingBottom: 10 }} color={colors.mango}>
          That's My Truth
        </Title3>
      </View>
      {widget.map((e, i) => {
        return (
          <Choice
            isRev={rev}
            onPress={onPress}
            text={e.text?.statement || e.text || ''}
            containerStyle={getContainerStyle(e.isTrue)}
          />
        );
      })}
    </View>
  );
};

export const WidgetQuestions = ({
  widget,
  browseView,
}: WidgetProps): ReactElement => {
  const { colors } = useTheme();
  const [numLines, setNumLines] = useState(1);

  const calculateNumLines = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    // size of font
    const textSize = styles._measurements.rem_title2;
    const newNumLines =
      Math.floor(height / textSize) > 0 ? Math.floor(height / textSize) : 1;

    return newNumLines;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card },
        browseView && { flex: 1 },
      ]}>
      <View style={styles.containerHeader}>
        <Title3 color={colors.primary}>{widget.question}</Title3>
      </View>
      <View
        style={browseView && { flex: 1 }}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (browseView) {
            setNumLines(calculateNumLines({ width, height }));
          } else {
            setNumLines(99);
          }
        }}>
        <Title2
          style={styles.textQuestionResponse}
          color={colors.text}
          numberOfLines={numLines}>
          {widget.response}
        </Title2>
      </View>
    </View>
  );
};

export const WidgetGif = ({
  widget,
  browseView,
}: WidgetProps): ReactElement => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        styles.gifContainer,
        { backgroundColor: colors.card, maxHeight: 250 },
        browseView && { flex: 1 },
      ]}>
      <FastImage
        style={[styles.gif]}
        source={{
          uri: 'https://media1.giphy.com' + widget.gif,
          priority: FastImage.priority.normal,
        }}
      />
      <Title color={colors.text} style={{ textAlign: 'center' }}>
        {widget.caption}
      </Title>
    </View>
  );
};

// Pre 2.1.0
const WidgetRenderer = ({
  widget,
  browseView,
}: {
  widget: WidgetDisplayType & {
    identityId?: string;
    browseView: boolean;
  };
  isDragged?: boolean;
}): ReactElement => {
  const widgetType = widget?.type ?? '';

  switch (widgetType) {
    case 'question':
      return <WidgetQuestions widget={widget} browseView={browseView} />;
    case 'interests':
      return <WidgetInterests widget={widget} browseView={browseView} />;
    case 'gif':
      return <WidgetGif widget={widget} browseView={browseView} />;
    case 'game': {
      const {
        gameData: { truth, lie },
      } = widget;
      const gameDataToStructure = [
        { text: truth, isTrue: true },
        { text: lie[0], isTrue: false },
        { text: lie[1], isTrue: false },
      ];

      const shuffledGameData = _.shuffle(gameDataToStructure);
      return <WidgetGame widget={shuffledGameData} />;
    }
    default:
      return <></>;
  }
};

/**
 * Primary widget display component.
 */
const WidgetDisplay = ({
  widget,
  browseView,
  style,
  nonExpand,
  isDraggable,
  isExpandedCard,
  isSendRequestModal,
  yCoordinate,
  onDelete,
  onEdit,
  scrollTo,
  data,
  sendRequest,
}: WidgetProps): ReactElement => {
  const { colors } = useTheme();
  const [isToggled, setIsToggled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);

  const onLike = () => {
    setModalVisibility(!isLiked);
    setIsLiked((l) => !l);
  };
  const onToggle = () => setIsToggled((t) => !t);

  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

  const setModalVisibility = (visible: boolean) => {
    setModalVisible(visible);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 400;
    const newLiked = !isLiked;
    // might need to set lastTap to null?? so it doesn't register 3 touches
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      if (newLiked) {
        setModalVisibility(true);
      }
      onLike();
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  const renderOverlay = () => {
    const likeStyle = [
      styles.overlayHeart,
      {
        opacity: animatedValue,
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1.5],
            }),
          },
        ],
      },
    ];
    return (
      <View style={styles.overlay}>
        <AnimatedIcon name="heart" color="white" size={50} style={likeStyle} />
      </View>
    );
  };

  return (
    <>
      <View
        style={[
          styles.outerContainer,
          isDraggable && styles.dragged,
          style,
          isLiked &&
            isExpandedCard && {
              backgroundColor: colors.card,
            },
          isSendRequestModal && { marginHorizontal: 0 },
          browseView && { flexGrow: 1 },
        ]}>
        {isExpandedCard ? (
          widget?.type === 'game' ? (
            <View>
              <WidgetRenderer
                widget={widget}
                isDragged={isDraggable}
                browseView={browseView}
              />
            </View>
          ) : (
            <TouchableWithoutFeedback onPress={handleDoubleTap}>
              <View
                style={[
                  { backgroundColor: 'white' },
                  widget?.type === 'gif' && { height: '100%' },
                ]}>
                <WidgetRenderer
                  widget={widget}
                  isDragged={isDraggable}
                  browseView={browseView}
                />
                {isExpandedCard && renderOverlay()}
              </View>
            </TouchableWithoutFeedback>
          )
        ) : (
          <>
            {nonExpand ? (
              <View style={[widget.type === 'gif' && { height: '100%' }]}>
                <WidgetRenderer
                  widget={widget}
                  isDragged={isDraggable}
                  browseView={browseView}
                />
              </View>
            ) : (
              <WidgetRenderer
                widget={widget}
                isDragged={isDraggable}
                browseView={browseView}
              />
            )}
          </>
        )}
      </View>
      {isDraggable && (
        <>
          <WidgetModifierMenu
            isToggled={isToggled}
            onToggle={onToggle}
            onDelete={
              onDelete ? () => onDelete(widget) : () => null // Defined only under isDraggable == true
            }
            onEdit={onEdit ? () => onEdit(widget) : () => null}
          />
          <View
            style={{
              position: 'absolute',
              right: styles._s.marginRight,
              bottom: styles._s.marginTop,
              zIndex: 100,
              elevation: 1,
            }}>
            <Icon name="chevron-up" size={16} color={colors.text} />
            <Icon
              name="chevron-down"
              style={{ position: 'absolute', top: 10 }}
              size={16}
              color={colors.text}
            />
          </View>
        </>
      )}
      {/* here do isexpandedcard view and code for the heart */}
      {isExpandedCard && (
        <>
          <View>
            <SendRequestModal
              sendRequest={(message: string) => {
                if (sendRequest) {
                  sendRequest(message, widget);
                }
              }}
              modalVisible={modalVisible}
              setModalVisibility={setModalVisibility}
              widget={widget}
              data={data}
              onClose={onLike}
            />
          </View>
          <WidgetLike
            isLiked={isLiked}
            widgetType={widget?.type}
            onLike={onLike}
          />
        </>
      )}
    </>
  );
};

export default WidgetDisplay;
