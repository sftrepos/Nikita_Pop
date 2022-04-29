import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Share, PixelRatio } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Paragraph, Subtitle, Title } from 'components/Text';
import QuizQuestionCard from './QuizQuestionCard';
import ActionButton from 'components/Buttons/ActionButton';
import LagoonGradient from 'components/Gradients/LagoonGradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProgressBar from './ProgressBar';
import FastImage from 'react-native-fast-image';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import { useSelector } from 'react-redux';
import { getAvatar } from 'util/selectors';
import SnapCarousel from 'react-native-snap-carousel';
import { width } from 'util/phone';
import {
  bubbleColors,
  faceColors,
  SPECIAL_AVATARS,
} from 'assets/vectors/pochies/parts/constants';
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import { useTheme } from '@react-navigation/native';
import { ISendRequest, PersonalityRecommendataion } from 'services/types';
import Card from '../Browse/components/Carousel/Card';
import Modal from 'react-native-modal';
import useAnalytics from 'util/analytics/useAnalytics';

// import HeroAvatar from 'assets/vectors/pochies/special/HeroAvatar';
// import WarriorAvatar from 'assets/vectors/pochies/special/WarriorAvatar';
// import ArcherAvatar from 'assets/vectors/pochies/special/ArcherAvatar';
// import RangerAvataratar from 'assets/vectors/pochies/special/RangerAvatar';
// import HuntingHornAvatar from 'assets/vectors/pochies/special/HuntingHornAvatar';
// import BardAvatar from 'assets/vectors/pochies/special/BardAvatar';
// import WizardAvatar from 'assets/vectors/pochies/special/WizardAvatar';
// import SorcererAvatar from 'assets/vectors/pochies/special/SorcererAvatar';

enum resultCarouselEnum {
  resultCard,
  shareCard,
  recommendedCard,
}
const resultCarouselData = [
  resultCarouselEnum.resultCard,
  resultCarouselEnum.shareCard,
  resultCarouselEnum.recommendedCard,
];

interface IQuizTakeView {
  quiz: any;
  submitQuiz: (quizId: string, answers: any[]) => void;
  result: any;
  submitting: boolean;
  refreshProfileData: () => void;
  getQuizPersonalityRecommendation: (id: string, personality: string) => void;
  personalityRecommendationData: any;
  personalityRecommendationLoading: any;
  localUser: any;
  isSendRequestSuccess: boolean;
  isLoadingSendRequest: boolean;
  dispatchSendRequest: (requestProps: ISendRequest) => void;
  requestIdInProgress: string;
}

