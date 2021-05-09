import { TimeData } from '../../components/Timer/timeData';
import { useLocalStorage } from './useLocalStorage';
import { storagePrefix } from '../../constants';
import { useCallback } from 'react';

export const useTimes = (initialTimes: TimeData[] = []) => {
  const [times, setTimes] = useLocalStorage(
    `${storagePrefix}-times`,
    initialTimes
  );
  const updateItem = (
    index: number,
    convert: (prevValue: TimeData) => TimeData
  ) => (times: TimeData[]) => [
    ...times.slice(0, index),
    convert(times[index]),
    ...times.slice(index + 1),
  ];

  const changeToDNF = useCallback(
    (index: number) => {
      setTimes(updateItem(index, (prev) => ({ ...prev, isDNF: true })));
    },
    [setTimes]
  );
  const undoDNF = useCallback(
    (index: number) => {
      setTimes(updateItem(index, (prev) => ({ ...prev, isDNF: false })));
    },
    [setTimes]
  );
  const imposePenalty = useCallback(
    (index: number) => {
      setTimes(updateItem(index, (prev) => ({ ...prev, penalty: true })));
    },
    [setTimes]
  );
  const undoPenalty = useCallback(
    (index: number) => {
      setTimes(updateItem(index, (prev) => ({ ...prev, penalty: false })));
    },
    [setTimes]
  );
  const deleteRecord = useCallback(
    (index: number) => {
      setTimes((times) => [
        ...times.slice(0, index),
        ...times.slice(index + 1),
      ]);
      return times[index];
    },
    [times, setTimes]
  );
  const insertRecord = (index: number, record: TimeData) => {
    setTimes((times) => [
      ...times.slice(0, index),
      record,
      ...times.slice(index),
    ]);
  };
  const addTime = (time: TimeData) => {
    setTimes((times) => [...times, time]);
  };
  return {
    times,
    changeToDNF,
    undoDNF,
    imposePenalty,
    undoPenalty,
    deleteRecord,
    insertRecord,
    addTime,
  } as const;
};
