import { PropsWithChildren, HTMLAttributes, forwardRef, memo } from 'react';
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
import { withStopPropagation } from '../../utils/withStopPropagation';
import { noop } from '../../utils/noop';

type Props = {
  timerState: TimerState;
  onPointerUp: () => void;
  onPointerDown: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onPointerUp' | 'onPointerDown'>;

const TapTimerRaw = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function Timer(
    {
      timerState,
      className = '',
      onPointerDown,
      onPointerUp,
      children,
      ...props
    },
    ref
  ) {
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
        onTouchStart={withStopPropagation(onPointerDown)}
        onTouchMove={withStopPropagation(noop)}
        onTouchEnd={withStopPropagation(onPointerUp)}
        onMouseDown={withStopPropagation(onPointerDown)}
        onMouseUp={withStopPropagation(onPointerUp)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
export const TapTimer = memo(TapTimerRaw);
