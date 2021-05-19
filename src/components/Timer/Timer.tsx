import { VFC, PropsWithChildren, PointerEventHandler } from 'react';
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

export const Timer: VFC<
  PropsWithChildren<{
    timerState: TimerState;
    onPointerDown: PointerEventHandler<HTMLDivElement>;
    onPointerUp: PointerEventHandler<HTMLDivElement>;
  }>
> = ({ timerState, onPointerDown, onPointerUp, children }) => {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`${
        timerState === STEADY || timerState === INSPECTION_STEADY
          ? 'text-green-400'
          : timerState === READY || timerState === INSPECTION_READY
          ? 'text-red-500'
          : timerState === WORKING ||
            timerState === IDOLING ||
            timerState === INSPECTION
          ? 'text-blue-900'
          : exhaustiveCheck(timerState)
      } font-bold text-6xl select-none`}
    >
      {children}
    </div>
  );
};
