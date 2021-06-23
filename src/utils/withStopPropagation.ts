import { EventHandler, SyntheticEvent } from 'react';

export const withStopPropagation =
  <T extends SyntheticEvent>(f: EventHandler<T>) =>
  (event: T) => {
    event.stopPropagation();
    f(event);
  };
