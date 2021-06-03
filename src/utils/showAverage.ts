import { showTime } from '../components/Timer/showTime';
import { Average, DNF } from '../components/Timer/timeData';

export const showAverage = (avg: Average) => {
  if (avg === null) return '';
  if (avg === DNF) return 'DNF';
  return showTime(avg);
};
