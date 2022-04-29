import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WidgetPickerScreenNagivationProp } from 'nav/types';
import { Paragraph, Title3 } from 'components/Text';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { getNumWidgets, getWidgets } from 'util/selectors';
import { WidgetType } from 'features/Widgets/WidgetTypes';
import { widgetAdd } from 'features/Widgets/WidgetActions';

const styles = EStyleSheet.create({
  widgetButton: {
    width: '95%',
    borderWidth: 0.5,
    borderColor: '$grey3',
    borderRadius: 20,
    backgroundColor: '$lychee',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '2 rem',
    paddingRight: '0.5 rem',
    paddingVertical: '1 rem',
    marginVertical: '0.5 rem',
  },
  widgetButtonText: {
    marginBottom: '1 rem',
  },
  widgetButtonIcon: {
    alignSelf: 'center',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    padding: '1 rem',
    paddingTop: '3 rem',
  },
});

interface WidgetButtonProps {
  title: string;
  description: string;
  onClick: () => void;
}

const WidgetButton = React.memo<WidgetButtonProps>(
  ({ title, description, onClick }) => {
    return (
      <TouchableOpacity onPress={onClick} style={styles.widgetButton}>
        <View>
          <Title3
            style={styles.widgetButtonText}
            color={EStyleSheet.value('$grey2')}>
            {title}
          </Title3>
          <Paragraph
            style={styles.widgetButtonText}
            color={EStyleSheet.value('$grey3')}>
            {description}
          </Paragraph>
        </View>
        <Icon
          name="chevron-right"
          color={EStyleSheet.value('$grey2')}
          size={24}
          style={styles.widgetButtonIcon}
        />
      </TouchableOpacity>
    );
  },
);

interface WidgetPickerScreenProps {
  navigation: WidgetPickerScreenNagivationProp;
}

const WidgetPickerScreen = (
  props: WidgetPickerScreenProps,
): React.ReactElement => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const numWidgets = useSelector((state) => getNumWidgets(state));
  const widgets = useSelector((state) => getWidgets(state));

  const addWidget = (newWidget: WidgetType, replace?: boolean) => {
    Keyboard.dismiss();
    const currentWidgets = [...widgets];
    if (replace) {
      currentWidgets.forEach((widget, idx) => {
        if (widget.type === newWidget.type) {
          currentWidgets[idx] = newWidget;
        }
      });
      dispatch(
        widgetAdd({
          newWidgets: currentWidgets,
          replace,
          typeChanged: newWidget.type,
        }),
      );
    } else {
      dispatch(
        widgetAdd({
          newWidgets: [...widgets, newWidget],
          replace: false,
          typeChanged: null,
        }),
      );
    }
    navigation.navigate('CONTENT_SCREEN');
  };

  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
        },
        styles.contentContainer,
      ]}>
      <WidgetButton
        title="Prompts"
        description="Tap to fill with something cool!"
        onClick={() =>
          navigation.navigate('PROFILE_EDIT_STACK', {
            screen: 'QUESTIONS_WIDGET_SCREEN',
            params: {
              addWidget,
              numWidgets,
              context: 'add',
              widget: undefined,
            },
          })
        }
      />

      <WidgetButton
        title="That’s My Truth Game"
        description="Tap to fill with something cool!"
        onClick={() =>
          navigation.navigate('PROFILE_EDIT_STACK', {
            screen: 'GAME_WIDGET_SCREEN',
            params: {
              addWidget,
              numWidgets,
              context: 'add',
              widget: undefined,
            },
          })
        }
      />
      <WidgetButton
        title="Interests"
        description="Tap to fill with something cool!"
        onClick={() =>
          navigation.navigate('PROFILE_EDIT_STACK', {
            screen: 'INTERESTS_WIDGET_SCREEN',
            params: {
              addWidget,
              numWidgets,
              context: 'add',
              widget: undefined,
            },
          })
        }
      />

      <WidgetButton
        title="Gifs"
        description="Tap to fill with something cool!"
        onClick={() =>
          navigation.navigate('PROFILE_EDIT_STACK', {
            screen: 'GIPHY_WIDGET_SCREEN',
            params: {
              addWidget,
              numWidgets,
              context: 'add',
              widget: undefined,
            },
          })
        }
      />
    </View>
  );
};

export default WidgetPickerScreen;
