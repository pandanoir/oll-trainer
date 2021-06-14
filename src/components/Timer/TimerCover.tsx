import { memo, VFC } from 'react';
import { usePreventDefault } from '../../utils/hooks/usePreventDefault';
import { noop } from '../../utils/noop';
import { withStopPropagation } from '../../utils/withStopPropagation';

const TimerCoverRaw: VFC<{
  onPointerDown: () => void;
  onPointerUp: () => void;
  disabled?: boolean;
  transparent?: boolean;
}> = ({
  onPointerDown,
  onPointerUp,
  disabled = false,
  transparent = false,
}) => (
  <div
    onTouchStart={withStopPropagation(onPointerDown)}
    onTouchMove={withStopPropagation(noop)}
    onTouchEnd={withStopPropagation(onPointerUp)}
    onMouseDown={withStopPropagation(onPointerDown)}
    onMouseUp={withStopPropagation(onPointerUp)}
    ref={usePreventDefault('touchstart', !disabled)}
    className={transparent ? 'cover-transparent' : 'cover'}
  />
);
export const TimerCover = memo(TimerCoverRaw);
