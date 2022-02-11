import clsx from 'clsx';
import { PropsWithChildren, HTMLAttributes, memo, VFC } from 'react';

import { exhaustiveCheck } from '../../../utils/exhaustiveCheck';
import {
  TimerState,
  STEADY,
  READY,
  WORKING,
  IDOLING,
  INSPECTION_STEADY,
  INSPECTION_READY,
  INSPECTION,
} from '../data/timerState';
import './Timer.css';

export const TapTimer: VFC<
  PropsWithChildren<
    {
      timerState: TimerState;
      disabled: boolean;
    } & HTMLAttributes<HTMLDivElement>
  >
> = ({ timerState, disabled, className = '', children, ...props }) => (
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
        : /* istanbul ignore next */
          exhaustiveCheck(timerState),
      disabled && 'disabled',
      className
    )}
    role="main"
    {...props}
  >
    {children}
  </div>
);
