import { SyntheticEvent } from 'react';

export const withStopPropagation = (f: () => void) => (
  event: SyntheticEvent
) => {
  event.stopPropagation();
  f();
};
