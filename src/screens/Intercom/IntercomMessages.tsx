import React from 'react';
import STAGES from 'screens/Intercom/stages';
import IntercomBotResponse from 'screens/Intercom/IntecomBotResponse';
import ChatBubble from 'components/Messaging/ChatBubble';
import { ScrollView, View } from 'react-native';
import QuestionWidget from 'components/Widgets/QuestionWidget';
import ProfileCard from 'components/ProfileCard';
import NextButton from 'screens/Register/NextButton';
import routes from 'nav/routes';
import EStyleSheet from 'react-native-extended-stylesheet';
import widgets from '../../constants/widgets';
import { genderMap } from 'screens/Intercom/IntercomView';

interface IIntercomMessages {
  stage: any;
  profile: any;
  setStage: any;
  username: string;
  prompt: string;
  navigation: any;
  submitQuestion: ({
    question,
    response,
  }: {
    question: string;
    response: string;
  }) => void;
}

const styles = EStyleSheet.create({
  mango: {
    borderColor: '$mango',
  },
  questionContainer: {
    height: '16rem',
    marginBottom: '2rem',
  },

  rowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '5rem',
  },
});

const IntercomMessages = React.forwardRef<ScrollView, IIntercomMessages>(
  (
    { stage, submitQuestion, profile, setStage, username, prompt, navigation },
    scrollRef,
  ) => {
    //console.log('PROFILE', profile);
    return (
      <>
        {stage >= STAGES.NAME && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text:
                    'Psst! In here... let’s build your profile so you can start chatting.',
                },
                {
                  text: 'Hi, I’m Pochi, Pop’s mascot.',
                  duration: 1000,
                },
                {
                  text: 'What’s your full name?',
                  duration: 2500,
                },
              ]}
              isActive={stage === STAGES.NAME}
              isDisabled={stage > STAGES.NAME}
            />
            {!!profile.name && (
              <ChatBubble
                text={profile.name}
                onPress={() => {
                  !profile?.meta?.setupComplete && setStage(STAGES.NAME);
                }}
                right
              />
            )}
          </>
        )}
        {stage >= STAGES.USERNAME && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text: `Nice to meet you, ${profile.name}.`,
                },
                {
                  text:
                    'In Pop, you match anonymously using codenames and unlock real names over time.',
                  duration: 1000,
                },
                {
                  text: 'Take a look at a few that I generated for you!',
                  duration: 2000,
                },
              ]}
              isActive={stage === STAGES.NAME}
              isDisabled={stage > STAGES.NAME}
            />
            {!!profile.username && (
              <ChatBubble
                text={profile.username}
                onPress={() => {
                  !profile?.meta?.setupComplete && setStage(STAGES.USERNAME);
                }}
                right
              />
            )}
          </>
        )}
        {stage >= STAGES.GENDER && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text: `So ${username}, did I get it right?`,
                },
                {
                  text: 'You can’t change this after setting up your profile.',
                  duration: 1000,
                },
                {
                  text:
                    'If you want to change any of your responses, tap on your message bubble to edit.',
                  duration: 2000,
                },
                {
                  text:
                    'Next is gender - which we don’t show, but collect to improve Pop.',
                  duration: 3500,
                },
                {
                  text: 'What do you identify as?',
                  duration: 5000,
                },
              ]}
              isActive={stage === STAGES.GENDER}
              isDisabled={stage > STAGES.GENDER}
            />

            {!!profile.gender && (
              <ChatBubble
                text={profile.gender && genderMap[profile.gender].label}
                onPress={() => {
                  !profile?.meta?.setupComplete && setStage(STAGES.GENDER);
                }}
                right
              />
            )}
          </>
        )}
        {stage >= STAGES.MAJOR && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text: 'Okay, I got you.',
                },
                {
                  text: 'Now, let’s spice up your profile!',
                  duration: 1000,
                },
                {
                  text:
                    'Pop helps you meet people inside and outside your classes.',
                  duration: 2000,
                },
                {
                  text: 'What’s your major?',
                  duration: 3500,
                },
              ]}
              isActive={stage === STAGES.MAJOR}
              isDisabled={stage > STAGES.MAJOR}
            />
            {!!profile.university?.major && (
              <ChatBubble
                text={profile.university?.major}
                onPress={() => {
                  !profile?.meta?.setupComplete && setStage(STAGES.MAJOR);
                }}
                right
              />
            )}
          </>
        )}
        {stage >= STAGES.SECONDMAJOR && (
          <>
            <ChatBubble
              animationDuration={stage === STAGES.SECONDMAJOR ? 500 : 0}
              text="If you have another major, enter it below. If not, tap skip."
              borderColor={styles.mango.borderColor}
            />
            {!!profile.university?.secondMajor && (
              <ChatBubble
                text={profile.university?.secondMajor}
                onPress={() =>
                  !profile?.meta?.setupComplete && setStage(STAGES.SECONDMAJOR)
                }
                right
              />
            )}
          </>
        )}
        {stage >= STAGES.YEAR && (
          <>
            <ChatBubble
              animationDuration={stage === STAGES.YEAR ? 500 : 0}
              text="Awesome! What’s your graduation year?"
              borderColor={styles.mango.borderColor}
            />
            {!!profile.university?.gradDate && (
              <ChatBubble
                right
                text={profile.university?.gradDate.toString()}
                onPress={() =>
                  !profile?.meta?.setupComplete && setStage(STAGES.YEAR)
                }
              />
            )}
          </>
        )}
        {stage >= STAGES.LOCATION && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text:
                    'Cool, you can match with people based on major and grad year.',
                },
                { text: 'Okay, just two more questions!', duration: 1000 },
                {
                  text: 'What’s your hometown? Or where are you now?',
                  duration: 1000,
                },
              ]}
              isActive={stage === STAGES.LOCATION}
              isDisabled={stage > STAGES.LOCATION}
            />
            {!!profile.hometown && (
              <ChatBubble
                right
                text={profile.hometown}
                onPress={() =>
                  !profile?.meta?.setupComplete && setStage(STAGES.LOCATION)
                }
              />
            )}
          </>
        )}
        {stage >= STAGES.PROMPT && (
          <>
            <IntercomBotResponse
              responses={[
                {
                  text:
                    'Lastly, let’s show off your personality with a quick question.',
                },
                {
                  text:
                    'Be honest and have fun with it! You can change it later, too.',
                  duration: 1000,
                },
                {
                  text: 'Choose one prompt to answer for now.',
                  duration: 2000,
                },
              ]}
              isActive={stage === STAGES.PROMPT}
              isDisabled={stage > STAGES.PROMPT}
            />
          </>
        )}
        {stage >= STAGES.QUESTION && !!prompt && (
          <View style={styles.questionContainer}>
            <QuestionWidget
              response={
                profile.card?.widgets.find((w) => w?.type === widgets.question)
                  ?.response
              }
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              question={prompt}
              onSubmit={(data: { question: string; response: string }) =>
                submitQuestion(data)
              }
              editable={stage == STAGES.QUESTION}
            />
          </View>
        )}
        {stage >= STAGES.TIPS && (
          <>
            <IntercomBotResponse
              animationDuration={1000}
              responses={[
                { text: 'Awesome – here’s your profile for now.' },
                {
                  component: () => <ProfileCard {...profile} showOne />,
                  text: '',
                  duration: 1500,
                },
                {
                  text:
                    'Take a look! You can change details in your profile later.',
                  duration: 4500,
                },
                {
                  text: `That’s all for now! Great meeting you ${profile.username}.`,
                  duration: 8500,
                },
                {
                  component: () => (
                    <View style={styles.rowCenter}>
                      <NextButton
                        onPress={() => navigation.navigate(routes.HOME_TABS)}
                        label="Let's get popping!"
                      />
                    </View>
                  ),
                  duration: 9500,
                  text: '',
                },
              ]}
              isActive={stage === STAGES.TIPS}
              isDisabled={stage > STAGES.TIPS}
            />
          </>
        )}
      </>
    );
  },
);

export default IntercomMessages;
