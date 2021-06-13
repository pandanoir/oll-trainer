import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import {
  faAngleLeft,
  faAngleRight,
  faPlus,
  faChartBar,
  faAngleUp,
  faServer,
  faList,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import { calcAo } from '../../utils/calcAo';
import { TimeData, SessionData, DNF } from './timeData';
import { Times } from './Times';
import { TimeGraph } from './TimeGraph';
import { IconButton } from '../common/IconButton';
import { Modal, useModal } from '../common/Modal';
import { findIndexOfMin } from '../../utils/findIndexOfMin';
import { calcRecord } from '../../utils/calcRecord';
import { showTime } from '../../utils/showTime';
import { calcAverage } from '../../utils/calcAverage';
import { useStoragedState } from '../../utils/hooks/useLocalStorage';
import { withPrefix } from '../../utils/withPrefix';

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
  deleteSession,
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
  deleteSession: (index: number) => void;
}) => {
  const recordListRef = useRef<HTMLDivElement>(null);
  const [opensRecordList, setOpensRecordList] = useState(false);
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);

  const { showsModal, openModal, closeModal } = useModal();
  const [showsGraph, setShowsGraph] = useStoragedState(
    withPrefix('shows-graph'),
    false
  );

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
          {!showsGraph && (
            <IconButton
              css={[
                tw`fixed left-0 px-4 py-2 text-lg transition-all duration-300 z-10 bg-white dark:bg-gray-800`,
                opensRecordList
                  ? tw`opacity-100`
                  : tw`opacity-0 pointer-events-none`,
              ]}
              onClick={openModal}
              icon={faList}
            />
          )}
          <IconButton
            css={[
              tw`fixed right-0 px-4 py-2 text-lg transition-all duration-300 z-10 bg-white dark:bg-gray-800`,
              opensRecordList
                ? tw`opacity-100`
                : tw`opacity-0 pointer-events-none`,
            ]}
            onClick={() => setShowsGraph((v) => !v)}
            icon={showsGraph ? faServer : faChartBar}
          />
          {showsGraph ? (
            <TimeGraph
              times={times.map(({ time, isDNF, penalty }, index) => {
                const ao5 = ao5List[index],
                  ao12 = ao12List[index];
                return {
                  name: index + 1,
                  time: isDNF
                    ? null
                    : Math.floor(time) / 1000 + (penalty ? 2 : 0),
                  ao5: typeof ao5 === 'number' ? Math.floor(ao5) / 1000 : null,
                  ao12:
                    typeof ao12 === 'number' ? Math.floor(ao12) / 1000 : null,
                };
              })}
            />
          ) : (
            <div tw="pt-12">
              <Times
                times={times}
                changeToDNF={changeToDNF}
                imposePenalty={imposePenalty}
                undoDNF={undoDNF}
                undoPenalty={undoPenalty}
                deleteRecord={deleteRecord}
                insertRecord={insertRecord}
              />
            </div>
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
      {showsModal && (
        <Modal tw="lg:inset-x-1/4 lg:w-1/2" onClose={closeModal}>
          <div tw="flex flex-col px-3.5 py-5 gap-2 h-full">
            <div tw="flex gap-2">
              <span tw="text-3xl">Sessions</span>
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
            <ul tw="flex-1 overflow-y-auto">
              {sessions.map((session, index) => {
                const timesWithoutDNF = session.times
                  .map(calcRecord)
                  .filter((x): x is Exclude<typeof x, typeof DNF> => x !== DNF);

                const bestTime =
                  timesWithoutDNF.length > 0
                    ? showTime(timesWithoutDNF[findIndexOfMin(timesWithoutDNF)])
                    : '-';
                const averageTime =
                  timesWithoutDNF.length > 0
                    ? showTime(calcAverage(timesWithoutDNF))
                    : '-';
                return (
                  <li
                    tw="px-3 pb-1 pt-3 lg:mr-6 text-lg flex justify-between items-center border-b gap-3"
                    key={`${index}--${session.name}`}
                  >
                    <span
                      tw="flex-1 overflow-hidden whitespace-nowrap"
                      onClick={() => {
                        setSessionIndex(index);
                        closeModal();
                      }}
                    >
                      {session.name}
                    </span>
                    <span tw="grid grid-rows-3 md:flex md:gap-2 text-sm md:text-base">
                      <span>
                        {session.times.length} <span tw="text-sm">SOLVES</span>
                      </span>
                      <span>
                        <span tw="text-sm">BEST</span>:{' '}
                        <span tw="text-blue-600 dark:text-blue-400">
                          {bestTime}
                        </span>
                      </span>
                      <span>
                        <span tw="text-sm">AVG</span>:{' '}
                        <span tw="text-red-700 dark:text-red-500">
                          {averageTime}
                        </span>
                      </span>
                    </span>
                    <span>
                      <IconButton
                        icon={faTimes}
                        onClick={() =>
                          confirm(
                            `セッション ${session.name} を削除しますか?この操作は取り消せません`
                          ) && deleteSession(index)
                        }
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};
