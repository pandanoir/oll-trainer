import { VFC, PropsWithChildren, ButtonHTMLAttributes, useMemo } from 'react';
import { calcAo } from '../../utils/calcAo';
import { showTime } from './showTime';
import { TimeData, DNF } from './timeData';

const SimpleRecord: VFC<{
  index: number;
  time: TimeData;
  onClick?: () => void;
}> = ({ index, time: { time, penalty, isDNF }, onClick }) => {
  const record = isDNF
    ? 'DNF'
    : penalty
    ? `${showTime(time)} + 2`
    : showTime(time);

  return (
    <span onClick={onClick} className="cursor-pointer">
      {index + 1}. {record}
    </span>
  );
};
export const Times: VFC<{
  times: TimeData[];
  changeToDNF: (index: number) => void;
  undoDNF: (index: number) => void;
  imposePenalty: (index: number) => void;
  undoPenalty: (index: number) => void;
}> = ({ times, changeToDNF, undoDNF, imposePenalty, undoPenalty }) => {
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);
  return (
    <ul className="flex flex-col-reverse">
      {times.map((time, index) => {
        const ao5 = ao5List[index];
        const ao12 = ao12List[index];
        return (
          <li key={time.date} className="grid grid-cols-3">
            <SimpleRecord
              index={index}
              time={time}
              onClick={() => {
                setSelectedIndex(index);
                openModal();
              }}
            />
            <span>{ao5 ? (ao5 === DNF ? 'DNF' : showTime(ao5)) : '-'}</span>
            <span>{ao12 ? (ao12 === DNF ? 'DNF' : showTime(ao12)) : '-'}</span>
          </li>
        );
      })}
    </ul>
  );
};
