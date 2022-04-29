import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  ViewStyle,
  TextStyle,
  Alert,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';
import store from 'store/index';
import {
  getAvatar,
  getId,
  getLocalUserData,
  getStoreToken,
} from 'util/selectors';
import { PopApi } from 'services/api';
import { connect } from 'react-redux';
import { WidgetType } from 'features/Widgets/WidgetTypes';
import {
  widgetOrder,
  widgetAdd,
  widgetGet,
  widgetDelete,
} from 'features/Widgets/WidgetActions';
import { ProfileEditNavigationProp } from 'nav/types';
import { CardHeader } from 'components/Card/CardHeader';
import Avatar, { AvatarProps, AvatarWrapper } from 'components/Avatar';
import { CustomAvatarProps } from 'assets/vectors/pochies/CustomAvatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { WidgetDisplayType } from 'screens/Profile/index';
import { UniversityData } from 'services/types';
import { CardImg } from 'components/Card';
import WidgetDisplay from 'components/Widgets/WidgetDisplay';
import { DragSortableView } from 'react-native-drag-sort';
import { width } from 'util/phone';

import useAnalytics from 'util/analytics/useAnalytics';
import EditVaccineModal from 'components/Modals/EditVaccineModal';
import IconButton from 'components/Buttons/IconButton';

const styles = EStyleSheet.create({
  _s: {
    marginTop: '0.5rem',
    marginRight: '0.5rem',
    height: '8rem',
    rem_15: '1.5rem',
    grey: '$grey5',
  },
  SA: {
    flex: 1,
  },
  widgetContainer: {
    height: '10 rem',
    marginHorizontal: '1 rem',
    borderRadius: 10,
  },
  addButton: {
    marginHorizontal: '1 rem',
    marginBottom: '1 rem',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: '0.5 rem',
  },
  addProfileActive: {
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: '0.5 rem',
  },
  addingContainer: {
    marginHorizontal: '1 rem',
    marginBottom: '1 rem',
    borderRadius: 10,
    alignItems: 'center',
  },
  placeholderImg: {
    height: '15 rem',
    marginTop: '-1.0 * 1rem',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    width: '100%',
  },
  avatar: {
    marginTop: '-1.0 * 6rem',
    flex: 1,
  },
  containerBackgroundImgButton: {
    position: 'absolute',
    bottom: 10,
    right: '1 rem',
  },
  widgetAddContainerActive: {
    flexDirection: 'row',
    alignContent: 'stretch',
    flexWrap: 'wrap',
    padding: '1rem',
  },
  widgetButton: {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: '0.5rem',
    borderRadius: 50,
  },
  containerWidget: {
    flex: 1,
  },
  _childrenHeight: {
    height: 200,
    margin: '1rem',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '1rem',
    marginVertical: '.5rem',
    height: '4rem',
  },
  iconButton: {
    flex: 1,
  },
  icon: {
    alignSelf: 'flex-end',
  },
});

export type Widget = 'Interests' | 'Games' | 'GIFs' | 'Questions';

interface ProfileEditProps {
  navigation: ProfileEditNavigationProp;
  numWidgets: number;
  dispatchWidgetAdd: (
    widgets: Widget[],
    replace?: boolean,
    typeChanged?: string,
  ) => void;
  dispatchWidgetGet: () => void;
  dispatchDeleteWidget: (payload: WidgetType) => void;
  avatar: CustomAvatarProps;
  localUser: {
    username: string;
    university: UniversityData;
    hometown: string;
    card: {
      widgets: WidgetDisplayType[];
      background: string;
    };
  };
  widgets: WidgetDisplayType[];
}

const MAX_WIDGETS = 5;

