import { TouchEvent } from 'react';

// touchstart 時の要素(=target)と今タッチしている要素(=elementFromPoint)が同じかどうか
export const isAwayFromBeginningElement = ({
  target,
  changedTouches,
}: TouchEvent) => {
  return (
    target !==
    document.elementFromPoint(
      changedTouches[0].clientX,
      changedTouches[0].clientY
    )
  );
};
