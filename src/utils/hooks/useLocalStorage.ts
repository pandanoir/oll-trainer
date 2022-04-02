import { produce } from 'immer';
import { useCallback, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
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

// マイグレーションありのuseStoragedImmerState
export const useVersionedImmerState = <T>(
  storageKey: string,
  initialValue: T | (() => T),
  latestVersion: number,
  migrate: (old: unknown) => { data: T; version: number }
) => {
  const [state, updateStateRaw] = useImmer<T>(() => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item !== null) {
        return migrate(JSON.parse(item)).data;
      }
    } catch {}
    return initialValue instanceof Function ? initialValue() : initialValue;
  });
  const stateRef = useRef(state);
  const setState: typeof updateStateRaw = useCallback(
    (action) => {
      const newValue =
        action instanceof Function ? produce(stateRef.current, action) : action;
      stateRef.current = newValue;
      updateStateRaw(newValue);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ data: newValue, version: latestVersion })
      );
    },
    [updateStateRaw, storageKey, latestVersion]
  );
  return [state, setState] as const;
};

export const useStoragedImmerState = <T>(
  storageKey: string,
  initialValue: T | (() => T)
) =>
  useVersionedImmerState<T>(storageKey, initialValue, 0, (data) => {
    if (typeof data === 'object' && data !== null && 'version' in data) {
      return data as { data: T; version: 0 };
    }
    return {
      data: data as T,
      version: 0,
    };
  });
