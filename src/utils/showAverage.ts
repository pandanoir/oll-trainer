import { showTime } from './showTime';
import { Average, DNF } from '../components/Timer/timeData';

export const showAverage = (avg: Average, defaultValue = '') => {
  if (avg === null) return defaultValue;
  if (avg === DNF) return 'DNF';
  return showTime(avg);
};
