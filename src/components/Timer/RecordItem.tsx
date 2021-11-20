import { VFC, DetailedHTMLProps, HTMLAttributes } from 'react';
import { TimeData } from '../../features/timer/data/timeData';
import { showTime } from '../../utils/showTime';

export const RecordItem: VFC<
  {
    record: TimeData;
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ record, ...props }) => {
  const timeStr = `${showTime(record.time)}${record.penalty ? ' + 2' : ''}`;
  return <div {...props}>{record.isDNF ? `DNF(${timeStr})` : timeStr}</div>;
};
