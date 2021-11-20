import { Average, DNF } from '../features/timer/data/timeData';
import { showTime } from './showTime';

export const showAverage = (avg: Average, defaultValue = '') => {
  if (avg === null) return defaultValue;
  if (avg === DNF) return 'DNF';
  return showTime(avg);
};
