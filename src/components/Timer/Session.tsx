import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import {
  faAngleLeft,
  faAngleRight,
  faPlus,
  faChartBar,
  faAngleUp,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import { calcAo } from '../../utils/calcAo';
import { TimeData, SessionData } from './timeData';
import { Times } from './Times';
import { TimeGraph } from './TimeGraph';
import { IconButton } from '../common/IconButton';

export const Session = ({
  times,
  changeToDNF,
  imposePenalty,
  undoDNF,
  undoPenalty,
  deleteRecord,
  insertRecord,

  sessionIndex,
  setSessionIndex,
  changeSessionName,
  sessions,
  addSession,
}: {
  times: TimeData[];
  changeToDNF: (index: number) => void;
  undoDNF: (index: number) => void;
  imposePenalty: (index: number) => void;
  undoPenalty: (index: number) => void;
  deleteRecord: (index: number) => TimeData;
  insertRecord: (index: number, record: TimeData) => void;

  sessionIndex: number;
  setSessionIndex: Dispatch<SetStateAction<number>>;
  changeSessionName: (name: string) => void;
  sessions: SessionData[];
  addSession: () => void;
}) => {
  const recordListRef = useRef<HTMLDivElement>(null);
  const [opensRecordList, setOpensRecordList] = useState(false);
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);

  const [showsGraph, setShowsGraph] = useState(false);

  const resetScroll = () => {
    if (recordListRef.current) {
      recordListRef.current.scrollTo(0, 0);
    }
  };
  return (
    <>
      {opensRecordList && (
        <div
          css={[
            tw`absolute w-full h-full z-30 bottom-0 flex flex-col bg-gray-300 bg-opacity-30 dark:bg-black dark:bg-opacity-50`,
          ]}
          ref={recordListRef}
          onClick={() => setOpensRecordList(false)}
        />
      )}
      <div
        css={[tw`w-full relative z-30 bottom-0 flex flex-col`]}
        ref={recordListRef}
      >
        <div
          css={[
            tw`absolute bg-white dark:bg-gray-800 w-full max-h-1/2-screen h-96 mb-12`,
            opensRecordList
              ? [tw`bottom-0 border-t-2 border-gray-200`]
              : tw`-bottom-96`,
            showsGraph ? '' : tw`overflow-x-hidden overflow-y-auto`,
            tw`transition-position duration-300`,
          ]}
        >
          {showsGraph ? (
            <TimeGraph
              times={times.map(({ time, isDNF, penalty }, index) => {
                const ao5 = ao5List[index],
                  ao12 = ao12List[index];
                return {
                  name: index + 1,
                  time: isDNF ? null : time / 1000 + (penalty ? 2 : 0),
                  ao5: typeof ao5 === 'number' ? ao5 / 1000 : null,
                  ao12: typeof ao12 === 'number' ? ao12 / 1000 : null,
                };
              })}
            />
          ) : (
            <Times
              times={times}
              changeToDNF={changeToDNF}
              imposePenalty={imposePenalty}
              undoDNF={undoDNF}
              undoPenalty={undoPenalty}
              deleteRecord={deleteRecord}
              insertRecord={insertRecord}
            />
          )}
        </div>
        <div tw="w-full h-12 bg-white dark:bg-gray-800 flex justify-between z-10">
          <div tw="flex content-center">
            <IconButton
              css={[
                tw`px-4 py-2 text-lg`,
                sessionIndex <= 0 ? tw`text-gray-400` : '',
              ]}
              disabled={sessionIndex <= 0}
              onClick={() => {
                setSessionIndex((index) => index - 1);
                resetScroll();
              }}
              icon={faAngleLeft}
            />
            <input
              value={sessions[sessionIndex].name}
              tw="w-36 bg-transparent"
              onChange={({ target: { value } }) => changeSessionName(value)}
            />
            <IconButton
              css={[
                tw`px-4 py-2 text-lg`,
                sessionIndex + 1 >= sessions.length ? tw`text-gray-400` : '',
              ]}
              disabled={sessionIndex + 1 >= sessions.length}
              onClick={() => {
                setSessionIndex((index) => index + 1);
                resetScroll();
              }}
              icon={faAngleRight}
            />
            <IconButton
              tw="px-2.5 my-1.5 text-lg text-white bg-gray-700 rounded"
              onClick={() => {
                addSession();
                if (sessionIndex === sessions.length - 1) {
                  setSessionIndex(sessions.length);
                }
              }}
              icon={faPlus}
            />
          </div>
          <div tw="flex content-center">
            <IconButton
              css={[
                tw`px-4 py-2 text-lg transition-all duration-300`,
                opensRecordList
                  ? tw`opacity-100`
                  : tw`opacity-0 pointer-events-none`,
              ]}
              onClick={() => setShowsGraph((v) => !v)}
              icon={showsGraph ? faServer : faChartBar}
            />
            <IconButton
              css={[
                tw`px-4 py-2 text-lg`,
                tw`transform transition-all duration-300`,
                opensRecordList ? tw`-rotate-180` : tw`rotate-0`,
              ]}
              onClick={() => setOpensRecordList((open) => !open)}
              icon={faAngleUp}
            />
          </div>
        </div>
      </div>
    </>
  );
};
