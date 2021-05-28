import { useEffect, useRef } from 'react';

export const usePreventDefault = <T extends HTMLElement>(
  eventName: string,
  enable = true
) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }
    const handler = (event: Event) => {
      if (enable) {
        event.preventDefault();
      }
    };
    current.addEventListener(eventName, handler);
    return () => {
      current.removeEventListener(eventName, handler);
    };
  }, [enable, eventName]);

  return ref;
};
