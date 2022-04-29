import React, { useEffect, useState } from 'react';
import QuizView from './QuizView';
import { connect } from 'react-redux';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { getQuizzes, selectQuiz } from 'features/User/UserActions';
import routes from 'nav/routes';
import { RootReducer } from 'store/rootReducer';
import commonStyles from 'styles/commonStyles';
import { useTheme } from '@react-navigation/native';

interface IQuizContainer {
  quiz: unknown;
  getQuizzes: () => void;
  selectQuiz: () => void;
  quizzes: unknown;
  navigation: any;
  submissions: unknown;
  loading: boolean;
}

const QuizContainer = ({
  quiz,
  getQuizzes,
  selectQuiz,
  quizzes,
  navigation,
  submissions,
  loading,
}: IQuizContainer) => {
  const { colors } = useTheme();

  useEffect(() => {
    if (!quizzes) {
      getQuizzes();
    }
  }, []);

  const handleSelectQuiz = (quizId) => {
    selectQuiz(quizId);
    navigation.navigate(routes.QUIZ_TAKE_SCREEN);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {quizzes && (
        <QuizView
          submissions={submissions}
          quiz={quiz}
          quizzes={quizzes}
          selectQuiz={handleSelectQuiz}
        />
      )}
      {loading && (
        <View style={commonStyles.absolute}>
          <ActivityIndicator color={colors.text} />
        </View>
      )}
    </SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getQuizzes: () => dispatch(getQuizzes()),
  selectQuiz: (id) => dispatch(selectQuiz(id)),
});

const mapStateToProps = (state: RootReducer) => ({
  quizzes: state.user.quizzes,
  quiz: state.user.selectedQuiz,
  submissions: state.user.submissions,
  loading: state.user.quizFetching,
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizContainer);
