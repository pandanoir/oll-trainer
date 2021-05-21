import { VFC, PropsWithChildren, HTMLAttributes } from 'react';
import tw from 'twin.macro';
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
  PropsWithChildren<
    {
      timerState: TimerState;
    } & HTMLAttributes<HTMLDivElement>
  >
> = ({ timerState, children, ...props }) => {
  return (
    <div
      css={[
        timerState === STEADY || timerState === INSPECTION_STEADY
          ? tw`text-green-400`
          : timerState === READY || timerState === INSPECTION_READY
          ? tw`text-red-500`
          : timerState === WORKING ||
            timerState === IDOLING ||
            timerState === INSPECTION
          ? tw`text-blue-900`
          : exhaustiveCheck(timerState),
        tw`font-bold text-6xl select-none`,
      ]}
      {...props}
    >
      {children}
    </div>
  );
};
