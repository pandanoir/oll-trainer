import { TimeData } from '../components/Timer/timeData';
import { showTime } from './showTime';

export const showRecord = ({ isDNF, penalty, time }: TimeData) => {
  if (isDNF) {
    return 'DNF';
  }
  return `${showTime(time)}${penalty ? ' + 2' : ''}`;
};
