import { SessionData, TimeData } from '../../components/Timer/timeData';
import { useStoragedImmerState, useStoragedState } from './useLocalStorage';
import { storagePrefix } from '../../constants';
import { useCallback, useEffect } from 'react';
import { zerofill } from '../zerofill';

const today = new Date();
export const useSessions = (
  initialSessions: SessionData[] = [
    {
      times: [],
      name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
        today.getDate(),
        2
      )} session1`,
    },
  ]
) => {
  const [sessions, updateSessions] = useStoragedImmerState(
    `${storagePrefix}-sessions`,
    initialSessions
  );
  useEffect(() => {
    // 最低1セッション以上を確保する
    // これ、あとで整合性とるの大変そうだな…
    if (sessions.length === 0) {
      updateSessions([
        {
          times: [],
          name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
            today.getDate(),
            2
          )} session1`,
        },
      ]);
    }
  }, [sessions, updateSessions]);
  const [sessionIndex, setSessionIndex] = useStoragedState(
    `${storagePrefix}-sessionIndex`,
    0
  );

  const changeSessionName = useCallback(
    (name: string): void =>
      updateSessions((draft) => {
        draft[sessionIndex].name = name;
      }),
    [updateSessions, sessionIndex]
  );
  const changeToDNF = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        draft[sessionIndex].times[index].isDNF = true;
      }),
    [updateSessions, sessionIndex]
  );
  const undoDNF = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        draft[sessionIndex].times[index].isDNF = false;
      }),
    [updateSessions, sessionIndex]
  );
  const imposePenalty = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        draft[sessionIndex].times[index].penalty = true;
      }),
    [updateSessions, sessionIndex]
  );
  const undoPenalty = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        draft[sessionIndex].times[index].penalty = false;
      }),
    [updateSessions, sessionIndex]
  );
  const deleteRecord = useCallback(
    (index: number): TimeData => {
      updateSessions((draft) => {
        draft[sessionIndex].times.splice(index, 1);
      });
      return sessions[sessionIndex].times[index];
    },
    [sessionIndex, sessions, updateSessions]
  );
  const insertRecord = useCallback(
    (index: number, record: TimeData) => {
      updateSessions((draft) => {
        draft[sessionIndex].times.splice(index, 0, record);
      });
    },
    [sessionIndex, updateSessions]
  );
  const addTime = useCallback(
    (time: TimeData) => {
      updateSessions((draft) => {
        draft[sessionIndex].times.push(time);
      });
    },
    [sessionIndex, updateSessions]
  );
  const addSession = useCallback(() => {
    const today = new Date();
    updateSessions((draft) => {
      draft.push({
        times: [],
        name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
          today.getDate(),
          2
        )} session${draft.length + 1}`,
      });
    });
  }, [updateSessions]);
  const deleteSession = useCallback(
    (index: number) => {
      updateSessions((draft) => {
        draft.splice(index, 1);
      });
      if (sessions.length === 1) {
        addSession();
      } else if (sessionIndex === sessions.length - 1) {
        setSessionIndex(sessionIndex - 1);
      }
    },
    [addSession, sessionIndex, sessions.length, setSessionIndex, updateSessions]
  );
  const importFromCsTimer = (data: SessionData[]) => {
    updateSessions(data);
  };
  return {
    sessions,
    sessionIndex,
    setSessionIndex,
    changeSessionName,
    importFromCsTimer,
    changeToDNF,
    undoDNF,
    imposePenalty,
    undoPenalty,
    deleteRecord,
    insertRecord,
    addTime,
    addSession,
    deleteSession,
  } as const;
};
