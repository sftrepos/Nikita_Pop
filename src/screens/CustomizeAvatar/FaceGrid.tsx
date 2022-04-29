import React, { ReactElement } from 'react';
import { View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Face from 'assets/vectors/pochies/parts/Face';
import { FACE_TYPES } from 'assets/vectors/pochies/parts/constants';
import { useTheme } from '@react-navigation/native';

interface FaceGridProps {
  setFace: (face: string) => void;
  faces: typeof FACE_TYPES;
  selectedFace: string;
}

interface FaceButtonProps {
  face: string;
  onPress: (face: string) => void;
  selectedFace: string;
}

const FaceGrid = ({ setFace, selectedFace }: FaceGridProps): ReactElement => {
  return (
    <View style={styles.grid}>
      {Object.values(FACE_TYPES).map((f) => (
        <FaceButton onPress={setFace} face={f} selectedFace={selectedFace} />
      ))}
    </View>
  );
};

const FaceButton = ({ face, onPress, selectedFace }: FaceButtonProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const handleOnPress = () => onPress(face);
  return (
    <View
      style={[styles.faceButtonContainer, { backgroundColor: colors.border }]}>
      <TouchableOpacity onPress={handleOnPress}>
        <View
          style={[
            styles.faceButton,
            selectedFace === face ? styles.selected : null,
          ]}>
          <Face faceType={face} scale={1} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = EStyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  faceButtonContainer: {
    marginTop: '2.5rem',
    marginHorizontal: '.5rem',
    borderRadius: 75,
  },
  faceButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.62,
    backgroundColor: 'white',
    elevation: 4,
  },
  selected: {
    borderWidth: '0.25rem',
    borderColor: 'black',
  },
});

export default FaceGrid;
