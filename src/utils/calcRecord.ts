import { DNF, TimeData } from '../components/Timer/timeData';

export const calcRecord = ({
  time,
  penalty,
  isDNF,
}: Pick<TimeData, 'time' | 'penalty' | 'isDNF'>): number | typeof DNF =>
  isDNF ? DNF : penalty ? time + 2000 : time;
