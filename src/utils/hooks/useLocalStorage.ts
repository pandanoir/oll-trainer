import { useCallback, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import { produce } from 'immer';
const stateInitializer =
  <T>(storageKey: string, initialValue: T | (() => T)) =>
  () => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch {}
    return initialValue instanceof Function ? initialValue() : initialValue;
  };
export const useStoragedState = <T>(
  storageKey: string,
  initialValue: T | (() => T)
) => {
  const [state, setStateRaw] = useState<T>(
    stateInitializer(storageKey, initialValue)
  );
  const stateRef = useRef(state);
  const setState: typeof setStateRaw = useCallback(
    (action) => {
      const newValue =
        action instanceof Function ? action(stateRef.current) : action;
      stateRef.current = newValue;
      setStateRaw(newValue);
      localStorage.setItem(storageKey, JSON.stringify(newValue));
    },
    [storageKey]
  );
  return [state, setState] as const;
};

export const useStoragedImmerState = <T>(
  storageKey: string,
  initialValue: T | (() => T)
) => {
  const [state, updateStateRaw] = useImmer<T>(
    stateInitializer(storageKey, initialValue)
  );
  const stateRef = useRef(state);
  const setState: typeof updateStateRaw = useCallback(
    (action) => {
      const newValue =
        action instanceof Function ? produce(stateRef.current, action) : action;
      stateRef.current = newValue;
      updateStateRaw(newValue);
      localStorage.setItem(storageKey, JSON.stringify(newValue));
    },
    [updateStateRaw, storageKey]
  );
  return [state, setState] as const;
};
