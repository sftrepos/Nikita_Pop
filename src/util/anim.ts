import { Value } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { onGestureEvent } from 'react-native-redash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const verticalPanGestureHandler = () => {
  const translationY = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    translationY,
    velocityY,
    state,
  });

  return {
    translationY,
    state,
    velocityY,
    gestureHandler,
  };
};

export const useModalState = (
  initialState: boolean,
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [modalVisible, setModalVisible] = useState(initialState);
  const [forceModalVisible, setForceModalVisible] = useState(false);

  const setModal = (modalState: SetStateAction<boolean>) => {
    if (modalState && modalVisible) {
      setForceModalVisible(true);
    }
    setModalVisible(modalState);
  };

  useEffect(() => {
    if (forceModalVisible && modalVisible) {
      setModalVisible(false);
    }
    if (forceModalVisible && !modalVisible) {
      setForceModalVisible(false);
      setModalVisible(true);
    }
  }, [forceModalVisible, modalVisible]);

  return [modalVisible, setModal];
};
