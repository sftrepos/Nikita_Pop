import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Picker,
} from 'react-native';
import EStylsheet from 'react-native-extended-stylesheet';
import STAGES from './stages';
import ResponsePanel, {
  IResponseChoice,
} from 'components/Messaging/ResponsePanel';
import Axios from 'axios';
import { getApiUrl } from 'services/api';
import majors from '../../constants/majors';
import years from '../../constants/gradDates';
import _, { max, min } from 'lodash';
import { getQuestions } from 'services/hooks';
import { questionInterface } from '../../interfaces';
import widgets from '../../constants/widgets';
import ProgressBar from 'components/Messaging/ProgressBar';
import { logError } from 'util/log';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import IntercomMessages from 'screens/Intercom/IntercomMessages';
import Autocomplete from 'components/Autocomplete';
import CurrentLocationInput from 'components/CurrentLocationInput';
import TextInput from 'components/TextInput';
import SendButton from 'components/Messaging/SendButton';
import QuestionPrompt from 'components/Widgets/QuestionPrompt';
import { isAndroid } from 'util/phone';

interface IntercomViewProps {
  profile: any;
  updateProfile: (arg: Record<string, unknown>) => void;
  getProfile: () => void;
  id: string;
  token: string;
}

export enum GENDERS {
  male = 'male',
  female = 'female',
  nonbinary = 'nonbinary',
  prefernot = 'prefernot',
}

export const genderMap = {
  [GENDERS.male]: { key: GENDERS.male, label: 'Man' },
  [GENDERS.female]: { label: 'Woman', key: GENDERS.female },
  [GENDERS.nonbinary]: { label: 'Non-Binary', key: GENDERS.nonbinary },
  [GENDERS.prefernot]: { label: 'I prefer not to say', key: GENDERS.prefernot },
};

