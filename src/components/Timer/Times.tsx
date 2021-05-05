import { VFC, PropsWithChildren, ButtonHTMLAttributes, useMemo } from 'react';
import { calcAo } from '../../utils/calcAo';
import { showTime } from './showTime';
import { TimeData, DNF } from './timeData';

const Button: VFC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`border border-gray-400 rounded-sm px-1 ${className}`}
    >
      {children}
    </button>
  );
};

const Record: VFC<{
  index: number;
  time: TimeData;
  changeToDNF: () => void;
  undoDNF: () => void;
  imposePenalty: () => void;
  undoPenalty: () => void;
}> = ({
  index,
  time: { time, penalty, isDNF },
  changeToDNF,
  undoDNF,
  imposePenalty,
  undoPenalty,
}) => {
  const record = isDNF
    ? 'DNF'
    : penalty
    ? `${showTime(time)} + 2`
    : showTime(time);

  return (
    <span>
      {index + 1}. {record}{' '}
      {isDNF ? (
        <span>
          <Button onClick={undoDNF}>undo DNF</Button>
        </span>
      ) : penalty ? (
        <span className="inline-grid gap-1 grid-cols-2">
          <Button onClick={undoPenalty}>-2</Button>
          <Button onClick={changeToDNF}>DNF</Button>
        </span>
      ) : (
        <span className="inline-grid gap-1 grid-cols-2">
          <Button onClick={imposePenalty}>+2</Button>
          <Button onClick={changeToDNF}>DNF</Button>
        </span>
      )}
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
    <ul>
      {times.map((time, index) => {
        const ao5 = ao5List[index];
        const ao12 = ao12List[index];
        return (
          <li key={index} className="grid grid-cols-3">
            <Record
              index={index}
              time={time}
              changeToDNF={() => changeToDNF(index)}
              undoDNF={() => undoDNF(index)}
              imposePenalty={() => imposePenalty(index)}
              undoPenalty={() => undoPenalty(index)}
            />
            {ao5 ? (
              ao5 === DNF ? (
                <span>DNF</span>
              ) : (
                <span>{showTime(ao5)}</span>
              )
            ) : (
              <span>-</span>
            )}
            {ao12 ? (
              ao12 === DNF ? (
                <span>DNF</span>
              ) : (
                <span>{showTime(ao12)}</span>
              )
            ) : (
              <span>-</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
