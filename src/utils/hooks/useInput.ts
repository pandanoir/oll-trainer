import { useState, useCallback, ChangeEvent } from 'react';
import { useStoragedState } from './useLocalStorage';

export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setValue(e.currentTarget.value),
    []
  );

  return {
    value,
    onChange,
  } as const;
};

export const useInputWithStorage = (key: string, initialValue = '') => {
  const [value, setValue] = useStoragedState(key, initialValue);

  const onChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setValue(e.currentTarget.value),
    [setValue]
  );

  return {
    value,
    onChange,
  } as const;
};