const IntercomView = ({
  profile,
  updateProfile,
  getProfile,
  id,
  token,
}: IntercomViewProps) => {
  const [responseAnswer, setResponseAnswer] = useState<
    IResponseChoice | undefined
  >();
  const [showResponsePanel, setShowResponsePanel] = useState<boolean>(true);
  const [responsePanelChoices, setResponsePanelChoices] = useState<
    IResponseChoice[] | undefined
  >();
  const [stage, setStage] = useState<STAGES>(-1);
  const [userInput, setUserInput] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [autocompleteChoices, setAutocompleteChoices] = useState<Array<string>>(
    [],
  );
  const [showScrollPanel, setShowScrollPanel] = useState<boolean>(false);
  const [pickerChoice, setPickerChoice] = useState<number>(years[0]);
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<
    Array<questionInterface | undefined>
  >([]);
  const [prompt, setPrompt] = useState<string>(
    profile?.card?.widgets.find((w) => w.type === widgets.question)?.question ||
      '',
  );

  const [paginateChoices, setPaginateChoices] = useState<boolean>();
  const [multiResponse, setMultiResponse] = useState<boolean>(false);
  const [responseAnswers, setResponseAnswers] = useState<IResponseChoice[]>();

  const scrollRef = useRef<ScrollView>(null);

  const navigation = useNavigation();
  useEffect(() => {
    updateStage(profile, setStage);
  }, [profile]);

  useEffect(() => {
    updateResponsePanel();
    if (stage >= STAGES.TIPS) {
      if (!profile?.meta?.setupComplete)
        updateProfile({ meta: { setupComplete: true, tutorialStage: 7 } });
    }
  }, [stage]);

  useEffect(() => {
    if (showScrollPanel) setUserInput(pickerChoice?.toString());
  }, [pickerChoice]);

  const updateStage = (): void => {
    if (!profile?.name || !(profile.name.length > 0)) {
      setStage(STAGES.NAME);
    } else if (!profile?.username) {
      setStage(STAGES.USERNAME);
    } else if (!profile?.gender) {
      setStage(STAGES.GENDER);
    } else if (!profile?.university?.major) {
      setStage(STAGES.MAJOR);
    } else if (!profile?.university?.secondMajor) {
      setStage(STAGES.SECONDMAJOR);
    } else if (!profile?.university?.gradDate) {
      setStage(STAGES.YEAR);
    } else if (!profile?.hometown) {
      setStage(STAGES.LOCATION);
    } else if (
      !profile.card ||
      !profile.card.widgets.find((widget) => widget.type === widgets.question)
    ) {
      setStage(STAGES.PROMPT);
    } else if (
      !profile.card.widgets.find((widget) => widget.type === widgets.question)
        .response
    ) {
      setStage(STAGES.QUESTION);
    } else if (!profile?.meta?.setupComplete) {
      setStage(STAGES.TIPS);
    } else {
      setStage(STAGES.HUMAN);
    }
  };

  const handleSend = (): void => {
    //

    switch (stage) {
      case STAGES.NAME: {
        if (
          userInput.length >= 2 &&
          /^[A-Za-z\s]+$/.test(userInput) &&
          userInput.length <= 40
        ) {
          updateProfile({
            name: userInput?.trim(),
          });
          setUserInput(undefined);
        } else {
          setError('Invalid Name. Please try again.');
        }
        break;
      }
      case STAGES.USERNAME: {
        updateProfile({
          username: responseAnswer?.key,
        });
        setResponseAnswer(undefined);
        setUserInput(undefined);
        setPaginateChoices(false);
        setResponsePanelChoices([]);

        break;
      }
      case STAGES.GENDER: {
        const genders = responseAnswers?.map((r) => r.key);
        updateProfile({
          gender: responseAnswer?.key,
          genderV2: genders,
        });
        setPaginateChoices(false);
        setResponseAnswer(undefined);
        setUserInput(undefined);
        setResponsePanelChoices(undefined);
        break;
      }
      case STAGES.MAJOR: {
        if (majors.map((m) => m.title).includes(userInput)) {
          updateProfile({
            university: {
              major: userInput,
            },
          });
          setUserInput(undefined);
        }
        break;
      }
      case STAGES.SECONDMAJOR: {
        if (majors.map((m) => m.title).includes(userInput)) {
          updateProfile({
            university: {
              secondMajor: userInput,
            },
          });
          setUserInput(undefined);
        }
        break;
      }
      case STAGES.YEAR: {
        const year = Number(userInput);
        if (year <= max(years) && year >= min(years)) {
          updateProfile({
            university: {
              gradDate: year,
            },
          });
          setUserInput(undefined);
        }
        break;
      }
      case STAGES.LOCATION: {
        if (
          userInput?.length >= 3 &&
          userInput?.length < 65 &&
          autocompleteChoices.includes(userInput)
        ) {
          updateProfile({
            hometown: userInput,
          });
          setUserInput(undefined);
        }
        break;
      }
    }
  };

  const handleChange = (value: string): void => {
    switch (stage) {
      case STAGES.NAME: {
        if (
          (value.length < 40 && value.match(/^[A-Za-z\s]+$/)) ||
          value.length === 0
        ) {
          setUserInput(value);
        }
        break;
      }
      case STAGES.MAJOR: {
        if (value.length < 65) setUserInput(value);

        break;
      }
      case STAGES.SECONDMAJOR: {
        if (value.length < 65) setUserInput(value);

        break;
      }
      case STAGES.LOCATION: {
        if (value.length < 65) setUserInput(value);
        if (value?.length) getPlaces(value);
        break;
      }
    }
  };

  const updateResponsePanel = (): void => {
    switch (stage) {
      case STAGES.USERNAME: {
        setShowResponsePanel(true);

        setResponseAnswer(undefined);
        getUsernames(true);
        setPaginateChoices(true);
        setMultiResponse(false);

        setShowQuestions(false);
        setShowScrollPanel(false);
        break;
      }
      case STAGES.GENDER: {
        setShowResponsePanel(true);
        setPaginateChoices(false);
        setMultiResponse(false);
        setResponsePanelChoices(Object.values(genderMap));
        setShowQuestions(false);
        setShowScrollPanel(false);

        break;
      }
      case STAGES.MAJOR: {
        setUserInput('');
        setShowAutocomplete(true);
        setAutocompleteChoices(majors.map((major) => major.title));
        setShowQuestions(false);
        setShowResponsePanel(false);
        setShowScrollPanel(false);
        break;
      }
      case STAGES.SECONDMAJOR: {
        setUserInput('');
        setShowAutocomplete(true);
        setAutocompleteChoices(majors.map((major) => major.title));
        setShowQuestions(false);
        setShowResponsePanel(false);
        setShowScrollPanel(false);

        break;
      }
      case STAGES.YEAR: {
        setShowResponsePanel(false);
        setShowScrollPanel(true);
        setAutocompleteChoices([]);
        setUserInput(years[0].toString());
        setShowQuestions(false);

        break;
      }
      case STAGES.LOCATION: {
        setShowAutocomplete(true);
        setShowQuestions(false);
        setShowScrollPanel(false);
        setShowResponsePanel(false);

        break;
      }
      case STAGES.PROMPT: {
        setShowQuestions(true);
        fetchQuestions();
        setShowAutocomplete(false);
        setShowScrollPanel(false);
        setShowResponsePanel(false);
        break;
      }

      default: {
        setShowResponsePanel(false);
        setShowAutocomplete(false);
        setShowScrollPanel(false);
        setShowQuestions(false);
      }
    }
  };
  const getUsernames = (isNew?: boolean): void => {
    setFetching(true);

    Axios.get(`${getApiUrl()}/user/usernames`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { id, size: 16 },
    })
      .then((resp) => {
        setFetching(false);
        if (!responsePanelChoices || isNew)
          setResponsePanelChoices(
            resp.data.map((u: string) => ({ key: u, label: u })),
          );
        else {
          setResponsePanelChoices(
            responsePanelChoices.concat(
              resp.data.map((u: string) => ({ key: u, label: u })),
            ),
          );
        }
      })
      .catch((err) => {
        console.info(err);
        setFetching(false);
      });
  };

  const getPlaces = _.debounce((value) => {
    setFetching(true);
    Axios.get(`${getApiUrl()}/user/places/auto`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { id, params: value },
    })
      .then((resp) => {
        setAutocompleteChoices(
          resp.data?.data?.predictions.map(({ description }) => description),
        );
        setFetching(false);
      })
      .catch((err) => {
        logError(err);
        setFetching(false);
      });
  }, 200);
  const fetchQuestions = (): void => {
    getQuestions(id, token, 5).then((result) => setQuestions(result));
  };

  const confirmPrompt = () => {
    setStage(STAGES.QUESTION);
  };

  const submitQuestion = ({ question, response }) => {
    updateProfile({
      card: {
        widgets: [
          {
            type: widgets.question,
            question,
            response,
            sequence: 0,
          },
        ],
      },
    });
  };

  const updateMultiResponse = (resp: IResponseChoice) => {
    const ix: number = responseAnswers.findIndex((i) => i.key == resp.key);
    if (ix === -1) {
      setResponseAnswers((r) => r?.concat([resp]));
    } else {
      setResponseAnswers((r) => {
        const newArray = _.clone(r);
        newArray?.splice(ix, 1);
        return newArray;
      });
    }
  };

  const handleSkipSecondMajor = (): void => {
    updateProfile({
      university: {
        secondMajor: 'Skip',
      },
    });
  };

  const { colors } = useTheme();

  const onContentSizeChange = () =>
    scrollRef.current?.scrollToEnd({ animated: true });

  return (
    <KeyboardAvoidingView
      style={[styles.chatScreen, { backgroundColor: colors.card }]}
      contentContainerStyle={[styles.container]}
      behavior="padding"
      keyboardVerticalOffset={isAndroid() ? -250 : 100}
      enabled>
      <ProgressBar progress={stage / STAGES.HUMAN} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        onContentSizeChange={onContentSizeChange}
        style={[styles.messagesContainer]}>
        <IntercomMessages
          ref={scrollRef}
          setStage={setStage}
          profile={profile}
          username={profile.username}
          navigation={navigation}
          prompt={prompt}
          submitQuestion={submitQuestion}
          stage={stage}
        />
      </ScrollView>
      <View>
        {stage === STAGES.SECONDMAJOR && (
          <TouchableOpacity
            onPress={handleSkipSecondMajor}
            style={styles.skipBtn}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        )}
        {showAutocomplete && (
          <Autocomplete
            searchString={userInput}
            options={autocompleteChoices}
            onPress={(value) => handleChange(value)}
          />
        )}
        {stage === STAGES.LOCATION && (
          <CurrentLocationInput
            onFinishGetLocation={(loc: string) => {
              setUserInput(loc);
              setAutocompleteChoices([loc]);
            }}
          />
        )}

        {stage !== STAGES.PROMPT && stage !== STAGES.QUESTION && (
          <View style={styles.inputContainer}>
            <TextInput
              label="Send Message"
              placeholder={
                showResponsePanel ? 'Select Response Below' : 'Enter Response'
              }
              containerStyle={[styles.input]}
              disabled={showResponsePanel || showScrollPanel}
              value={
                showResponsePanel
                  ? multiResponse
                    ? responseAnswers?.map((r) => r.label).join(', ')
                    : responseAnswer?.label
                  : userInput
              }
              onChangeText={handleChange}
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              autoFocus={true}
            />

            <SendButton
              onPress={handleSend}
              disabled={
                (showResponsePanel
                  ? multiResponse
                    ? responseAnswers.length == 0
                    : !responseAnswer
                  : false) ||
                (showScrollPanel && !pickerChoice) ||
                (!showScrollPanel &&
                  !showResponsePanel &&
                  (!userInput || userInput?.length === 0))
              }
            />
          </View>
        )}
      </View>
      {showQuestions && (
        <ScrollView
          style={styles.promptContainer}
          contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.pickPrompt}>PICK ONE TO ANSWER</Text>
          {questions.map((q) => (
            <QuestionPrompt
              question={q}
              expanded={q.question === prompt}
              onPress={(p: string) => setPrompt(p)}
              onConfirmPress={confirmPrompt}
            />
          ))}
        </ScrollView>
      )}
      {showResponsePanel && (
        <View style={styles.responsePanelContainer}>
          <ResponsePanel
            options={responsePanelChoices}
            onPress={(value: IResponseChoice) => setResponseAnswer(value)}
            answer={responseAnswer?.key}
            paginate={paginateChoices}
            onPressNext={stage === STAGES.USERNAME ? getUsernames : undefined}
            fetching={fetching}
            onPressMulti={updateMultiResponse}
            multiAnswers={responseAnswers}
            isMulti={multiResponse}
          />
        </View>
      )}
      {showScrollPanel && (
        <View style={styles.scrollContainer}>
          <Picker
            selectedValue={pickerChoice}
            style={{ height: 50 }}
            onValueChange={(value) => setPickerChoice(value)}>
            {years.map((year) => (
              <Picker.Item label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = EStylsheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingBottom: '2.5rem',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: '1rem',
    paddingVertical: '1.5rem',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: '0.50rem',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    marginBottom: 0,
    minHeight: 50,
  },
  responsePanelContainer: {
    flex: 1,
  },
  promptContainer: {
    flexGrow: 0.3,
    paddingHorizontal: '2rem',
    backgroundColor: '$grey4',
    paddingTop: '2rem',
  },
  scrollContainer: {
    height: '13rem',
    // borderWidth: 1,
    paddingHorizontal: '4rem',
    paddingBottom: '5rem',
  },
  scrollItem: {
    height: '3rem',
    width: '100%',
    borderTopWidth: 1,
  },
  scrollText: {
    textAlign: 'center',
    fontSize: '$fontMd',
  },
  pickPrompt: {
    fontSize: '$fontSm',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: '1rem',
  },
  mango: {
    borderColor: '$mango',
  },
  diceContainer: {
    backgroundColor: '$raspberry',
    height: '3rem',
    width: '3rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '3rem',
  },
  skipBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    textAlign: 'center',
    color: '$raspberry',
    fontSize: '$fontMd',
    letterSpacing: 2,
  },
});

export default IntercomView;
