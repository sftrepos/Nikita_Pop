import React, { useState } from 'react';
import { View, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Paragraph } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Interest } from 'services/types';

const styles = EStyleSheet.create({
  chip: {
    padding: '0.5rem',
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
  sectionHeader: {
    borderTopWidth: EStyleSheet.hairlineWidth,
    padding: '1rem',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    paddingBottom: '.5rem',
    paddingLeft: '1rem',
    fontWeight: 'bold',
  },
  containerCategory: {
    paddingHorizontal: '1rem',
    paddingBottom: '1rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  containerMore: {
    padding: '0.5rem',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const InterestBucket = ({
  navigation,
  MAX_INTERESTS,
  onAddInterest,
  showMore,
  item,
  selectedInterests,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const [showMoreVisible, setShowMoreVisible] = useState(true);

  const { data } = item;

  //hiding show more not working
  const ShowMoreButton = ({ category }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          //   setShowMoreVisible(showMore(category));
          showMore(category);
        }}>
        <View style={styles.containerMore}>
          <Paragraph color={colors.secondary}>Show more</Paragraph>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Paragraph
        style={[styles.sectionHeader, { borderColor: colors.border }]}
        color={colors.text}>
        {item.title}
      </Paragraph>
      <View style={[styles.containerCategory, { borderColor: colors.border }]}>
        {data.map((interest: Interest) => {
          const { title, categoryId } = interest;
          const isSelected = _.find(selectedInterests, { title, categoryId });
          return (
            <Pressable onPress={() => onAddInterest({ title, categoryId })}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.chip,
                    pressed
                      ? { backgroundColor: colors.border }
                      : isSelected
                      ? { backgroundColor: colors.secondary }
                      : { backgroundColor: colors.card },
                  ]}>
                  <Paragraph color={isSelected ? 'white' : colors.text}>
                    {title}
                  </Paragraph>
                </View>
              )}
            </Pressable>
          );
        })}
        {showMoreVisible && <ShowMoreButton category={item.title} />}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  selectedInterests: state.interests.selected,
});

export default connect(mapStateToProps, null)(InterestBucket);
