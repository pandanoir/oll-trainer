import { VFC, DetailedHTMLProps, HTMLAttributes } from 'react';
import { showTime } from './showTime';
import { TimeData } from './timeData';

export const Record: VFC<
  {
    record: TimeData;
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ record, ...props }) => {
  const timeStr = `${showTime(record.time)}${record.penalty ? ' + 2' : ''}`;
  return <div {...props}>{record.isDNF ? `DNF(${timeStr})` : timeStr}</div>;
};
