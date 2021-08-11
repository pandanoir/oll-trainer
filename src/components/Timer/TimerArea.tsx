import { memo, PropsWithChildren, ReactNode, VFC } from 'react';
import tw from 'twin.macro';

import { usePreventDefault } from '../../utils/hooks/usePreventDefault';

const TimerAreaRaw: VFC<
  PropsWithChildren<{
    disabled?: boolean;
    overlappingScreen: boolean;
    cover: ReactNode;
  }>
> = ({ disabled = false, overlappingScreen, cover, children }) => (
  <div
    css={[
      tw`text-center relative flex-1 flex flex-col justify-center items-center select-none`,
      !overlappingScreen ? tw`relative overflow-hidden z-0` : tw`z-50`,
    ]}
    ref={usePreventDefault('touchstart', !disabled)}
  >
    {cover}
    {children}
  </div>
);
export const TimerArea = memo(TimerAreaRaw);
