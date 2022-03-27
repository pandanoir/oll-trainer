import { DNF, TimeData } from '../features/timer/data/timeData';

export const calcRecord = ({
  time,
  penalty,
  isDNF,
}: Pick<TimeData, 'time' | 'penalty' | 'isDNF'>): number | typeof DNF =>
  isDNF === true ? DNF : penalty === true ? time + 2000 : time;
