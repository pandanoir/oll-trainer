import { TimeData } from '../../components/Timer/timeData';
import { useLocalStorage } from './useLocalStorage';
import { storagePrefix } from '../../constants';

export const useTimes = (initialTimes: TimeData[] = []) => {
  const [times, setTimes] = useLocalStorage(
    `${storagePrefix}-times`,
    initialTimes
  );
  const changeToDNF = (index: number) => {
    setTimes((times) => [
      ...times.slice(0, index),
      { ...times[index], isDNF: true },
      ...times.slice(index + 1),
    ]);
  };
  const undoDNF = (index: number) => {
    setTimes((times) => [
      ...times.slice(0, index),
      { ...times[index], isDNF: false },
      ...times.slice(index + 1),
    ]);
  };
  const imposePenalty = (index: number) => {
    setTimes((times) => [
      ...times.slice(0, index),
      { ...times[index], penalty: true },
      ...times.slice(index + 1),
    ]);
  };
  const undoPenalty = (index: number) => {
    setTimes((times) => [
      ...times.slice(0, index),
      { ...times[index], penalty: false },
      ...times.slice(index + 1),
    ]);
  };
  const deleteRecord = (index: number) => {
    setTimes((times) => [...times.slice(0, index), ...times.slice(index + 1)]);
    return times[index];
  };
  const insertRecord = (index: number, record: TimeData) => {
    setTimes((times) => [
      ...times.slice(0, index),
      record,
      ...times.slice(index + 1),
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