const QuizTakeView = ({
  quiz,
  submitQuiz,
  result,
  submitting,
  refreshProfileData,
  getQuizPersonalityRecommendation,
  personalityRecommendationData,
  personalityRecommendationLoading,
  localUser,
  isSendRequestSuccess,
  isLoadingSendRequest,
  dispatchSendRequest,
  requestIdInProgress,
}: IQuizTakeView): ReactElement => {
  const [started, setStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  const questions = quiz?.questions;

  const quizCarouselRef = useRef();
  const resultCarouselRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const analytics = useAnalytics();

  const handleShowMatch = () => {
    resultCarouselRef.current?.snapToNext();
  };

  const handleAnswer = (
    answerIndex: number,
    answer: string,
    question: string,
    index: number,
  ) => {
    setAnswers((oldAnswers) => {
      const newAnswers = [...oldAnswers];
      newAnswers[index] = {
        answer,
        question,
      };
      quizCarouselRef.current?.snapToNext();
      return newAnswers;
    });
  };

  const handleShowModal = (i) => {
    if (!modalShown && i == resultCarouselEnum.recommendedCard) {
      setModalVisible(true);
      setModalShown(true);
    }
  };

  const handleReset = () => {
    setStarted(true);
    setAnswers([]);
    setFinished(false);
  };

  useEffect(() => {
    if (_.compact(answers).length == questions?.length) {
      setFinished(true);
      analytics.logEvent(
        { name: 'QUIZ FINISH', data: { quizId: quiz._id } },
        true,
      );
    }
  }, [answers]);

  useEffect(() => {
    if (finished) {
      submitQuiz(quiz._id, answers);
    }
  }, [finished]);

  useEffect(() => {
    if (!!result) {
      getQuizPersonalityRecommendation(
        localUser.identityId,
        result.personalityType,
      );
      refreshProfileData();
      // console.log('QuizTakeView: result=', result);
    }
  }, [result]);

  useEffect(() => {
    if (personalityRecommendationData) {
      refreshProfileData();
    }
  }, [personalityRecommendationData]);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {started && !finished ? (
          <ProgressBar
            progress={_.compact(answers).length / questions?.length}
          />
        ) : (
          <View style={{ marginTop: styles._constants.r }}></View>
        )}
      </View>
      {!started ? (
        <TitleCard
          {...quiz}
          graphic={quiz.graphic}
          onPress={() => {
            setStarted(true);
            analytics.logEvent({ name: 'QUIZ START' }, true);
          }}
        />
      ) : !finished ? (
        <SnapCarousel
          containerCustomStyle={styles.carouselContainer}
          renderItem={({ item, index }) => (
            <QuizQuestionCard
              selected={answers[index]?.answer}
              onPress={handleAnswer}
              {...item}
              index={index}
              questionKey={item._id}
            />
          )}
          data={quiz.questions}
          sliderWidth={width}
          itemWidth={width - EStyleSheet.value('5rem')}
          ref={quizCarouselRef}
        />
      ) : submitting ||
        personalityRecommendationLoading ||
        !result ||
        !personalityRecommendationData ? (
        <ActivityIndicator style={{ marginTop: '50%' }} />
      ) : (
        <SnapCarousel
          renderItem={({ item, index }) => (
            <ResultCarouselItem
              index={index}
              item={item}
              result={result}
              personalityRecommendationData={personalityRecommendationData}
              handleReset={handleReset}
              isSendRequestSuccess={isSendRequestSuccess}
              isLoadingSendRequest={isLoadingSendRequest}
              dispatchSendRequest={dispatchSendRequest}
              requestIdInProgress={requestIdInProgress}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              handleShowMatch={handleShowMatch}
              quiz={quiz}
            />
          )}
          data={resultCarouselData}
          sliderWidth={width}
          itemWidth={width - EStyleSheet.value('5rem')}
          ref={resultCarouselRef}
          onSnapToItem={handleShowModal}
        />
      )}
    </View>
  );
};

const ResultCarouselItem = ({
  item,
  index,
  result,
  personalityRecommendationData,
  handleReset,
  isSendRequestSuccess,
  isLoadingSendRequest,
  dispatchSendRequest,
  requestIdInProgress,
  isModalVisible,
  setModalVisible,
  quiz,
  handleShowMatch,
}: {
  item: any;
  index: number;
  result: any;
  personalityRecommendationData: any;
  handleReset: () => void;
  isSendRequestSuccess: boolean;
  isLoadingSendRequest: boolean;
  dispatchSendRequest: (requestProps: ISendRequest) => void;
  requestIdInProgress: string;
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  quiz: any;
  handleShowMatch: () => void;
}) => {
  switch (index) {
    case resultCarouselEnum.resultCard:
      return <ResultCard {...result} loaded={!!result} />;
    case resultCarouselEnum.shareCard:
      return (
        <ShareCard
          topThree={result?.topThree}
          handleShowMatch={handleShowMatch}
        />
      );
    case resultCarouselEnum.recommendedCard:
      return (
        <RecommendedCard
          personalityRecommendationData={personalityRecommendationData}
          handleReset={handleReset}
          isSendRequestSuccess={isSendRequestSuccess}
          isLoadingSendRequest={isLoadingSendRequest}
          dispatchSendRequest={dispatchSendRequest}
          requestIdInProgress={requestIdInProgress}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          quiz={quiz}
        />
      );
    default:
      return <></>;
  }
};

const TitleCard = ({
  graphic,
  title,
  description,
  onPress,
}: {
  graphic: string;
  title: string;
  description: string;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, styles.titleCard]}>
      <Title color={colors.text}>{title}</Title>
      <FastImage
        style={styles.image}
        source={{
          uri: 'https://storage.googleapis.com/pop-app-assets/quiz/' + graphic,
        }}
      />
      <Subtitle color={colors.text} style={styles.desc}>
        {description}
      </Subtitle>
      <TouchableOpacity onPress={onPress} style={styles.startBtnContainer}>
        <LagoonGradient style={styles.startBtn}>
          <Text style={styles.startTxt}>TAKE QUIZ</Text>
        </LagoonGradient>
      </TouchableOpacity>
    </View>
  );
};

