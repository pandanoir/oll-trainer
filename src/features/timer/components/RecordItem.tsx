import { VFC, DetailedHTMLProps, HTMLAttributes } from 'react';
import { showTime } from '../../../utils/showTime';
import { TimeData } from '../data/timeData';

export const RecordItem: VFC<
  {
    record: TimeData;
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ record, ...props }) => {
  const timeStr = `${showTime(record.time)}${record.penalty ? ' + 2' : ''}`;
  return <div {...props}>{record.isDNF ? `DNF(${timeStr})` : timeStr}</div>;
};
