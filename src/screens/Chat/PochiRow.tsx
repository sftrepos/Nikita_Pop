import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import LagoonGradient from 'components/Gradients/LagoonGradient';
import CustomAvatar from 'assets/vectors/pochies/CustomAvatar';
import { Paragraph, Title3 } from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';

interface IPochiRow {
  navigation: any;
}

const styles = EStyleSheet.create({
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: '1 rem',
  },
  pochiText: {
    marginLeft: '1rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

const PochiRow = ({ navigation }: IPochiRow): React.ReactElement => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => navigation.navigate('INTERCOM_SCREEN')}>
      <LagoonGradient>
        <View style={styles.listItem}>
          <CustomAvatar
            scale={0.35}
            faceType="1"
            faceColor="#FFF087"
            bubbleColor="#4DCEE8"
          />
          <View style={styles.pochiText}>
            <Title3 color={colors.text}>Pochi from Pop</Title3>
            <Paragraph color={colors.text}>Psst! In here...</Paragraph>
          </View>
        </View>
      </LagoonGradient>
    </Pressable>
  );
};

export default PochiRow;