const ProfileEdit = ({
  navigation,
  widgets,
  numWidgets,
  dispatchWidgetAdd,
  localUser,
  dispatchWidgetGet,
  dispatchWidgetOrdering,
  dispatchDeleteWidget,
}: ProfileEditProps) => {
  const [dragSortScrollEnabled, setDragSortScrollEnabled] = useState(true);
  const [user, setUser] = useState(localUser);
  const userState = { ...user };
  const [dragSortData, setDragSortData] = useState(userState.card.widgets);
  const theme = useTheme();
  const { colors } = theme;
  const avatar = { ...userState.avatar };
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      setUser({ ...localUser });
    });
  }, []);
  useEffect(() => {
    setDragSortData(widgets);
  }, [widgets]);

  const { university, hometown, username, meta } = userState;
  const card = { ...userState.card };
  const { background } = card;
  const { gradDate, major, secondMajor } = university;

  const [isAddingWidgets, setIsAddingWidgets] = useState(false);

  const analytics = useAnalytics();

  useEffect(() => {
    getWidgets();
  }, []);

  const id = getId(store.getState());
  const getWidgets = async () => {
    const token = getStoreToken(store.getState());
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      id,
    };
    PopApi.getWidgets(body, headers).then((res) => {
      const data = res.response.data;
      dispatchWidgetGet(data.widgets.onCard, data.widgets.fromArchive);
    });
  };

  const addWidget = (newWidget: WidgetType, replace?: boolean) => {
    const currentWidgets = [...widgets];
    if (replace) {
      currentWidgets.forEach((widget, idx) => {
        if (widget.type === newWidget.type) {
          currentWidgets[idx] = newWidget;
        }
      });
      dispatchWidgetAdd(currentWidgets, replace, newWidget.type);
    } else {
      dispatchWidgetAdd([...widgets, newWidget]);
    }
  };

  const onPressWidgetAddButton = (type: Widget) => {
    const navparams = {
      addWidget,
      numWidgets,
      context: 'add',
      widget: undefined,
    };
    switch (type) {
      case 'Games':
        navigation.navigate('GAME_WIDGET_SCREEN', navparams);
        analytics.logEvent(
          { name: 'GAME WIDGET EDIT SCREEN OPEN', data: {} },
          true,
        );
        break;
      case 'GIFs':
        navigation.navigate('GIPHY_WIDGET_SCREEN', navparams);
        analytics.logEvent(
          { name: 'GIF WIDGET EDIT SCREEN OPEN', data: {} },
          true,
        );
        break;
      case 'Interests':
        navigation.navigate('INTERESTS_WIDGET_SCREEN', navparams);
        analytics.logEvent(
          { name: 'INTEREST WIDGET EDIT SCREEN OPEN', data: {} },
          true,
        );
        break;
      case 'Questions':
        navigation.navigate('QUESTIONS_WIDGET_SCREEN', navparams);
        analytics.logEvent(
          { name: 'QUESTIONS WIDGET EDIT SCREEN OPEN', data: {} },
          true,
        );
        break;
    }
  };

  const renderWidgetAddButton = (
    type: Widget,
    widgetButtonStyles?: ViewStyle,
    widgetTextStyles?: TextStyle,
  ) => (
    <Pressable onPress={() => onPressWidgetAddButton(type)}>
      {({ pressed }) => (
        <View
          style={[
            styles.widgetButton,
            widgetButtonStyles,
            {
              borderColor: colors.border,
              backgroundColor: pressed ? colors.border : colors.card,
            },
          ]}>
          <Paragraph style={[widgetTextStyles]} color={colors.text}>
            {type}
          </Paragraph>
        </View>
      )}
    </Pressable>
  );

  const renderBackgroundImg = () => {
    return (
      <View>
        <Pressable
          onPress={() => {
            navigation.navigate('IMAGE_BACKGROUND_WIDGET_SCREEN');
            analytics.logEvent(
              { name: 'OPEN BACKGROUND EDIT SCREEN', data: {} },
              true,
            );
          }}>
          <CardImg datasrc={background} style={styles.placeholderImg} />
        </Pressable>
        <TouchableNativeFeedback
          onPress={() => {
            navigation.navigate('IMAGE_BACKGROUND_WIDGET_SCREEN');
          }}>
          <Icon
            style={styles.containerBackgroundImgButton}
            name="image-multiple"
            size={25}
            color={'white'}
          />
        </TouchableNativeFeedback>
      </View>
    );
  };

  const onPressAvatar = () => {
    navigation.navigate('CUSTOMIZE_AVATAR_SCREEN');
    analytics.logEvent({ name: 'OPEN AVATAR EDIT SCREEN', data: {} }, true);
  };

  // get it from redux store to see any updates
  const isVaccinated = meta?.isVaccinated || false;
  const [userVaccinated, setUserVaccinated] = useState(isVaccinated);
  const [showEditVaccineModal, setShowEditVaccineModal] = useState(false);

  useEffect(() => {}, [userVaccinated]);

  const onEditVaccineClose = (newState: boolean) => {
    setShowEditVaccineModal(false);
    setUserVaccinated(newState);
  };

  const renderEditVaccineBadge = () => {
    if (!showEditVaccineModal) {
      return <></>;
    } else {
      return (
        <>
          <EditVaccineModal
            state={userVaccinated}
            id={id}
            onClose={onEditVaccineClose}
            isVisible={showEditVaccineModal}
            isEditingProfile
          />
        </>
      );
    }
  };

  const avatarProps: AvatarProps = {
    scale: 0.8,
    avatar: avatar,
    theme: theme,
    containerStyle: styles.avatar,
    onPress: onPressAvatar,
  };

  const renderAvatar = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AvatarWrapper
        containerStyle={styles.header}
        avatarProps={avatarProps}
        leftChild={<View style={{ flex: 1 }} />}
        rightChild={
          <>
            <IconButton
              size={styles._s.rem_15}
              iconColor={userVaccinated ? colors.grapesicle : colors.gray}
              iconBackgroundColor={styles._s.grey}
              containerStyle={styles.iconButton}
              onPress={() => setShowEditVaccineModal(true)}
              style={styles.icon}
              iconName={
                userVaccinated ? 'shield-check' : 'shield-check-outline'
              }
            />
            {renderEditVaccineBadge()}
          </>
        }
      />

      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.card,
          right: width * 0.33,
          width: 25,
          height: 25,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name="pen"
          onPress={onPressAvatar}
          size={16}
          color={colors.text}
        />
      </View>
    </View>
  );

  const onDeleteWidget = (widget: WidgetDisplayType) => {
    const { type, sequence } = widget;

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
          dispatchDeleteWidget(getWidgetDataFromStore(true, type));
          break;
        default:
          dispatchDeleteWidget(getWidgetDataFromStore(false, type));
          break;
      }
    };

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
          onPress: deleteWidget,
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const onEditWidget = (widget: WidgetDisplayType) => {
    const { type, sequence } = widget;
    const navparams = {
      addWidget,
      numWidgets,
      context: 'edit',
      widget: widget,
    };
    //handle context for each screen
    switch (type) {
      case 'interests':
        navigation.navigate('INTERESTS_WIDGET_SCREEN', navparams);
        break;
      case 'game':
        navigation.navigate('GAME_WIDGET_SCREEN', navparams);
        break;
      case 'gif':
        navigation.navigate('GIPHY_WIDGET_SCREEN', navparams);
        break;
      case 'question':
        navigation.navigate('QUESTIONS_WIDGET_SCREEN', navparams);
        break;
    }
  };

  const renderBody = () => (
    <View style={{ flexGrow: 1 }}>
      {renderBackgroundImg()}
      {renderAvatar()}
      <CardHeader
        codename={username}
        theme={theme}
        major={major}
        gradClass={gradDate?.toString()}
        location={hometown}
        secondMajor={secondMajor}
        meta={meta}
        showEditVaccineBadge
      />
      {widgets.length < MAX_WIDGETS && (
        <Pressable onPress={() => setIsAddingWidgets(!isAddingWidgets)}>
          {!isAddingWidgets ? (
            ({ pressed }) => (
              <View
                style={[
                  { backgroundColor: colors.secondary },
                  styles.addButton,
                ]}>
                <Paragraph color="white">Add to Your Profile</Paragraph>
              </View>
            )
          ) : (
            <View
              style={[
                { backgroundColor: colors.card },
                styles.addingContainer,
              ]}>
              <View
                style={[
                  { backgroundColor: colors.secondary },
                  styles.addProfileActive,
                ]}>
                <Paragraph color="white">Add to Your Profile</Paragraph>
              </View>
              <View style={styles.widgetAddContainerActive}>
                <View
                  style={[
                    styles.containerWidget,
                    { marginRight: styles._s.marginRight },
                  ]}>
                  {renderWidgetAddButton(
                    'Interests',
                    {},
                    { color: colors.secondary },
                  )}
                  {renderWidgetAddButton(
                    'GIFs',
                    {
                      marginTop: styles._s.marginTop,
                    },
                    { color: colors.purple },
                  )}
                </View>

                <View style={styles.containerWidget}>
                  {renderWidgetAddButton('Games', {}, { color: colors.mango })}
                  {renderWidgetAddButton(
                    'Questions',
                    {
                      marginTop: styles._s.marginTop,
                    },
                    { color: colors.primary },
                  )}
                </View>
              </View>
            </View>
          )}
        </Pressable>
      )}
      <View style={{}}>
        <DragSortableView
          dataSource={dragSortData}
          parentWidth={width}
          childrenWidth={width}
          childrenHeight={styles._childrenHeight.height}
          marginChildrenBottom={styles._childrenHeight.margin}
          scaleStatus="scaleY"
          sortable
          onDragStart={() => {
            setDragSortScrollEnabled(false);
          }}
          onDragEnd={() => {
            setDragSortScrollEnabled(true);
          }}
          onDataChange={(data) => {
            // Update sequence numbers
            data.map((e, idx) => {
              e.sequence = idx;
            });
            dispatchWidgetOrdering(data);

            if (data.length !== dragSortData.length) {
              setDragSortData(data);
            }
          }}
          keyExtractor={(item, idx) => item.type}
          onClickItem={(e) => {}}
          renderItem={(item, idx) => {
            return (
              <WidgetDisplay
                onToggle={() => {
                  console.log('toggle');
                }}
                onDelete={onDeleteWidget}
                onEdit={onEditWidget}
                isDraggable
                style={{ width, height: styles._childrenHeight.height }}
                widget={item}
              />
            );
          }}
        />
      </View>
    </View>
  );

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      style={{ flexGrow: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
      ref={scrollViewRef}
      scrollEnabled={dragSortScrollEnabled}
      nestedScrollEnabled>
      {renderBody()}
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({
  widgets: state.widget.widgets,
  numWidgets: state.widget.numWidgets,
  localUser: getLocalUserData(state),
  avatar: getAvatar(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchWidgetAdd: (
    newWidgets: unknown[],
    replace?: boolean,
    typeChanged?: string,
  ) => dispatch(widgetAdd({ newWidgets, replace, typeChanged })),
  dispatchDeleteWidget: (payload: WidgetType) =>
    dispatch(widgetDelete(payload)),
  dispatchWidgetOrdering: (widgets) => dispatch(widgetOrder(widgets)),
  dispatchWidgetGet: (widgets, widgetHistory) =>
    dispatch(widgetGet(widgets, widgetHistory)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
