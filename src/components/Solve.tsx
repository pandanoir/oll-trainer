import { VFC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { groups, solves, calculateScramble } from '../utils';
import { OLL } from '../oll';
import '../index.css';
import { RouteInfo } from '../route';
import { checkCpPattern, cpSwapPatterns } from '../utils/checkCpPattern';

interface Props {
  index: number;
}

type Empty = Record<PropertyKey, unknown>;
const Left: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div className="grid grid-rows-3 justify-end gap-1">{children}</div>;
};
const Right: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div className="grid grid-rows-3 gap-1">{children}</div>;
};
const Top: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div className="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Bottom: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div className="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Empty: VFC = () => <div />;
const Oll: VFC<{ index: number }> = ({ index }) => {
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
export const Solve: VFC<Props> = ({ index }) => {
  return (
    <div>
      <Oll index={index} />
      <br />
      {Object.keys(groups).find((key) => groups[key].includes(index + 1))}
      <br />
      {solves[index].map((solve) => {
        const cpPattern = checkCpPattern(solve);
        return (
          <div key={solve} className="my-3">
            <span className="text-sm">solve</span>: {solve}
            <br />
            <span className="text-sm">scramble</span>:{' '}
            {calculateScramble(solve)}
            <br />
            {cpPattern && (
              <>
                <span className="text-sm">CPパターン</span>: {cpPattern[0]}{' '}
                {cpSwapPatterns[cpPattern[1]]} &#9654;{' '}
                <Link
                  className="underline text-blue-400"
                  to={`${RouteInfo['cp check'].path}?solve=${encodeURIComponent(
                    solve
                  )}`}
                >
                  確認する
                </Link>
              </>
            )}
            <br />
          </div>
        );
      })}
    </div>
  );
};
