import { showTime } from './showTime';
import { TimeData } from '../components/Timer/timeData';

export const showRecord = ({ isDNF, penalty, time }: TimeData) => {
  if (isDNF) {
    return 'DNF';
  }
  return `${showTime(time)}${penalty ? ' + 2' : ''}`;
};
