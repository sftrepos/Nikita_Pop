import React, { ReactElement } from 'react';
import { Keyboard, SafeAreaView, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import StatusBar from 'components/StatusBar';
import WidgetGameIcon from 'assets/vectors/WidgetGameIcon';
import { Paragraph } from 'components/Text';
import { height } from 'util/phone';
import GameBody from 'components/Widgets/GameWidget/GameBody';
import { GameWidgetNavigationProp, GameWidgetRouteProp } from 'nav/types';
import { useDispatch } from 'react-redux';
import { widgetEdit } from 'features/Widgets/WidgetActions';
import Toast from 'react-native-toast-message';

const styles = EStyleSheet.create({
  sa: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: '0.5rem',
    flexDirection: 'row',
  },
  widget: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    minHeight: height * 0.25,
    marginHorizontal: '1.5rem',
    margin: '0.5rem',
    borderRadius: 15,
    padding: '1rem',
  },
  description: {
    marginTop: '1rem',
    marginHorizontal: '2rem',
  },
});

interface IGameWidget {
  navigation: GameWidgetNavigationProp;
  route: GameWidgetRouteProp;
}

export type GameSubmissionParam = {
  truth: string;
  lie1: string;
  lie2: string;
};

const GameWidget = ({ navigation, route }: IGameWidget): ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { colors } = theme;
  const ctx = route.params.context;
  const { numWidgets, addWidget, widget } = route.params;

  const isCtxEdit = ctx === 'edit';

  const onSubmit = (submission: GameSubmissionParam) => {
    const { truth, lie1, lie2 } = submission;

    if (truth.length < 1) {
      Toast.show({
        text1: 'Please enter a truth.',
        type: 'error',
        position: 'bottom',
      });
    } else {
      const widgetGameDefaultParams = {
        type: 'game',
        gameName: 'truthLie',
        sequence: numWidgets,
        gameData: {
          truth: [truth],
          lie: [lie1, lie2],
        },
      } as const;
      Keyboard.dismiss();
      if (isCtxEdit && widget) {
        dispatch(
          widgetEdit({
            ...widgetGameDefaultParams,
            sequence: widget.sequence,
          }),
        );
      } else {
        addWidget({
          ...widgetGameDefaultParams,
          gameData: {
            truth: [truth],
            lie: [lie1, lie2],
          },
        });
      }
    }
  };

  return (
    <SafeAreaView style={[styles.sa, { backgroundColor: colors.card }]}>
      <StatusBar theme={theme} />
      <View style={[styles.widget, { backgroundColor: colors.tertiary }]}>
        <View>
          <View style={styles.titleContainer}>
            <WidgetGameIcon />
            <Paragraph style={{ marginLeft: 5 }} color="#FFB775">
              That's My Truth
            </Paragraph>
          </View>
          <GameBody
            onSubmit={onSubmit}
            navigation={navigation}
            isCtxEdit={isCtxEdit}
            widget={widget}
          />
        </View>
      </View>
      <Paragraph color="#A6AAB4" style={styles.description}>
        {`Write a truth about yourself. Then mix in two lies to let others guess your truth!\n\n(Hint: Try to provide clues in your profile)`}
      </Paragraph>
    </SafeAreaView>
  );
};

export default GameWidget;
