import { createContext } from 'react';
import { useStoragedState } from './useLocalStorage';

const CHECKED_STORE = 'OLL_RANDOM_CHECKED' as const;
interface CheckList {
  checkList: boolean[];
  check: (index: number) => void;
  reset: () => void;
}
export const CheckContext = createContext<CheckList>({} as CheckList);

export const useCheck = (size = 57): CheckList => {
  const [checkList, setCheckList] = useStoragedState<boolean[]>(
    CHECKED_STORE,
    () => Array(size).fill(false)
  );

  const check = (index: number) => {
    setCheckList(Object.assign([], checkList, { [index]: !checkList[index] }));
  };
  return {
    checkList,
    check,
    reset: () => {
      setCheckList(Array(size).fill(false));
    },
  };
};
