import clsx from 'clsx';
import { PropsWithChildren, HTMLAttributes, memo, VFC } from 'react';

import { exhaustiveCheck } from '../../utils/exhaustiveCheck';
import {
  TimerState,
  STEADY,
  READY,
  WORKING,
  IDOLING,
  INSPECTION_STEADY,
  INSPECTION_READY,
  INSPECTION,
} from './timerState';
import './Timer.css';

type Props = {
  timerState: TimerState;
} & HTMLAttributes<HTMLDivElement>;

const TapTimerRaw: VFC<PropsWithChildren<Props>> = ({
  timerState,
  className = '',
  children,
  ...props
}) => (
  <div
    className={clsx(
      timerState === STEADY || timerState === INSPECTION_STEADY
        ? 'steady'
        : timerState === READY || timerState === INSPECTION_READY
        ? 'ready'
        : timerState === WORKING ||
          timerState === IDOLING ||
          timerState === INSPECTION
        ? 'timer'
        : exhaustiveCheck(timerState),
      className
    )}
    {...props}
  >
    {children}
  </div>
);
export const TapTimer = memo(TapTimerRaw);
