import {
  faAngleLeft,
  faAngleRight,
  faPlus,
  faChartLine,
  faAngleUp,
  faServer,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import {
  Dispatch,
  lazy,
  memo,
  ReactNode,
  SetStateAction,
  Suspense,
  useMemo,
  useRef,
  useState,
  VFC,
} from 'react';
import { useIntl } from 'react-intl';
import tw from 'twin.macro';

const pick =
  <T extends unknown>(name: keyof T) =>
  (items: T) => ({
    default: items[name],
  });
const TimeGraph = lazy(() => import('./TimeGraph').then(pick('TimeGraph')));

import { IconButton } from '../../../components/common/IconButton';
import { LoadingIndicator } from '../../../components/common/LoadingIndicator';
import { useModal } from '../../../components/common/Modal';
import { useStoragedState } from '../../../utils/hooks/useLocalStorage';
import { withPrefix } from '../../../utils/withPrefix';
import { TimeData, SessionCollection } from '../../timer/data/timeData';
import { SessionListItem } from './SessionListItem';
import { SessionListModal } from './SessionListModal';

const SESSION_LIST_MODAL = 'SESSION_LIST_MODAL';
type ModalType = typeof SESSION_LIST_MODAL;
const Backdrop = tw.div`absolute z-10 w-full h-full bottom-0 flex flex-col bg-gray-300 bg-opacity-30 dark:bg-black dark:bg-opacity-50`;
const SessionToolbar = tw.div`w-full h-12 bg-white dark:bg-gray-800 flex justify-between z-10`;
const RecordListWrapper = tw.div`w-full relative bottom-0 flex flex-col z-10`;
const RecordList = tw.div`absolute bg-white dark:bg-gray-800 w-full max-h-1/2-screen h-96 mb-12`;

interface Props {
  times: TimeData[];
  sessionIndex: number;
  setSessionIndex: Dispatch<SetStateAction<number>>;
  changeSessionName: (name: string) => void;
  sessions: SessionCollection;
  currentVariation: string;
  addSession: () => void;
  deleteSession: (index: number) => void;
  recordListComponent: ReactNode;
}
const SessionRaw: VFC<Props> = ({
  times,
  sessionIndex,
  setSessionIndex,
  changeSessionName,
  sessions,
  currentVariation,
  addSession,
  deleteSession,
  recordListComponent,
}) => {
  const { formatMessage } = useIntl();
  const recordListRef = useRef<HTMLDivElement>(null);
  const [opensRecordList, setOpensRecordList] = useState(false);

  const currentSessions = useMemo(() => {
    const currentSessions = sessions.find(
      ({ variation }) => variation.name === currentVariation
    );
    if (!currentSessions) {
      throw new Error('unexpected error');
    }
    return currentSessions.sessions;
  }, [currentVariation, sessions]);

  const { openModal, closeModal: closeModalRaw } = useModal();
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const closeModal = () => {
    setModalType(null);
    closeModalRaw();
  };
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
  const openSessionListModal = () => {
    setModalType(SESSION_LIST_MODAL);
    openModal();
  };
  const recordListId = 'record-list';
  return (
    <>
      {opensRecordList && (
        <Backdrop onClick={() => setOpensRecordList(false)} />
      )}

      <RecordListWrapper ref={recordListRef}>
        <RecordList
          id={recordListId}
          data-testid={recordListId}
          css={[
            opensRecordList
              ? [tw`bottom-0 border-t-2 border-gray-200`]
              : tw`-bottom-96`,
            showsGraph ? '' : tw`overflow-x-hidden overflow-y-auto`,
            tw`transition-position duration-300`,
          ]}
          aria-hidden={!opensRecordList}
        >
          {!showsGraph && (
            <div tw="fixed left-0 z-10 w-max bg-white dark:bg-gray-800">
              <IconButton
                icon={faList}
                title="session list"
                tw="px-4 py-2 text-lg"
                onClick={openSessionListModal}
              />
            </div>
          )}
          <IconButton
            icon={showsGraph ? faServer : faChartLine}
            title={showsGraph ? 'show record' : 'show graph'}
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
              <TimeGraph times={times} />
            </Suspense>
          ) : (
            recordListComponent
          )}
        </RecordList>

        <SessionToolbar>
          <div tw="flex content-center">
            <IconButton
              css={[
                tw`px-4 py-2 text-lg`,
                sessionIndex <= 0 ? tw`text-gray-400` : '',
              ]}
              title="prev session"
              disabled={sessionIndex <= 0}
              onClick={next}
              icon={faAngleLeft}
            />
            <input
              title="session name"
              value={currentSessions[sessionIndex].name}
              tw="w-36 bg-transparent"
              onChange={({ target: { value } }) => changeSessionName(value)}
            />
            <IconButton
              icon={faAngleRight}
              title="next session"
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
              title="add session"
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
              title={opensRecordList ? 'close record list' : 'open record list'}
              aria-expanded={opensRecordList}
              aria-controls={recordListId}
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

      {modalType === SESSION_LIST_MODAL ? (
        <SessionListModal
          onClose={closeModal}
          onAddButtonClick={() => {
            addSession();
            if (sessionIndex === currentSessions.length - 1) {
              setSessionIndex(currentSessions.length);
            }
          }}
          sessions={currentSessions.map((session, index) => (
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
                  formatMessage(
                    {
                      id: '4HvXVf',
                      description: 'アラート。セッション削除時に確認する',
                      defaultMessage: `セッション {session} を削除しますか?この操作は取り消せません`,
                    },
                    { session: session.name }
                  )
                ) && deleteSession(index)
              }
            />
          ))}
        />
      ) : null}
    </>
  );
};
export const Session = memo(SessionRaw);
