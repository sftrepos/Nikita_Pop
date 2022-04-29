import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Modal } from 'react-native';
// import { EntryItem } from 'screens/Settings';
import { Paragraph, Title3, Title2, Title } from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import Separator from 'components/Separator';
import SendBird from 'sendbird';

const styles = EStyleSheet.create({
  container: {
    // flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3 rem',
    paddingHorizontal: '1 rem',
  },
  modalContainer: {
    flex: 1.2,
    marginTop: 'auto',
    borderRadius: 20,
    alignItems: 'center',
  },
  addButton: {
    fontSize: '1.3rem',
  },
  sectionSeparatorBorder: {
    borderTopWidth: EStyleSheet.hairlineWidth,
    height: 36,
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  containerLogoutButton: {
    flexDirection: 'row',
  },
  containerSettingItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textSectionTitle: {
    padding: '1 rem',
  },
  modalTitle: {
    marginTop: '1.5rem',
  },
  modalText: {
    fontSize: '1.2 rem',
    margin: '1rem',
  },
  containerSettingRoundedItem: {
    borderRadius: 25,
    marginHorizontal: '1 rem',
  },
  textSection: {
    padding: '1 rem',
  },
  containerLogout: {
    alignSelf: 'center',
    paddingVertical: '1 rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleRoundedItemMargin: {
    marginBottom: '1 rem',
  },
  listPadding: {
    paddingBottom: '2 rem',
  },
});

type TItemSelector = {
  onPress: () => void;
  title: string;
  selected: string;
};

// a radio button preset
const ItemSelector = ({ onPress, title, selected }: TItemSelector) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[
        styles.container,
        styles.containerSettingItem,
        { backgroundColor: colors.card },
      ]}
      onPress={onPress}>
      <RadioButton.Android
        value={title}
        status={selected === title ? 'checked' : 'unchecked'}
      />
      <Paragraph color={colors.text}>{title}</Paragraph>
    </Pressable>
  );
};

type TSwitchItem = {
  title: string;
  toggled: boolean;
  disabled: boolean;
  onPress: () => void;
};

// toggle-able switch preset
const SwitchItem = ({ title, toggled, onPress, disabled }: TSwitchItem) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        styles.containerSettingItem,
        { backgroundColor: colors.card, justifyContent: 'space-between' },
      ]}>
      <View>
        <Paragraph color={colors.text}>{title}</Paragraph>
      </View>
      <Switch
        trackColor={{ false: 'lightgray', true: colors.primary }}
        ios_backgroundColor="lightgray"
        disabled={disabled}
        onValueChange={onPress}
        value={toggled}
      />
    </View>
  );
};

interface IPushModalProps {
  onPress: () => void;
  title: string;
}

const ModalItem = ({ onPress, title }: IPushModalProps) => {
  const { colors } = useTheme();
  return (
    <>
      <Pressable onPress={onPress}>
        <View
          style={[
            {
              backgroundColor: colors.card,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View>
            <Paragraph style={styles.modalText} color={colors.text}>
              {title}
            </Paragraph>
          </View>
        </View>
      </Pressable>
      <Separator />
    </>
  );
};

const NotificationSettings = () => {
  const sb = SendBird.getInstance();
  const { colors } = useTheme();

  const [selectedItem, setSelectedItem] = useState('None'); // add redux
  const [toggled, setToggled] = useState(false); // add redux
  const [pushModalVisible, setPushModalVisible] = useState(false);

  const setSnooze = (hours: number, minutes: number) => {
    setPushModalVisible(false);
    setToggled(true);
    const today = new Date();
    sb.setDoNotDisturb(
      true,
      today.getHours(),
      today.getMinutes(),
      today.getHours() + hours,
      today.getMinutes() + minutes,
      'UTC',
    );
  };

  const unSnooze = () => {
    sb.setDoNotDisturb(false, 0, 0, 0, 0, 'UTC');
  };

  useEffect(() => {
    sb.getPushTriggerOption().then((res) => {
      if (res === 'all') {
        setSelectedItem('All Messages');
      } else if (res === 'off') {
        setSelectedItem('None');
      }
    });

    sb.getDoNotDisturb().then((res) => {
      setToggled(res.doNotDisturbOn);
    });
  }, []);

  return (
    <View>
      <Title3 color={colors.text} style={styles.textSectionTitle}>
        Chat Notifications
      </Title3>
      <RadioButton.Group
        onValueChange={(newValue) => {
          setSelectedItem(newValue);
        }}
        value={selectedItem}>
        <ItemSelector
          onPress={() => {
            // set sendbird
            sb.setPushTriggerOption('all');
            setSelectedItem('All Messages');
          }}
          title="All Messages"
          selected={selectedItem}
        />
        <ItemSelector
          onPress={() => {
            sb.setPushTriggerOption('off');
            setSelectedItem('None');
          }}
          title="None"
          selected={selectedItem}
        />
      </RadioButton.Group>
      <View style={styles.textSectionTitle} />
      <View>
        <SwitchItem
          title="Pause Notifications"
          toggled={toggled}
          onPress={() => {
            if (toggled) {
              setToggled(false);
              unSnooze();
            } else {
              setToggled(true);
              setPushModalVisible(true);
            }
          }}
          disabled={selectedItem === 'None'}
        />
      </View>
      {/* Push Notification modal */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        visible={pushModalVisible}
        onRequestClose={() => {
          setPushModalVisible(false);
        }}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setPushModalVisible(false);
            setToggled(false);
          }}
        />
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <Title2 style={[styles.modalTitle]} color={colors.text}>
            Pause Notifications
          </Title2>
          <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
            <Separator />
            <ModalItem
              onPress={() => {
                setSnooze(0, 15);
              }}
              title="15 minutes"
            />
            <ModalItem
              onPress={() => {
                setSnooze(1, 0);
              }}
              title="1 hour"
            />
            <ModalItem
              onPress={() => {
                setSnooze(2, 0);
              }}
              title="2 hours"
            />
            <ModalItem
              onPress={() => {
                setSnooze(4, 0);
              }}
              title="4 hours"
            />
            <ModalItem
              onPress={() => {
                setSnooze(8, 0);
              }}
              title="8 hours"
            />

            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Pressable
                onPress={() => {
                  setPushModalVisible(false);
                  setToggled(false);
                }}>
                <Paragraph color={colors.primary} style={styles.addButton}>
                  Cancel
                </Paragraph>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationSettings;
