import { useCallback, useEffect, useMemo, useState } from 'react';

export const INIT = 'INIT';
export const PLAYING = 'PLAYING';
export const STOPPED = 'STOPPED';

export type TimeValues = {
  timer: number;
  timings: Record<string, number[]>;
  prev: number;
};

export type TimeState = typeof INIT | typeof PLAYING | typeof STOPPED;

export type TimerControls = {
  onChange: ({ key }: { key?: string }) => void;
};

export interface IInteractionTimer {
  controls: TimerControls;
  values: TimeValues;
}

export interface IInteractionTimerProps {
  initialTime?: number;
  startImmediately?: boolean;
}

/**
 * Tracks time using controls. Currently built for viewing cards but will be scaling into pausing, resetting, resuming,
 * creating timing checkpoints, and more.
 *
 * Timings - Gives a record of a specified key and array of timings.
 *  A number[] accounts for if the user goes back for multiple viewings of a single component.
 *
 * @param initialTime
 * @param startImmediately
 * @return IInteractionTimer
 */
export const useInteractionTimer = ({
  initialTime = 0,
  startImmediately = true,
}: IInteractionTimerProps): IInteractionTimer => {
  const [internalTime, setInternalTime] = useState(Date.now());
  const [id, setId] = useState<number | null>(null);
  const [timeState, setTimeState] = useState<TimeState>(INIT);
  const [time, setTime] = useState<TimeValues>({
    timer: 0,
    prev: 0,
    timings: {},
  });

  const setTimerInterval = () => {
    if (id) {
      clearInterval(id);
    }

    const interval = Date.now() - internalTime;
    const timer = interval - time.prev;
    const prev = (time.prev += timer);

    return { timer, prev };
  };

  const start = useCallback(() => {
    setTimeState(PLAYING);
  }, []);

  const stop = useCallback(() => {
    setTimeState(STOPPED);
  }, []);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, []);

  const getPrevTimings = (key: string) =>
    time.timings[key]?.length ? time.timings[key] : [];

  const insertTiming = (key?: string) => {
    const { timer, prev } = setTimerInterval();
    const prevTimings = time.timings;
    if (key) {
      prevTimings[key] = [...getPrevTimings(key), timer / 1000];
    } else {
      // TODO: Add no-key insertion
    }

    setTime({ timer, timings: { ...prevTimings }, prev });
  };

  const onChange = ({ key }: { key?: string }) => {
    insertTiming(key);
  };

  const controls = useMemo(
    () => ({
      onChange,
    }),
    [],
  );

  return {
    controls,
    values: time,
  };
};
