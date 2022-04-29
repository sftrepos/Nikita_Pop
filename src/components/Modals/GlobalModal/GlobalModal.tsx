import React, { ReactElement, ReactNode, useState } from 'react';
import FilterModal from 'components/Modals/FilterModal';
import CarouselExpandModal from 'components/Modals/CarouselExpandModal';
import { Modal } from 'react-native';
import { useModalState } from 'util/anim';
import RequestCarouselModal from 'components/Modals/RequestCarouselModal';
import InviteSendModal from 'components/Modals/InviteSendModal';

export interface GlobalModalStateInterface {
  Component: ReactNode;
  visible: boolean;
}

type ShowModalTypes = 'none' | 'filter' | 'chat_report_user' | 'c_expand';

export interface ShowModalParams<T = Record<string, unknown>> {
  type: ShowModalTypes;
  data?: T;
  Component?: ReactNode;
}

export interface GlobalModalHandlerInterface {
  // Eventually set generic type for data as any additional props passed
  showModal: (params: { data: Record<string, unknown>; type: string }) => void;
  hideModal: () => void;
}

export const GlobalModalHandler: GlobalModalHandlerInterface = {
  showModal: () => null,
  hideModal: () => null,
};

const GlobalModal = (params: ShowModalParams): ReactElement => {
  const [type, setType] = useState('');
  const [data, setData] = useState<Record<string, unknown>>();
  const [visible, setVisible] = useModalState(false);

  const onPressClose = () => {
    setVisible(false);
  };

  const renderComponent = () => {
    switch (type) {
      case 'filter':
        return <FilterModal data={data} />;
      case 'chat_report_user':
        return;
      case 'c_expand':
        return <CarouselExpandModal data={data} onPressClose={onPressClose} />;
      case 'c_expand_requests':
        return <RequestCarouselModal data={data} />;
      case 'invite_send':
        return <InviteSendModal data={data} onPressClose={onPressClose} />;
      default:
        return null;
    }
  };

  GlobalModalHandler.showModal = ({ type, data }) => {
    setType(type);
    setData(data);
    setVisible(false);
    requestAnimationFrame(() => setVisible(true));
  };

  GlobalModalHandler.hideModal = () => {
    setData(undefined);
    setVisible(false);
  };

  // update back button behavior of modal based on type
  const onRequestClose = () => {
    switch (type) {
      case 'c_expand':
        return onPressClose;
      case 'invite_send':
        return onPressClose;
      default:
        return GlobalModalHandler.hideModal;
    }
  };

  return (
    <Modal
      visible={visible}
      hardwareAccelerated
      presentationStyle={type == 'filter' ? 'fullScreen' : 'pageSheet'}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onRequestClose()}>
      {renderComponent()}
    </Modal>
  );
};

export default GlobalModal;
