import { FC } from 'react';
import { groups, solves, calculateScramble } from '../utils';
import { OLL } from '../oll';
import '../index.css';

interface Props {
  index: number;
}

const Left: FC = ({ children }) => {
  return <div className="grid grid-rows-3 justify-end gap-1">{children}</div>;
};
const Right: FC = ({ children }) => {
  return <div className="grid grid-rows-3 gap-1">{children}</div>;
};
const Top: FC = ({ children }) => {
  return <div className="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Bottom: FC = ({ children }) => {
  return <div className="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Empty: FC = () => <div />;
const Oll: FC<{ index: number }> = ({ index }) => {
  // if (!OLL[index]) return null;
  const cell = 'w-14 h-14 border border-gray-500';
  const sideCell = 'w-4 h-14 border border-gray-500';
  const bottomCell = 'w-14 h-4 border border-gray-500';
  const yellow = 'bg-yellow-200',
    gray = 'bg-gray-600';
  return (
    <div className="grid grid-cols-5 gap-0.5 max-w-max m-auto auto-cols-min">
      <Empty />
      <Top>
        {OLL[index][0].map((isPainted, index) => (
          <div
            key={index}
            className={`${bottomCell} mb-1 ${isPainted ? yellow : gray}`}
          />
        ))}
      </Top>
      <Empty />
      <Left>
        {[OLL[index][1][0], OLL[index][2][0], OLL[index][3][0]].map(
          (isPainted, index) => (
            <div
              key={index}
              className={`mr-1 ${sideCell} ${isPainted ? yellow : gray}`}
            />
          )
        )}
      </Left>
      <div className="grid grid-rows-3 col-span-3 gap-0.5">
        <div className="grid grid-cols-3 gap-0.5">
          {OLL[index][1].slice(1, 4).map((isPainted, index) => (
            <div
              key={index}
              className={`${cell} ${isPainted ? yellow : gray}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {OLL[index][2].slice(1, 4).map((isPainted, index) => (
            <div
              key={index}
              className={`${cell} ${isPainted ? yellow : gray}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {OLL[index][3].slice(1, 4).map((isPainted, index) => (
            <div
              key={index}
              className={`${cell} ${isPainted ? yellow : gray}`}
            />
          ))}
        </div>
      </div>
      <Right>
        {[OLL[index][1][4], OLL[index][2][4], OLL[index][3][4]].map(
          (isPainted, index) => (
            <div
              key={index}
              className={`ml-1 ${sideCell} ${isPainted ? yellow : gray}`}
            />
          )
        )}
      </Right>
      <Empty />
      <Bottom>
        {OLL[index][4].map((isPainted, index) => (
          <div
            key={index}
            className={`${bottomCell} mt-1 ${isPainted ? yellow : gray}`}
          />
        ))}
      </Bottom>
      <Empty />
    </div>
  );
};
export const Solve: FC<Props> = ({ index }) => {
  return (
    <>
      <Oll index={index} />
      <br />
      {Object.keys(groups).find((key) => groups[key].includes(index + 1))}
      <br />
      {solves[index].map((solve) => (
        <>
          solve:{solve}
          <br />
          scramble:{calculateScramble(solve)}
          <br />
          <a
            href={`http://algdb.net/puzzle/333/oll/oll${index + 1}`}
            className="underline text-blue-400"
            target="_blank"
          >
            AlgDb.net で他のやり方を調べる
          </a>
        </>
      ))}
    </>
  );
};
