//This view delays showing a component until xx time

import React, { useState, useEffect, ReactChildren, ReactElement } from 'react';

interface DelayViewProps {
  duration: number; //milliseconds
  children: ReactChildren | ReactElement;
  disabled?: boolean;
}

const DelayView = ({
  duration,
  children,
  disabled = false,
}: DelayViewProps): ReactElement => {
  const [hidden, setHidden] = useState<boolean>(!disabled);

  useEffect(() => {
    setTimeout(() => setHidden(false), duration);
  }, []);

  return hidden ? <></> : <>{children}</>;
};

export default DelayView;
