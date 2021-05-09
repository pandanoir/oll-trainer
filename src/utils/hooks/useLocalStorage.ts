import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

export const useLocalStorage = <T>(
  storageKey: string,
  initialValue: T | (() => T)
) => {
  const [state, setStateRaw] = useState<T>(() => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch {}
    return initialValue instanceof Function ? initialValue() : initialValue;
  });
  const stateRef = useRef(state);
  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (action: SetStateAction<T>) => {
      const newValue =
        action instanceof Function ? action(stateRef.current) : action;
      stateRef.current = newValue;
      setStateRaw(action);
      localStorage.setItem(storageKey, JSON.stringify(newValue));
    },
    [storageKey]
  );
  return [state, setState] as const;
};
