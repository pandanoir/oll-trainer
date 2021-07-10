import { useState, useCallback, ChangeEvent } from 'react';

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
