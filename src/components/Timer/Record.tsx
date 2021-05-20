import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { RecordListHeader } from './RecordListHeader';
import { TimeData, SessionData } from './timeData';
import { Times } from './Times';

export const Record = ({
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
  const [opensRecordList, setOpensRecordList] = useState(true);
  return (
    <div
      className={`${
        opensRecordList ? `h-32 md:h-64 overflow-y-scroll` : `h-6`
      } transition-all duration-300`}
      ref={recordListRef}
    >
      <RecordListHeader
        sessionIndex={sessionIndex}
        setSessionIndex={setSessionIndex}
        changeSessionName={changeSessionName}
        sessions={sessions}
        resetScroll={() => {
          if (recordListRef.current) {
            recordListRef.current.scrollTo(0, 0);
          }
        }}
        open={opensRecordList}
        onOpenButtonClick={() => setOpensRecordList((open) => !open)}
        addSession={() => {
          addSession();
          if (sessions.length - 1 === sessionIndex) {
            setSessionIndex(sessions.length);
          }
        }}
      />
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
  );
};
