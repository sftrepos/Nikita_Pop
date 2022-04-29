import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import {
  submitQuiz,
  getQuiz,
  getProfile,
  getQuizPersonalityRecommendation,
} from 'features/User/UserActions';
import QuizTakeView from './QuizTakeView';
import { RootReducer } from 'store/rootReducer';
import { sendRequest } from 'features/Request/RequestActions';
import { ISendRequest } from 'services/types';
import useAnalytics from 'util/analytics/useAnalytics';

interface IQuizTakeContainer {
  loading: boolean;
  getQuiz: (quiz: any) => void;
  selectedQuiz: any;
  quiz: any;
  submitQuiz: (quiz: any) => void;
  result: any;
  submitting: boolean;
  refreshProfileData: () => void;
  getQuizPersonalityRecommendation: (id: string, personality: string) => void;
  personalityRecommendationData: any;
  personalityRecommendationLoading: boolean;
  localUser: any;
  isSendRequestSuccess: boolean;
  isLoadingSendRequest: boolean;
  dispatchSendRequest: (requestProps: ISendRequest) => void;
  requestIdInProgress: string;
}

const QuizTakeContainer = ({
  loading,
  getQuiz,
  selectedQuiz,
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
}: IQuizTakeContainer) => {
  useEffect(() => {
    getQuiz(selectedQuiz);
  }, []);
  //const analytics = useAnalytics();

  return !loading && quiz ? (
    <QuizTakeView
      quiz={quiz}
      submitQuiz={submitQuiz}
      result={result}
      submitting={submitting}
      refreshProfileData={refreshProfileData}
      getQuizPersonalityRecommendation={getQuizPersonalityRecommendation}
      personalityRecommendationData={personalityRecommendationData}
      personalityRecommendationLoading={personalityRecommendationLoading}
      localUser={localUser}
      isSendRequestSuccess={isSendRequestSuccess}
      isLoadingSendRequest={isLoadingSendRequest}
      dispatchSendRequest={dispatchSendRequest}
      requestIdInProgress={requestIdInProgress}
    />
  ) : (
    <View style={{ height: '100%', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
};

const mapStateToProps = (state: RootReducer) => ({
  loading: state.user.quizFetching,
  selectedQuiz: state.user.selectedQuiz,
  quiz: state.user.quiz,
  result: state.user.quizResult,
  personalityRecommendationData: state.user.quizPersonalityRecommendationData,
  submitting: state.user.quizSubmitting,
  personalityRecommendationLoading: state.user.personalityRecommendationLoading,
  localUser: state.user.localUser,
  isSendRequestSuccess: state.requests.requestSuccess,
  isLoadingSendRequest: state.requests.isLoading,
  hasSendRequestFailed: state.requests.sendRequestFailed,
  requestIdInProgress: state.requests.requestIdInProgress,
});

const mapDispatchToProps = (dispatch: any) => ({
  getQuiz: (id) => dispatch(getQuiz(id)),
  submitQuiz: (id, answers) => dispatch(submitQuiz(id, answers)),
  getQuizPersonalityRecommendation: (id, personality) =>
    dispatch(getQuizPersonalityRecommendation(id, personality)),
  refreshProfileData: () => dispatch(getProfile()),
  dispatchSendRequest: ({ receiverId, message, card }: ISendRequest) => {
    dispatch(sendRequest({ receiverId, message, card }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizTakeContainer);
