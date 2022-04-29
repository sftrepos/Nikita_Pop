import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ContentScreenNavigationProp } from 'nav/types';
import OnboardWrapper from './OnboardWrapper';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Alert, Pressable, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Paragraph, Title3 } from 'components/Text';
import { getUpdateProfileIsLoading, getWidgets } from 'util/selectors';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { WidgetDisplayType } from '../Profile';
import { widgetDelete } from 'features/Widgets/WidgetActions';
import { updateProfile } from 'features/User/UserActions';

import useAnalytics from 'util/analytics/useAnalytics';

const styles = EStyleSheet.create({
  widgetButton: {
    width: '95%',
    borderWidth: 1,
    borderColor: '$grey2',
    borderRadius: 20,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '2 rem',
    paddingRight: '0.5 rem',
    paddingTop: '0.5 rem',
    paddingBottom: '1 rem',
    marginVertical: '0.5 rem',
  },
  widgetButtonTextContainer: {
    marginTop: '0.5 rem',
  },
  widgetButtonText: {
    marginBottom: '1 rem',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  widgetDisplayWrapper: {
    position: 'relative',
    width: '100%',
  },
  widgetButtonIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '1 rem',
    right: '1.5 rem',
    elevation: 1,
    zIndex: 100,
  },
  widgetContent: {
    width: '100%',
    marginHorizontal: 0,
    padding: 0,
    maxHeight: 500,
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
        <View style={styles.widgetButtonTextContainer}>
          <Title3
            style={styles.widgetButtonText}
            color={EStyleSheet.value('$grey3')}>
            {title}
          </Title3>
          <Paragraph
            style={styles.widgetButtonText}
            color={EStyleSheet.value('$grey3')}>
            {description}
          </Paragraph>
        </View>
        <Icon
          name="plus-circle-outline"
          color={EStyleSheet.value('$grey3')}
          size={28}
        />
      </TouchableOpacity>
    );
  },
);

interface WidgetDisplayWrapperProps {
  widget: WidgetDisplayType & { identityId?: string };
  onDelete: () => void;
}

const WidgetDisplayWrapper = React.memo<WidgetDisplayWrapperProps>(
  ({ widget, onDelete }) => {
    return (
      <View style={styles.widgetDisplayWrapper}>
        <Pressable onPress={onDelete} style={styles.widgetButtonIcon}>
          <Icon
            name="minus-circle-outline"
            color={EStyleSheet.value('$grey3')}
            size={28}
          />
        </Pressable>
        <WidgetDisplay widget={widget} style={styles.widgetContent} />
      </View>
    );
  },
);

export interface ContentScreenProps {
  navigation: ContentScreenNavigationProp;
}

const ContentScreen = (props: ContentScreenProps): React.ReactElement => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const widgets = useSelector((state) => getWidgets(state));

  const patchProfile = (data: { name: string }) =>
    dispatch(updateProfile(data));
  const isLoading = useSelector((state) => getUpdateProfileIsLoading(state));

  const onDeleteWidget = (widget: WidgetDisplayType, index: number) => {
    const { type } = widget;
    const widgetNumber = index + 1;
    const getWidgetDataFromStore = (
      structure?: boolean,
      widgetToDeleteType,
    ) => {
      // TODO: Instead of an accumulator use the sequence ID they selected the modifier menu from
      const accumulator = [];

      if (widgets) {
        for (const widget of widgets) {
          if (widget.type === widgetToDeleteType) {
            switch (widgetToDeleteType) {
              case 'interests': {
                if (structure) {
                  return widget;
                }
                return widget.interests;
              }
              case 'game':
                return widget;
              case 'gif':
                accumulator.push(widget);
                break;
              case 'question':
                accumulator.push(widget);
                break;
            }
          }
        }
      }

      if (widgetToDeleteType === 'game') {
        return null;
      } else if (
        widgetToDeleteType === 'gif' ||
        widgetToDeleteType === 'question'
      ) {
        return accumulator;
      } else {
        return [];
      }
    };

    const deleteWidget = () => {
      switch (type) {
        case 'interests':
          dispatch(widgetDelete(getWidgetDataFromStore(true, type)));
          break;
        default:
          dispatch(widgetDelete(getWidgetDataFromStore(false, type)));
          break;
      }
    };

    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteWidget();
            analytics.logEvent(
              {
                name: 'ONBOARDING WIDGET DELETE',
                data: { widget: widgetNumber },
              },
              true,
            );
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const analytics = useAnalytics();

  return (
    <OnboardWrapper
      navigation={navigation}
      titleKey="CONTENT"
      validInput
      onSubmit={() => {
        patchProfile({ meta: { setupComplete: true } });
        analytics.logEvent({ name: 'ONBOARDING CARD SUBMIT', data: {} }, true);
      }}
      preventBack
      customBtnLabel="FINISH"
      loading={isLoading}>
      <View style={styles.contentContainer}>
        {widgets[0] ? (
          <WidgetDisplayWrapper
            widget={widgets[0]}
            onDelete={() => onDeleteWidget(widgets[0], 0)}
          />
        ) : (
          <WidgetButton
            title="Card 1"
            description="Tap to fill with something cool!"
            onClick={() => {
              navigation.push('WIDGET_PICKER_SCREEN');
              analytics.logEvent(
                { name: 'ONBOARDING WIDGET EDIT', data: { widget: 1 } },
                true,
              );
            }}
          />
        )}
        {widgets[1] ? (
          <WidgetDisplayWrapper
            widget={widgets[1]}
            onDelete={() => onDeleteWidget(widgets[1], 1)}
          />
        ) : (
          <WidgetButton
            title="Card 2"
            description="Tap to fill with something cool!"
            onClick={() => {
              navigation.push('WIDGET_PICKER_SCREEN');
              analytics.logEvent(
                { name: 'ONBOARDING WIDGET EDIT', data: { widget: 2 } },
                true,
              );
            }}
          />
        )}
        {widgets[2] ? (
          <WidgetDisplayWrapper
            widget={widgets[2]}
            onDelete={() => onDeleteWidget(widgets[2], 2)}
          />
        ) : (
          <WidgetButton
            title="Card 3"
            description="Tap to fill with something cool!"
            onClick={() => {
              navigation.push('WIDGET_PICKER_SCREEN');
              analytics.logEvent(
                { name: 'ONBOARDING WIDGET EDIT', data: { widget: 3 } },
                true,
              );
            }}
          />
        )}
      </View>
    </OnboardWrapper>
  );
};

export default ContentScreen;
