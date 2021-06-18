import { Touch } from 'react';
export const elementFromTouch = (touch: Touch) => {
  return document.elementFromPoint(touch.clientX, touch.clientY);
};
