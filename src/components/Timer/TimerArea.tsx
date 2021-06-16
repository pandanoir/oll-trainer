import { memo, PropsWithChildren, VFC } from 'react';
import tw from 'twin.macro';

import { usePreventDefault } from '../../utils/hooks/usePreventDefault';

const TimerAreaRaw: VFC<
  PropsWithChildren<{
    disabled?: boolean;
    overlappingScreen: boolean;
  }>
> = ({ disabled = false, overlappingScreen, children }) => (
  <div
    css={[
      tw`text-center flex-1 flex flex-col justify-center items-center select-none`,
      !overlappingScreen ? tw`relative overflow-hidden z-0` : tw`z-50`,
    ]}
    ref={usePreventDefault('touchstart', !disabled)}
  >
    {children}
  </div>
);
export const TimerArea = memo(TimerAreaRaw);
