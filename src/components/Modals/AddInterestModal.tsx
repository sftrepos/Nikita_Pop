import React, { useState } from 'react';
import { View, Modal, Pressable, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Title2, Paragraph } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Interest } from 'services/types';

const styles = EStyleSheet.create({
  container: {
    flex: 3,
    marginTop: 'auto',
    borderRadius: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    paddingVertical: '1rem',
    // paddingLeft: '1rem',
    fontWeight: 'bold',
  },
  bigTitle: {
    marginTop: '1.5rem',
  },
  searchInputContainer: {
    width: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '1rem',
    padding: '.25rem',
    marginBottom: '1rem',
    alignSelf: 'center',
    fontSize: '1rem',
  },
  chip: {
    padding: '0.75rem',
    paddingHorizontal: '1rem',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 1,
    marginRight: '0.75rem',
    marginBottom: '0.75rem',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: '.12rem',
  },
  addButton: {
    fontSize: '1.3rem',
  },
  containerCategory: {
    paddingHorizontal: '1rem',
    paddingBottom: '1rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

interface AddInterestModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  interestText: string;
  addInterestCallback: (interest: Interest) => void;
  categoryId: string;
  addInterest: (name: string, categoryId: string) => void;
}

//TODO formalize this list somewhere?
const categories = [
  'Arts',
  'TV',
  'Books',
  'Outdoors',
  'Orgs',
  'Music',
  'Movies',
  'Business',
  'Tech',
  'Sports',
  'Gaming',
  // 'Social Cause',
  //   'Learning',
];

const AddInterestModal = ({
  visible,
  setVisible,
  interestText,
  addInterestCallback,
  categoryId,
  addInterest,
}: AddInterestModalProps): React.ReactElement => {
  const theme = useTheme();
  const { colors } = theme;
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [interest, setInterest] = useState(interestText);

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setVisible(false)}></Pressable>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Title2 style={[styles.sectionTitle, styles.bigTitle]}>
          Add a custom interest
        </Title2>
        <TextInput
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.background },
          ]}
          defaultValue={interestText}
          onChangeText={(text) => setInterest(text)}
        />
        <Title2 style={styles.sectionTitle}>Select a Category</Title2>
        <View style={styles.containerCategory}>
          {categories.map((item) => {
            const isSelectedCategory = selectedCategory == item;
            return (
              <Pressable onPress={() => setSelectedCategory(item)}>
                <View
                  style={[
                    styles.chip,
                    styles.selectedChip,
                    isSelectedCategory
                      ? { backgroundColor: colors.secondary }
                      : { backgroundColor: 'white' },
                    { borderColor: colors.secondary },
                  ]}>
                  <Paragraph color={isSelectedCategory ? 'white' : 'dimgray'}>
                    {item}
                  </Paragraph>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Pressable
            onPress={() => {
              setVisible(false);
              addInterest(interest ? interest : interestText, selectedCategory);
            }}>
            <Paragraph color={colors.primary} style={styles.addButton}>
              Done
            </Paragraph>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddInterestModal;
