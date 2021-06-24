import {
  Dispatch,
  lazy,
  SetStateAction,
  Suspense,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  faAngleLeft,
  faAngleRight,
  faPlus,
  faChartBar,
  faAngleUp,
  faServer,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';

import { calcAo } from '../../utils/calcAo';
import { TimeData, SessionCollection } from './timeData';
import { Times } from './Times';
const pick =
  <T extends unknown>(name: keyof T) =>
  (items: T) => ({
  default: items[name],
});
const TimeGraph = lazy(() => import('./TimeGraph').then(pick('TimeGraph')));

import { IconButton } from '../common/IconButton';
import { Modal, useModal } from '../common/Modal';
import { LoadingIndicator } from '../common/LoadingIndicator';

import { useStoragedState } from '../../utils/hooks/useLocalStorage';
import { withPrefix } from '../../utils/withPrefix';
import { SessionListItem } from './SessionListItem';
import { Variation } from '../../data/variations';

const Backdrop = tw.div`absolute z-10 w-full h-full bottom-0 flex flex-col bg-gray-300 bg-opacity-30 dark:bg-black dark:bg-opacity-50`;
const SessionToolbar = tw.div`w-full h-12 bg-white dark:bg-gray-800 flex justify-between z-10`;
const RecordListWrapper = tw.div`w-full relative bottom-0 flex flex-col z-10`;
const RecordList = tw.div`absolute bg-white dark:bg-gray-800 w-full max-h-1/2-screen h-96 mb-12`;

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
  currentVariation,
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
  sessions: SessionCollection;
  currentVariation: string;
  addSession: () => void;
  deleteSession: (index: number) => void;
}) => {
  const recordListRef = useRef<HTMLDivElement>(null);
  const [opensRecordList, setOpensRecordList] = useState(false);
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);
  const currentSessions = useMemo(() => {
    const currentSessions = sessions.find(
      ({ variation }) => variation.name === currentVariation
    );
    if (!currentSessions) {
      throw new Error('unexpected error');
    }
    return currentSessions.sessions;
  }, [currentVariation, sessions]);

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
  const next = () => {
    setSessionIndex((index) => index - 1);
    resetScroll();
  };
  const prev = () => {
    setSessionIndex((index) => index + 1);
    resetScroll();
  };
  return (
    <>
      {opensRecordList && (
        <Backdrop onClick={() => setOpensRecordList(false)} />
      )}

      <RecordListWrapper ref={recordListRef}>
        <RecordList
          css={[
            opensRecordList
              ? [tw`bottom-0 border-t-2 border-gray-200`]
              : tw`-bottom-96`,
            showsGraph ? '' : tw`overflow-x-hidden overflow-y-auto`,
            tw`transition-position duration-300`,
          ]}
        >
          {!showsGraph && (
            <IconButton
              icon={faList}
              tw="px-4 py-2 text-lg"
              onClick={openModal}
            />
          )}
          <IconButton
            icon={showsGraph ? faServer : faChartBar}
            tw="fixed right-0 px-4 py-2 text-lg z-10 bg-white dark:bg-gray-800"
            onClick={() => setShowsGraph((v) => !v)}
          />

          {showsGraph ? (
            <Suspense
              fallback={
                <div tw="w-full h-full text-4xl grid place-items-center">
                  <LoadingIndicator />
                </div>
              }
            >
              <TimeGraph
                times={times.map(({ time, isDNF, penalty }, index) => {
                  const ao5 = ao5List[index],
                    ao12 = ao12List[index];
                  return {
                    name: index + 1,
                    time: isDNF
                      ? null
                      : Math.floor(time) / 1000 + (penalty ? 2 : 0),
                    ao5:
                      typeof ao5 === 'number' ? Math.floor(ao5) / 1000 : null,
                    ao12:
                      typeof ao12 === 'number' ? Math.floor(ao12) / 1000 : null,
                  };
                })}
              />
            </Suspense>
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
        </RecordList>

        <SessionToolbar>
          <div tw="flex content-center">
            <IconButton
              css={[
                tw`px-4 py-2 text-lg`,
                sessionIndex <= 0 ? tw`text-gray-400` : '',
              ]}
              disabled={sessionIndex <= 0}
              onClick={next}
              icon={faAngleLeft}
            />
            <input
              value={currentSessions[sessionIndex].name}
              tw="w-36 bg-transparent"
              onChange={({ target: { value } }) => changeSessionName(value)}
            />
            <IconButton
              icon={faAngleRight}
              css={[
                tw`px-4 py-2 text-lg`,
                sessionIndex + 1 >= currentSessions.length
                  ? tw`text-gray-400`
                  : '',
              ]}
              disabled={sessionIndex + 1 >= currentSessions.length}
              onClick={prev}
            />
            <IconButton
              icon={faPlus}
              tw="px-2.5 my-1.5 text-lg text-white bg-gray-700 rounded"
              onClick={() => {
                addSession();
                if (sessionIndex === currentSessions.length - 1) {
                  setSessionIndex(currentSessions.length);
                }
              }}
            />
          </div>
          <div tw="flex content-center">
            <IconButton
              icon={faAngleUp}
              css={[
                tw`px-4 py-2 text-lg`,
                tw`transform transition-all duration-300`,
                opensRecordList ? tw`-rotate-180` : tw`rotate-0`,
              ]}
              onClick={() => setOpensRecordList((open) => !open)}
            />
          </div>
        </SessionToolbar>
      </RecordListWrapper>

      {showsModal && (
        <Modal tw="lg:inset-x-1/4 lg:w-1/2" onClose={closeModal}>
          <div tw="flex flex-col px-3.5 py-5 space-y-2 h-full">
            <div tw="flex space-x-2">
              <span tw="text-3xl">Sessions</span>
              <IconButton
                icon={faPlus}
                tw="px-2.5 my-1.5 text-lg text-white bg-gray-700 rounded"
                onClick={() => {
                  addSession();
                  if (sessionIndex === currentSessions.length - 1) {
                    setSessionIndex(currentSessions.length);
                  }
                }}
              />
            </div>
            <ul tw="flex-1 overflow-y-auto">
              {currentSessions.map((session, index) => (
                <SessionListItem
                  key={`${index}--${session.name}`}
                  session={session}
                  selected={sessionIndex === index}
                  onClick={() => {
                    setSessionIndex(index);
                    closeModal();
                  }}
                  onDeleteButtonClick={() =>
                    confirm(
                      `セッション ${session.name} を削除しますか?この操作は取り消せません`
                    ) && deleteSession(index)
                  }
                />
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};
