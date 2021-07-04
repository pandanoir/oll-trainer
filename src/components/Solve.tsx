import { VFC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';
import { OLL } from '../oll';
import { RouteInfo } from '../route';
import { groups, solves, calculateScramble } from '../utils';
import '../index.css';
import { checkCpPattern, cpSwapPatterns } from '../utils/checkCpPattern';

interface Props {
  index: number;
}

type Empty = Record<PropertyKey, unknown>;
const Left: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div tw="grid grid-rows-3 justify-end gap-1">{children}</div>;
};
const Right: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div tw="grid grid-rows-3 gap-1">{children}</div>;
};
const Top: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div tw="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Bottom: VFC<PropsWithChildren<Empty>> = ({ children }) => {
  return <div tw="grid grid-cols-3 col-span-3 gap-1">{children}</div>;
};
const Empty: VFC = () => <div />;
const Oll: VFC<{ index: number }> = ({ index }) => {
  // if (!OLL[index]) return null;
  const cell = tw`w-14 h-14 border border-gray-500`;
  const sideCell = tw`w-4 h-14 border border-gray-500`;
  const bottomCell = tw`w-14 h-4 border border-gray-500`;
  const yellow = tw`bg-yellow-200`,
    gray = tw`bg-gray-600`;
  return (
    <div tw="grid grid-cols-5 gap-0.5 max-w-max m-auto auto-cols-min">
      <Empty />
      <Top>
        {OLL[index][0].map((isPainted, index) => (
          <div
            key={index}
            css={[bottomCell, tw`mb-1`, isPainted ? yellow : gray]}
          />
        ))}
      </Top>
      <Empty />
      <Left>
        {[OLL[index][1][0], OLL[index][2][0], OLL[index][3][0]].map(
          (isPainted, index) => (
            <div
              key={index}
              css={[tw`mr-1`, sideCell, isPainted ? yellow : gray]}
            />
          )
        )}
      </Left>
      <div tw="grid grid-rows-3 col-span-3 gap-0.5">
        <div tw="grid grid-cols-3 gap-0.5">
          {OLL[index][1].slice(1, 4).map((isPainted, index) => (
            <div key={index} css={[cell, isPainted ? yellow : gray]} />
          ))}
        </div>
        <div tw="grid grid-cols-3 gap-0.5">
          {OLL[index][2].slice(1, 4).map((isPainted, index) => (
            <div key={index} css={[cell, isPainted ? yellow : gray]} />
          ))}
        </div>
        <div tw="grid grid-cols-3 gap-0.5">
          {OLL[index][3].slice(1, 4).map((isPainted, index) => (
            <div key={index} css={[cell, isPainted ? yellow : gray]} />
          ))}
        </div>
      </div>
      <Right>
        {[OLL[index][1][4], OLL[index][2][4], OLL[index][3][4]].map(
          (isPainted, index) => (
            <div
              key={index}
              css={[tw`ml-1`, sideCell, isPainted ? yellow : gray]}
            />
          )
        )}
      </Right>
      <Empty />
      <Bottom>
        {OLL[index][4].map((isPainted, index) => (
          <div
            key={index}
            css={[bottomCell, tw`mt-1`, isPainted ? yellow : gray]}
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
          <div key={solve} tw="my-3">
            <span tw="text-sm">solve</span>: {solve}
            <br />
            <span tw="text-sm">scramble</span>: {calculateScramble(solve)}
            <br />
            {cpPattern && (
              <>
                <span tw="text-sm">CPパターン</span>: {cpPattern[0]}{' '}
                {cpSwapPatterns[cpPattern[1]]} &#9654;{' '}
                <Link
                  tw="underline text-blue-400"
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
