import { Dispatch, SetStateAction, useCallback, useState } from 'react';

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
  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (action: SetStateAction<T>) => {
      const newValue = action instanceof Function ? action(state) : action;
      setStateRaw(newValue);
      localStorage.setItem(storageKey, JSON.stringify(newValue));
    },
    [storageKey, state]
  );
  return [state, setState] as const;
};