const ResultCard = ({
  subtitle,
  item,
  itemDescription,
  title,
  desc,
  compatibility,
  topThree,
  typeId,
  rewards,
  loaded,
}) => {
  //Need to save time, can't make this dynamic for now
  const { colors } = useTheme();
  const avatarReward: string = rewards?.[0]?.key;
  const avatar = useSelector(getAvatar);
  const [currentFont, setCurrentFont] = useState(20);
  const [avatarUnlockedToaster, setAvatarUnlockedToaster] = useState(false);
  const analytics = useAnalytics();
  let quizPopUrl = 'https://quiz.popsocial.app/';
  if (typeId) quizPopUrl += `?typeId=${typeId}`;

  useEffect(() => {
    if (loaded && !avatarUnlockedToaster) {
      Toast.show({
        text1: "You've unlocked a special avatar!",
        type: 'success',
        position: 'bottom',
        // visibilityTime: 5000,
        autoHide: false,
        onShow: () => {
          setAvatarUnlockedToaster(true);
        },
      });
    }
  }, [loaded]);

  const handleShare = async () => {
    try {
      analytics.logEvent({ name: 'QUIZ SHARE', data: {} }, true);
      const result = await Share.share({
        message: `Answer these 12 questions to find out which RPG class fits you the best! We'll recommend some fellow adventurers to join your party based on your results.\n${quizPopUrl}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };
  const [descTextSize, setDescTextSize] = useState(styles._constants.r);
  // const [viewHeight, setViewHeight] = useState(0);
  // const [textHeight, setTextHeight] = useState(0);
  const [textOpacity, setTextOpactiy] = useState(0);
  useEffect(() => {
    const devicePixelRatio = PixelRatio.get();
    if (devicePixelRatio >= 3.5) {
      setDescTextSize(16);
    } else if (devicePixelRatio >= 3) {
      setDescTextSize(14);
    } else if (devicePixelRatio >= 2) {
      setDescTextSize(12);
    } else {
      setDescTextSize(10);
    }
    setTextOpactiy(1);
  }, []);

  // commented out for future reference. dynamic solution not working with android
  // useEffect(() => {
  //   // descrease until descTextSize fit inside texetHeight / viewHeight ratio of `viewRatio`
  //   const devicePixelRatio = PixelRatio.get()
  //   if (textHeight && viewHeight) {
  //     const viewRatio = 0.85;
  //     if (textHeight / viewHeight > viewRatio) {
  //       setDescTextSize(descTextSize - 0.4);
  //       console.log("text set!", textHeight, viewHeight, textHeight/viewHeight)
  //     } else {
  //       console.log("text not set!", textHeight, viewHeight, textHeight/viewHeight)

  //     }
  //     if (textHeight / viewHeight <= viewRatio) {
  //       // hide text until dynamic resizing is done
  //       setTextOpactiy(1);
  //       // console.log("opacity set!", textHeight, viewHeight, textHeight/viewHeight)
  //     } else {
  //       // console.log("opacity not set!", textHeight, viewHeight, textHeight/viewHeight)
  //     }
  //   }
  //   console.log("Decreasing descTextSize", devicePixelRatio, descTextSize, textHeight, viewHeight, (textHeight / viewHeight), (styles._constants))
  // }, [textHeight, viewHeight]);
  // <View
  //   style={{
  //     flex: 3,
  //     // justifyContent: 'center'
  //   }}
  //   onLayout={(event) => {
  //     const { x, y, width, height } = event.nativeEvent.layout;
  //     setViewHeight(height);
  //   }}>
  //   <Text
  //     onLayout={(event) => {
  //       const { x, y, width, height } = event.nativeEvent.layout;
  //       setTextHeight(height);
  //     }}
  //     style={{
  //       color: colors.text,
  //       fontSize: descTextSize,
  //       opacity: textOpacity,
  //     }}
  //     // adjustsFontSizeToFit
  //     // numberOfLines={20}
  //     // style={{ color: colors.text}}
  //   ></Text>

  return (
    <>
      {/* <View style={styles.resultCardItemTitle}>
      <Text style={styles.resultCardItemTitleText}>
        Results: Which Fantasy Role Are You?
      </Text>
    </View> */}
      <View style={styles.card}>
        <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Title color={colors.text} style={[styles.title, { flex: 1 }]}>
            {title}
          </Title>
          <CustomAvatar
            {...avatar}
            scale={styles._constants.r * 0.05}
            special={avatarReward}
            style={{ flex: 1 }}
          />
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              justifyContent: 'center',
            }}>
            <Subtitle
              adjustsFontSizeToFit
              numberOfLines={2}
              color={colors.text}
              style={[styles.subtitle]}>
              {subtitle}
            </Subtitle>
          </View>
          <View
            style={{
              flex: 3,
              // justifyContent: 'center'
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: descTextSize,
                opacity: textOpacity,
              }}
              // adjustsFontSizeToFit
              // numberOfLines={20}
              // style={{ color: colors.text}}
            >
              {desc}
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <ActionButton
              containerStyle={styles.actionButtonContainer}
              onPress={handleShare}
              gradient
              label="Share Results"
              textStyle={styles.actionButtonTextStyle}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const ShareCard = ({
  topThree,
  handleShowMatch,
}: {
  topThree: Array<{}>;
  handleShowMatch: () => void;
}) => {
  const { colors } = useTheme();

  // useEffect(() => {
  //   console.log("QuizTakeView: sharecard", topThree)
  // });
  return (
    <View style={[styles.card, { justifyContent: 'space-evenly' }]}>
      <Title style={{ marginBottom: styles._constants.r }} color={colors.text}>
        Your Best Match
      </Title>
      {topThree.map((t) => {
        return (
          <View style={[styles.compatRow, { flex: 2 }]}>
            <CustomAvatar
              special={t.key}
              faceColor={_.sample(faceColors) as string}
              bubbleColor={_.sample(bubbleColors) as string}
              scale={styles._constants.r * 0.035}
            />
            <View style={styles.compatCol}>
              <Text style={styles.compatTxt}>{t.name.toUpperCase()}</Text>
              <Text style={styles.compatTxt}>{t.p}% Match</Text>
            </View>
          </View>
        );
      })}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <ActionButton
          containerStyle={styles.actionButtonContainer}
          onPress={handleShowMatch}
          gradient
          label="Meet Best Match"
          textStyle={styles.actionButtonTextStyle}
        />
      </View>
    </View>
  );
};

const RecommendedCard = ({
  personalityRecommendationData,
  handleReset,
  isSendRequestSuccess,
  isLoadingSendRequest,
  dispatchSendRequest,
  requestIdInProgress,
  isModalVisible,
  setModalVisible,
  quiz,
}: {
  personalityRecommendationData: PersonalityRecommendataion;
  handleReset: () => void;
  isSendRequestSuccess: boolean;
  isLoadingSendRequest: boolean;
  dispatchSendRequest: (requestProps: ISendRequest) => void;
  requestIdInProgress: string;
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  quiz: any;
}) => {
  if (
    !personalityRecommendationData ||
    personalityRecommendationData?.users.length == 0
  ) {
    return <ActivityIndicator style={{ marginTop: '50%' }} />;
  }
  const recommendedUser = personalityRecommendationData?.users[0];

  const {
    university,
    card,
    identityId,
    avatar,
    timestamp,
    username,
    interests,
    hometown,
    sharedInterest,
    background,
    points,
    type,
    createdAt,
  } = recommendedUser || {};
  const { major, gradDate, name } = university || {};
  const analytics = useAnalytics();

  useEffect(() => {
    if (isLoadingSendRequest)
      analytics.logEvent(
        {
          name: 'QUIZ RECOMMENDATION REQUEST ',
          data: { quizType: quiz._id, receiverId: identityId },
        },
        true,
      );
  }, [isLoadingSendRequest]);

  return (
    <>
      <Modal style={[{}, styles.recommendedModal]} isVisible={isModalVisible}>
        <Title color={'black'} style={[styles.modalText]}>
          We're recommending this profile to you! Tap to expand and view their
          profile!
        </Title>

        <ActionButton
          containerStyle={[styles.actionButtonContainer, { width: '90%' }]}
          onPress={() => setModalVisible(false)}
          gradient
          label="Sounds Good"
          textStyle={styles.actionButtonTextStyle}
        />
      </Modal>
      <Card
        type={'quiz'}
        isSendRequestSuccess={isSendRequestSuccess}
        sendRequest={dispatchSendRequest}
        isLoading={isLoadingSendRequest && identityId === requestIdInProgress}
        data={recommendedUser}
        containerStyle={styles.recommendedCardButtonContainerStyle}
      />
    </>
  );
};
// keeping below comment until figma discussion on result page
// <View style={[styles.recommendedCardContainer]}>
//   {/* <View style={[styles.recommendedCardContainer]}> */}
//   {/* <Card cardData={recommendedUser} open={() => null} /> */}
//   <CardImg datasrc={background} />
//   <Avatar
//     avatar={avatar}
//     // onPress={onPress}
//     scale={styles._constants.r * 0.05}
//     theme={theme}
//     containerStyle={styles.avatar}
//   />
//   <CardHeader
//     codename={username}
//     theme={theme}
//     major={major}
//     gradClass={gradDate?.toString()}
//     location={hometown}
//     name={name}
//     // secondMajor={secondMajor}
//   />
// </View>
// <View style={[styles.recommendedCardButtonContainer]}>
//   <ActionButton
//     containerStyle={[styles.actionButtonContainer, { width: '70%' }]}
//     onPress={() => null}
//     gradient
//     label="Share"
//     textStyle={styles.actionButtonTextStyle}
//   />
//   <ActionButton
//     containerStyle={[
//       styles.actionButtonContainer,
//       { width: '50%', borderColor: colors.primary },
//     ]}
//     onPress={handleReset}
//     type="outline"
//     textGradient
//     label="Do Again"
//     textStyle={styles.actionButtonTextStyle}
//   />
// </View>

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '.5rem',
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 1,
    padding: '1rem',
    borderRadius: 25,
    flex: 1,
  },
  titleCard: {
    marginHorizontal: '1.5rem',
  },
  carouselContainer: {
    paddingBottom: '1rem',
  },
  startBtn: {
    height: '3rem',
    justifyContent: 'center',
    paddingHorizontal: '1rem',
    borderRadius: 25,
  },
  startTxt: {
    color: 'white',
    letterSpacing: 3,
    fontSize: '$fontMd',
    fontWeight: '600',
    textAlign: 'center',
  },
  startBtnContainer: {
    marginTop: '2rem',
  },
  desc: {
    marginTop: '2rem',
  },
  image: {
    height: '6rem',
    width: '10rem',
    marginTop: '1rem',
    resizeMode: 'stretch',
  },
  subtitle: {
    fontWeight: '700',
    // textAlign: 'center',
    //marginVertical: '1rem',
  },
  title: {
    //marginVertical: '1rem',
  },
  progressContainer: {
    paddingHorizontal: '1.5rem',
  },
  compatRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: '.5rem',
    // marginVertical: '1rem',
  },
  compatCol: {
    flex: 1,
    flexDirection: 'column',
  },
  compatTxt: {
    textAlign: 'center',
    letterSpacing: 2,
  },
  actionButtonContainer: {
    alignSelf: 'center',
    backgroundColor: '$grey5',
    height: '2.5 rem',
    // flex: 1,
    paddingHorizontal: '1 rem',
  },
  actionButtonTextStyle: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  _constants: {
    r: '1rem',
  },
  avatar: {
    marginTop: '-1.0 * 5rem',
  },
  recommendedCardContainer: {
    justifyContent: 'space-evenly',
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 1,
    borderRadius: 25,
  },
  recommendedCardButtonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  recommendedCardButtonContainerStyle: {
    // marginVertical: 0,
  },
  recommendedModal: {
    justifyContent: 'space-between',
    padding: '2 rem',
    alignSelf: 'center',
    marginTop: '60%',
    maxHeight: '30%',
    width: '70%',
    backgroundColor: '$white',
    borderRadius: 25,
  },
  modalText: {
    fontSize: 17,
    fontWeight: '700',
  },
  resultCardItemTitle: {
    paddingBottom: '.5rem',
    paddingHorizontal: '2rem',
    alignSelf: 'center',
  },
  resultCardItemTitleText: {
    fontWeight: '400',
    letterSpacing: 2,
    lineHeight: 15,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '.7rem',
  },
});

export default QuizTakeView;
