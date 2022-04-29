import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SafeAreaView from 'components/SafeAreaView';
import StatusBar from 'components/StatusBar';
import commonStyles from 'styles/commonStyles';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AuthAPI, useServiceHook } from 'services/api';
import { getId } from 'util/selectors';
import store from 'store/index';
import { Paragraph, Title2, Title3 } from 'components/Text';
import { SERVICE_LOADED } from 'services/types';
import { getProfile } from 'features/User/UserActions';
import { Theme, useTheme } from '@react-navigation/native';
import { TealHeaderButton } from 'components/HeaderButtons';
import { WidgetType } from 'features/Widgets/WidgetTypes';
import Surface from 'components/Surface';
import {
  widgetDelete,
  widgetSetData,
  widgetEdit,
} from 'features/Widgets/WidgetActions';
import Toast from 'react-native-toast-message';
import { isPhoneIOS } from 'util/phone';

const styles = EStyleSheet.create({
  _s: {
    top: '1rem',
    hpad: '1rem',
  },
  headerRightContainer: {
    padding: '1rem',
  },
  inputController: {
    width: '100%',
    paddingBottom: '1rem',
    borderRadius: 15,
    justifyContent: 'flex-start',
  },
  wrapper: {
    flex: 1,
  },
  containerQuestionSelection: {},
  containerQuestionSelector: {},
  containerQuestionWrapper: {
    padding: '1rem',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  questionItem: {
    marginHorizontal: '1rem',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    paddingHorizontal: '1.5rem',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  absCount: { position: 'absolute', bottom: 0, right: 0, padding: '0.5rem' },
  delete: {
    position: 'absolute',
    right: '40%',
    bottom: '5rem',
  },
  navbarTitleContainer: {
    paddingHorizontal: '1rem',
  },
  navbarTitleInnerContainer: {
    paddingBottom: '0.5rem',
  },
  navbar: {},
  navbarContainer: {
    marginTop: '1rem',
  },
  navbarText: {
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 25,
    paddingTop: '0.5rem',
    paddingHorizontal: '1rem',
  },
  inputBox: {
    width: '100%',
  },
});

interface QuestionSelectorProps {
  theme: Theme;
  children: ReactNode;
}

const getProperId = (id: string) => {
  switch (id) {
    case 'looking for':
      return 'looking';
    case 'dreams':
      return id;
    case 'university':
      return id;
    case 'describe/about me':
      return 'about';
    case 'likes':
      return id;
    default:
      return id;
  }
};

type FormData = {
  question: string;
};

const MAX_RESPONSE_INPUT = 130;

enum Category {
  Looking = 'Looking',
  Dreams = 'Dreams',
  University = 'University',
  Likes = 'Likes',
  About = 'About',
}

interface IQuestions {
  navigation: any;
  route: any;
  dispatchDeleteWidget: () => void;
  dispatchSetWidgetData: () => void;
  dispatchEditWidget: () => void;
  globalWidgets: unknown[];
  widgetData: [];
}

const Questions = ({
  navigation,
  route,
  globalWidgets,
  dispatchDeleteWidget,
  widgetData,
  dispatchSetWidgetData,
  dispatchEditWidget,
}: IQuestions): ReactElement => {
  const { addWidget, numWidgets, context, widget } = route.params;
  const isEditCtx = context === 'edit';
  const [questionInput, setQuestionInput] = useState<string>(
    isEditCtx ? widget.response : '',
  );
  const [activeCategory, setActiveCategory] = useState<Category>(
    Category.Looking,
  );

  const getQuestionsFromStore = () => {
    const currentQuestions: WidgetType[] = [];
    if (globalWidgets) {
      globalWidgets.forEach((widget, idx) => {
        if (widget.type === 'question') {
          currentQuestions.push(widget);
        }
      });
    }
    return currentQuestions;
  };

  //if context is edit set selected question
  const [selectedQuestion, setSelectedQuestion] = useState(
    isEditCtx ? widget.question : '',
  );

  // set data so we know a question has been selected
  if (context === 'edit') {
    dispatchSetWidgetData(widget.question);
  }

  const theme = useTheme();
  const { colors } = theme;

  const questionsData = useServiceHook(AuthAPI.getQuestions, {
    params: { id: getId(store.getState()) },
  });

  const mapData = (payload, bucket: string) => {
    let ret = [];
    payload.map((e) => {
      const id = getProperId(e._id?.toLowerCase());
      if (bucket === id) {
        ret = [...e.item];
        return;
      }
    });
    return ret;
  };

  const renderItem = ({ item }) => {
    const { question, sample, popularity } = item;
    const isSelected = selectedQuestion === question;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedQuestion(question);
          dispatchSetWidgetData(question);
        }}>
        <View
          style={[
            styles.questionItem,
            {
              backgroundColor: isSelected
                ? colors.primary
                : theme.dark
                ? colors.card
                : '#fbfbfb',
            },
          ]}>
          <Title2
            color={isSelected ? 'white' : colors.text}
            style={{ fontWeight: 'bold' }}>
            {question}
          </Title2>
        </View>
      </TouchableOpacity>
    );
  };

  const onSubmit = () => {
    const currentQuestion = store.getState().widget.data;
    if (currentQuestion) {
      if (questionInput.length > 0) {
        const newWidget = {
          type: 'question',
          question: currentQuestion,
          sequence: numWidgets,
          response: questionInput,
        };
        if (context === 'edit') {
          dispatchEditWidget({ ...newWidget, sequence: widget.sequence });
        } else {
          addWidget(newWidget);
        }
      } else {
        Toast.show({
          text1: 'Please put an answer!',
          type: 'error',
          position: 'bottom',
        });
      }
    } else {
      Toast.show({
        text1: 'Please select a question',
        type: 'error',
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingRight: styles._s.hpad,
      },
      headerRight: () => <TealHeaderButton onPress={onSubmit} label="Done" />,
    });
  }, [questionInput]);

  const renderQuestionInputController = () => {
    return (
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          placeholder={'Answer here'}
          defaultValue={isEditCtx ? widget.response : ''}
          multiline
          style={[styles.inputBox]}
          onChangeText={setQuestionInput}
          value={questionInput}
          returnKeyLabel="done"
        />
        <View style={[styles.absCount]}>
          <Paragraph
            color={
              questionInput?.length < MAX_RESPONSE_INPUT ?? true
                ? '#c0c0c0'
                : colors.notification
            }>
            {questionInput?.length.toString() ?? '0'}
          </Paragraph>
        </View>
      </View>
    );
  };

  const QuestionList = ({ name }: { name: string }) => {
    const bucket = name?.toLowerCase();
    return (
      <View style={{ backgroundColor: colors.card, flex: 1 }}>
        {questionsData.status === SERVICE_LOADED ? (
          <FlatList
            contentContainerStyle={{ paddingTop: styles._s.top }}
            data={mapData(questionsData.payload.data, bucket)}
            renderItem={renderItem}
          />
        ) : (
          <View style={commonStyles.container}>
            <ActivityIndicator color={colors.border} />
          </View>
        )}
      </View>
    );
  };

  const deleteWidget = () => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatchDeleteWidget(getQuestionsFromStore());
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const borderBottomStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const borderBottomActiveStyle = {
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  };

  const onPressCategory = (title: keyof typeof Category) => {
    setActiveCategory(Category[title]);
  };

  return (
    <SafeAreaView
      style={[
        isPhoneIOS ? styles.wrapper : null,
        { backgroundColor: colors.card },
      ]}>
      <StatusBar theme={theme} />
      <ScrollView contentContainerStyle={isPhoneIOS ? styles.wrapper : null}>
        <View
          style={[
            commonStyles.widgetContainer,
            styles.containerQuestionWrapper,
            { backgroundColor: '#ccf1f8' },
          ]}>
          <Title3
            color={selectedQuestion ? colors.text : colors.primary}
            style={{ fontWeight: 'bold', paddingBottom: styles._s.top }}>
            {selectedQuestion || `Select a question prompt`}
          </Title3>
          {!!selectedQuestion && renderQuestionInputController()}
        </View>
        <View style={[styles.navbarContainer, borderBottomStyle]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.navbar]}>
            {Object.values(Category).map((title) => (
              <Surface
                onPress={() => onPressCategory(title)}
                containerStyle={[
                  title === activeCategory && borderBottomActiveStyle,
                  styles.navbarTitleContainer,
                ]}>
                <View style={[styles.navbarTitleInnerContainer]}>
                  <Paragraph style={styles.navbarText} color={colors.text}>
                    {title}
                  </Paragraph>
                </View>
              </Surface>
            ))}
          </ScrollView>
        </View>
        <View style={{ flex: 3 }}>
          <QuestionList name={activeCategory} />
          {!!getQuestionsFromStore().length &&
            getQuestionsFromStore().length < 2 && (
              <Pressable onPress={deleteWidget}>
                {({ pressed }) => (
                  <View style={styles.delete}>
                    <Paragraph
                      color={pressed ? colors.border : colors.notification}>
                      Delete Widget
                    </Paragraph>
                  </View>
                )}
              </Pressable>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  globalWidgets: state.widget.widgets,
  widgetData: state.widget.data,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetWidgetData: (data) => dispatch(widgetSetData({ data })),
  dispatchGetProfile: () => dispatch(getProfile()),
  dispatchDeleteWidget: (payload: WidgetType) =>
    dispatch(widgetDelete(payload)),
  dispatchEditWidget: (payload: WidgetType) => dispatch(widgetEdit(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
