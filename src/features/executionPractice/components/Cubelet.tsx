import { forwardRef, ComponentProps } from 'react';
import tw, { styled } from 'twin.macro';

const BaseCubelet = tw.div`w-8 h-8 text-center align-top text-lg border-r border-b border-gray-800`;
const WhiteCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-gray-300 text-black` : tw`bg-gray-50 text-black`
);
const GreenCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-green-600 text-black` : tw`bg-green-500 text-black`
);
const RedCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-red-700` : tw`bg-red-600`
);
const BlueCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-blue-600` : tw`bg-blue-500`
);
const OrangeCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-orange-700` : tw`bg-orange-500`
);
const YellowCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-yellow-500 text-black` : tw`bg-yellow-300 text-black`
);

export const Cubelet = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof BaseCubelet> & {
    selected?: boolean;
    color: 'white' | 'green' | 'red' | 'blue' | 'orange' | 'yellow';
  }
>(function Cubelet({ color, ...props }, ref) {
  return color === 'white' ? (
    <WhiteCubelet {...props} ref={ref} />
  ) : color === 'green' ? (
    <GreenCubelet {...props} ref={ref} />
  ) : color === 'red' ? (
    <RedCubelet {...props} ref={ref} />
  ) : color === 'blue' ? (
    <BlueCubelet {...props} ref={ref} />
  ) : color === 'orange' ? (
    <OrangeCubelet {...props} ref={ref} />
  ) : color === 'yellow' ? (
    <YellowCubelet {...props} ref={ref} />
  ) : null;
});
