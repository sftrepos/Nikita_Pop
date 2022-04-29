import React, { ReactElement } from 'react';
import DelayView from 'components/DelayView';
import ChatBubble from 'components/Messaging/ChatBubble';
import EStyleSheet from 'react-native-extended-stylesheet';

export type BotResponse = {
  text: string;
  duration?: number;
  component?: () => ReactElement;
};

const styles = EStyleSheet.create({
  mango: {
    borderColor: '$mango',
  },
});

interface IIntercomBotResponse {
  responses: BotResponse[];
  isActive: boolean;
  isDisabled: boolean;
  animationDuration?: number;
}

const IntercomBotResponse = ({
  responses,
  isActive,
  isDisabled,
  animationDuration,
}: IIntercomBotResponse): ReactElement => {
  const defaultDuration = isActive ? animationDuration || 500 : 0;
  return (
    <>
      {responses.map((botResponse) => {
        const { text, duration, component } = botResponse;
        return duration ? (
          <DelayView duration={duration} disabled={isDisabled}>
            {component ? (
              <>{component()}</>
            ) : (
              <ChatBubble
                animationDuration={defaultDuration}
                text={text}
                borderColor={styles.mango.borderColor}
              />
            )}
          </DelayView>
        ) : (
          <ChatBubble
            animationDuration={defaultDuration}
            text={text}
            borderColor={styles.mango.borderColor}
          />
        );
      })}
    </>
  );
};

export default IntercomBotResponse;
