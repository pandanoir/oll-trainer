import { memo, MouseEvent, TouchEvent, VFC } from 'react';
import { usePreventDefault } from '../../../utils/hooks/usePreventDefault';
import { noop } from '../../../utils/noop';
import { withStopPropagation } from '../../../utils/withStopPropagation';
import 'twin.macro';

const TimerCoverRaw: VFC<{
  onPointerDown: (
    event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
  ) => void;
  onPointerUp: (
    event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
  ) => void;
  disabled?: boolean;
  transparent?: boolean;
  pressed: boolean;
}> = ({
  onPointerDown,
  onPointerUp,
  disabled = false,
  transparent = false,
  pressed,
}) => {
  return (
    <div
      onTouchStart={disabled ? undefined : withStopPropagation(onPointerDown)}
      onTouchMove={disabled ? undefined : withStopPropagation(noop)}
      onTouchEnd={disabled ? undefined : withStopPropagation(onPointerUp)}
      onMouseDown={disabled ? undefined : withStopPropagation(onPointerDown)}
      onMouseUp={disabled ? undefined : withStopPropagation(onPointerUp)}
      ref={usePreventDefault('touchstart', !disabled)}
      className={transparent ? 'cover-transparent' : 'cover'}
      tw="cursor-default!"
      role="button"
      aria-label="timer"
      aria-pressed={pressed}
    />
  );
};
export const TimerCover = memo(TimerCoverRaw);
