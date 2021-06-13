import { memo, VFC } from 'react';
import { usePreventDefault } from '../../utils/hooks/usePreventDefault';
import { noop } from '../../utils/noop';
import { withStopPropagation } from '../../utils/withStopPropagation';

const TimerCoverRaw: VFC<{
  onPointerDown: () => void;
  onPointerUp: () => void;
  onTouch: () => void;
  onLeave: () => void;
  disabled?: boolean;
  transparent?: boolean;
}> = ({
  onPointerDown,
  onPointerUp,
  onTouch,
  onLeave,
  disabled = false,
  transparent = false,
}) => (
  <div
    onTouchStart={(event) => {
      event.stopPropagation();
      onPointerDown();
      onTouch();
    }}
    onTouchMove={withStopPropagation(noop)}
    onTouchEnd={(event) => {
      event.stopPropagation();
      onLeave();
      onPointerUp();
    }}
    onMouseDown={(event) => {
      event.stopPropagation();
      onTouch();
      onPointerDown();
    }}
    onMouseUp={(event) => {
      event.stopPropagation();
      onLeave();
      onPointerUp();
    }}
    ref={usePreventDefault('touchstart', !disabled)}
    className={transparent ? 'cover-transparent' : 'cover'}
  />
);
export const TimerCover = memo(TimerCoverRaw);
