import { memo, PropsWithChildren, VFC } from 'react';
import tw from 'twin.macro';

import { usePreventDefault } from '../../utils/hooks/usePreventDefault';
import { withStopPropagation } from '../../utils/withStopPropagation';

const TimerAreaRaw: VFC<
  PropsWithChildren<{
    onPointerDown: () => void;
    onPointerUp: () => void;
    disabled?: boolean;
    overlappingScreen: boolean;
  }>
> = ({
  onPointerDown,
  onPointerUp,
  disabled = false,
  overlappingScreen,
  children,
}) => (
  <div
    css={[
      tw`text-center flex-1 flex flex-col justify-center items-center select-none`,
      !overlappingScreen ? '' : tw`z-50`,
    ]}
    onTouchStart={(event) => {
      if (overlappingScreen) return;
      event.stopPropagation();
      onPointerDown();
    }}
    onTouchEnd={withStopPropagation(onPointerUp)}
    onMouseDown={(event) => {
      if (overlappingScreen) return;
      event.stopPropagation();
      onPointerDown();
    }}
    ref={usePreventDefault('touchstart', !disabled)}
  >
    {children}
  </div>
);
export const TimerArea = memo(TimerAreaRaw);
