import React, { ReactElement } from 'react';
import { View, Modal } from 'react-native';

interface PageSheetModalProps {
  children: React.ReactChild;
  isVisible: boolean;
}

const PageSheetModal = ({
  isVisible,
  children,
  ...rest
}: PageSheetModalProps): ReactElement => (
  <View>
    <Modal
      hardwareAccelerated
      presentationStyle="pageSheet"
      visible={isVisible}
      animationType="slide"
      {...rest}>
      {children}
    </Modal>
  </View>
);

export default PageSheetModal;
