import { createContext, useEffect, useState } from 'react';

const CHECKED_STORE = 'OLL_RANDOM_CHECKED' as const;
interface CheckList {
  checkList: boolean[];
  check: (index: number) => void;
  reset: () => void;
}
export const CheckContext = createContext<CheckList>({} as CheckList);

const useStorage = <T extends unknown>(
  key: string,
  value: T,
  setter: (arg: T) => void
) => {
  useEffect(() => {
    const json = localStorage.getItem(key);
    if (json !== null) {
      setter(JSON.parse(json));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
};
export const useCheck = (): CheckList => {
  const [checkList, setCheckList] = useState<boolean[]>(() =>
    Array(57).fill(false)
  );
  useStorage(CHECKED_STORE, checkList, setCheckList);

  const check = (index: number) => {
    setCheckList(Object.assign([], checkList, { [index]: !checkList[index] }));
  };
  return {
    checkList,
    check,
    reset: () => {
      setCheckList(Array(57).fill(false));
    },
  };
};
