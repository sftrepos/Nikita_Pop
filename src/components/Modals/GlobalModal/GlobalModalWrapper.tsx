import React, { ReactElement, ReactNode } from 'react';
import GlobalModal, {
  ShowModalParams,
} from 'components/Modals/GlobalModal/GlobalModal';

interface GlobalModalWrapperProps extends ShowModalParams {
  children: ReactNode;
}

const GlobalModalWrapper = ({
  children,
  ...params
}: GlobalModalWrapperProps): ReactElement => (
  <>
    {children}
    <GlobalModal {...params} />
  </>
);

export default GlobalModalWrapper;
