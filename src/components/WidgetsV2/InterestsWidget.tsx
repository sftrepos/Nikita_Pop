import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';
import { Interest } from 'services/types';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { getProfileInterests } from 'util/selectors';
import { getPluralizedWithCount } from 'util/string';
import InterestChip from 'components/WidgetsV2/InterestChip';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const styles = EStyleSheet.create({
  container: {
    borderRadius: 25,
    padding: '1rem',
    marginHorizontal: '1rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 1,
    flexGrow: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export type InterestsPacket = {
  interests: Interest[];
};

interface IInterestsWidget {
  interestWidgetData: InterestsPacket;
}

const InterestsWidget = ({
  interestWidgetData,
}: IInterestsWidget): ReactElement => {
  const theme = useTheme();

  const localUserInterests = useSelector(getProfileInterests);

  // Parse the title to compare common interests
  const parseTitle = () => {
    const commonInterests = _.intersectionWith(
      localUserInterests.interests,
      interestWidgetData.interests,
      _.isEqual,
    );

    if (commonInterests.length) {
      return `${getPluralizedWithCount(
        commonInterests.length,
        'Common Interest',
      )}`;
    }
    return 'Interests';
  };

  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.containerHeader}>
        <Title3 color={theme.colors.secondary}>{parseTitle()}</Title3>
      </View>
      <View style={styles.containerChips}>
        {interestWidgetData.interests.map((interest, idx) => {
          const isCommon = _.find(
            localUserInterests.interests,
            interestWidgetData.interests,
          );
          return (
            <InterestChip
              isCommon={isCommon}
              containerStyle={[
                isCommon
                  ? { backgroundColor: colors.secondary }
                  : { backgroundColor: colors.card },
              ]}
              interest={interest}
              color={isCommon ? colors.card : colors.text}
            />
          );
        })}
      </View>
    </View>
  );
};

export default InterestsWidget;
