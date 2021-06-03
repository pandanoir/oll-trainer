import { PropsWithChildren, HTMLAttributes, forwardRef } from 'react';
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

export const Timer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    {
      timerState: TimerState;
    } & HTMLAttributes<HTMLDivElement>
  >
>(function Timer({ timerState, children, className = '', ...props }, ref) {
  return (
    <div
      className={`${
        timerState === STEADY || timerState === INSPECTION_STEADY
          ? 'steady'
          : timerState === READY || timerState === INSPECTION_READY
          ? 'ready'
          : timerState === WORKING ||
            timerState === IDOLING ||
            timerState === INSPECTION
          ? 'timer'
          : exhaustiveCheck(timerState)
      } ${className}`}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  );
});
