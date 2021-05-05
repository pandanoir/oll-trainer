import { useState } from 'react';
import { TimeData } from '../../components/Timer/timeData';

export const useTimes = (initialTimes: TimeData[] = []) => {
  const [times, setTimes] = useState(initialTimes);
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
  const addTime = (time: TimeData) => {
    setTimes((times) => [...times, time]);
  };
  return {
    times,
    changeToDNF,
    undoDNF,
    imposePenalty,
    undoPenalty,
    addTime,
  } as const;
};
