import { DNF, TimeData } from '../components/Timer/timeData';

export const calcRecord = ({
  time,
  penalty,
  isDNF,
}: TimeData): number | typeof DNF =>
  penalty ? time + 2000 : isDNF ? DNF : time;
