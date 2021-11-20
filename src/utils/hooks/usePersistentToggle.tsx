import { useEffect } from 'react';
import { useLocalStorage, useToggle } from 'react-use';

export const usePersistentToggle = (key: string, init: boolean) => {
  const [savedValue, updateLocalStorage] = useLocalStorage(key, init);
  const [value, toggle] = useToggle(
    typeof savedValue === 'boolean' ? savedValue : init
  );
  useEffect(() => {
    updateLocalStorage(value);
  }, [updateLocalStorage, value]);
  return [value, toggle] as const;
};
