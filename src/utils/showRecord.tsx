import { TimeData } from '../features/timer/data/timeData';
import { showTime } from './showTime';

export const showRecord = ({ isDNF, penalty, time }: TimeData) => {
  if (isDNF === true) {
    return 'DNF';
  }
  return `${showTime(time)}${penalty === true ? ' + 2' : ''}`;
};
