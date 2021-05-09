import { TimeData } from '../../components/Timer/timeData';
import { useLocalStorage } from './useLocalStorage';
import { storagePrefix } from '../../constants';

export const useTimes = (initialTimes: TimeData[] = []) => {
  const [times, setTimes] = useLocalStorage(
    `${storagePrefix}-times`,
    initialTimes
  );
  const updateItem = (index: number, newItem: TimeData) => (
    times: TimeData[]
  ) => [...times.slice(0, index), newItem, ...times.slice(index + 1)];

  const changeToDNF = (index: number) => {
    setTimes(updateItem(index, { ...times[index], isDNF: true }));
  };
  const undoDNF = (index: number) => {
    setTimes(updateItem(index, { ...times[index], isDNF: false }));
  };
  const imposePenalty = (index: number) => {
    setTimes(updateItem(index, { ...times[index], penalty: true }));
  };
  const undoPenalty = (index: number) => {
    setTimes(updateItem(index, { ...times[index], penalty: false }));
  };
  const deleteRecord = (index: number) => {
    setTimes((times) => [...times.slice(0, index), ...times.slice(index + 1)]);
    return times[index];
  };
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
