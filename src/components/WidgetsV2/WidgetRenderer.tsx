import React, { ReactElement } from 'react';
import QuestionWidget, {
  QuestionPacket,
} from 'components/WidgetsV2/QuestionWidget';
import InterestsWidget, {
  InterestsPacket,
} from 'components/WidgetsV2/InterestsWidget';
import { WidgetDisplayType } from 'screens/Profile';
import { forceCast } from 'util/types';

export type TWidgets = 'question' | 'interests' | 'gif' | 'game';

interface IWidgetRenderer {
  data: WidgetDisplayType;
}

function WidgetRenderer({ data }: IWidgetRenderer): ReactElement {
  // TODO: Find a better way to enforce the correct object types from API conditional types.
  // forceCast only valid here because only these properties show up from the API call only during the particular
  // data.type
  switch (data.type) {
    case 'question': {
      const questionWidgetData = forceCast<QuestionPacket>({
        question: data.question,
        response: data.response,
      });
      return <QuestionWidget questionWidgetData={questionWidgetData} />;
    }
    case 'interests':
      return (
        <InterestsWidget
          interestWidgetData={forceCast<InterestsPacket>({
            interests: data.interests,
          })}
        />
      );
    case 'gif':
      break;
    case 'game':
      break;
  }
  return <></>;
}

export default WidgetRenderer;
