import { SessionCollection, TimeData } from '../../components/Timer/timeData';
import { useVersionedImmerState, useStoragedState } from './useLocalStorage';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { zerofill } from '../zerofill';
import { withPrefix } from '../withPrefix';
import { isUnknownObject } from '../isUnknownObject';
import { defaultVariation, Variation } from '../../data/variations';

const version = 2;
const getDefaultSessionCollection = (): SessionCollection => {
  const today = new Date();
  return [
    {
      variation: defaultVariation,
      sessions: [
        {
          times: [],
          name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
            today.getDate(),
            2
          )} session1`,
        },
      ],
      selectedSessionIndex: 0,
    },
  ];
};
export const migration = (
  old: unknown
): {
  data: SessionCollection;
  version: number;
} => {
  if (!isUnknownObject(old)) {
    return { data: getDefaultSessionCollection(), version };
  }
  if (!('version' in old)) {
    // 一番最初のバージョン
    // { times: TimeData[]; name: string; }[]
    return migration({
      data: [
        {
          variation: defaultVariation,
          sessions: old,
          selectedSessionIndex: (() => {
            try {
              const json = localStorage.getItem(withPrefix('sessionIndex'));
              if (!json) return 0;
              return JSON.parse(json);
            } catch {
              return 0;
            }
          })(),
        },
      ],
      version: 2,
    });
  }
  if (old.version === version) {
    return old as {
      data: SessionCollection;
      version: number;
    }; // ホントは検証しないといけないけど、まあよいでしょう…
  }
  throw new Error('unexpected version');
};
export const useSessions = (
  initialSessions = getDefaultSessionCollection()
) => {
  const [sessions, updateSessions] = useVersionedImmerState(
    withPrefix('sessions'),
    initialSessions,
    version,
    migration
  );

  const [variation, setVariation] = useStoragedState<string>(
    withPrefix('variation'),
    defaultVariation.name
  );
  const findCurrentSession = useCallback(
    (data: SessionCollection) => {
      for (const val of data) {
        if (val.variation.name === variation) {
          if (val.selectedSessionIndex >= val.sessions.length) {
            return val.sessions[0];
          }
          return val.sessions[val.selectedSessionIndex];
        }
      }
      throw new Error('unexpected error');
    },
    [variation]
  );
  const findCurrentSessionCollection = useCallback(
    (data: SessionCollection) => {
      for (const val of data) {
        if (val.variation.name === variation) {
          return val;
        }
      }
      throw new Error('unexpected error');
    },
    [variation]
  );

  const changeSessionName = useCallback(
    (name: string): void =>
      updateSessions((draft) => {
        findCurrentSession(draft).name = name;
      }),
    [updateSessions, findCurrentSession]
  );
  const changeToDNF = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        const time = findCurrentSession(draft).times[index];
        if (time) {
          time.isDNF = true;
        }
      }),
    [updateSessions, findCurrentSession]
  );
  const undoDNF = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        const time = findCurrentSession(draft).times[index];
        if (time) {
          time.isDNF = false;
        }
      }),
    [updateSessions, findCurrentSession]
  );
  const imposePenalty = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        const time = findCurrentSession(draft).times[index];
        if (time) {
          time.penalty = true;
        }
      }),
    [updateSessions, findCurrentSession]
  );
  const undoPenalty = useCallback(
    (index: number): void =>
      updateSessions((draft) => {
        const time = findCurrentSession(draft).times[index];
        if (time) {
          time.penalty = false;
        }
      }),
    [updateSessions, findCurrentSession]
  );
  const deleteRecord = useCallback(
    (index: number): TimeData => {
      const removedValue = findCurrentSession(sessions).times[index];
      if (!removedValue) {
        throw new Error('out of bounds');
      }
      updateSessions((draft) => {
        findCurrentSession(draft).times.splice(index, 1);
      });
      return removedValue;
    },
    [findCurrentSession, sessions, updateSessions]
  );
  const insertRecord = useCallback(
    (index: number, record: TimeData) => {
      updateSessions((draft) => {
        findCurrentSession(draft).times.splice(index, 0, record);
      });
    },
    [findCurrentSession, updateSessions]
  );
  const addTime = useCallback(
    (time: TimeData) => {
      updateSessions((draft) => {
        findCurrentSession(draft).times.push(time);
      });
    },
    [findCurrentSession, updateSessions]
  );
  const addSession = useCallback(() => {
    const today = new Date();
    updateSessions((draft) => {
      const { sessions } = findCurrentSessionCollection(draft);
      sessions.push({
        times: [],
        name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
          today.getDate(),
          2
        )} session${sessions.length + 1}`,
      });
    });
  }, [findCurrentSessionCollection, updateSessions]);
  const deleteSession = useCallback(
    (index: number) => {
      updateSessions((draft) => {
        findCurrentSessionCollection(draft).sessions.splice(index, 1);
      });
      const sessionCollection = findCurrentSessionCollection(sessions);
      if (sessionCollection.sessions.length === 1) {
        addSession();
      } else if (
        sessionCollection.selectedSessionIndex ===
        sessionCollection.sessions.length - 1
      ) {
        updateSessions((draft) => {
          findCurrentSessionCollection(draft).selectedSessionIndex -= 1;
        });
      }
    },
    [addSession, findCurrentSessionCollection, sessions, updateSessions]
  );
  const addSessionGroup = useCallback(
    (variation: Variation) => {
      const today = new Date();
      updateSessions((draft) => {
        if (draft.some(({ variation: { name } }) => variation.name === name)) {
          return;
        }
        draft.push({
          variation,
          sessions: [
            {
              times: [],
              name: `${zerofill(today.getMonth() + 1, 2)}-${zerofill(
                today.getDate(),
                2
              )} session1`,
            },
          ],
          selectedSessionIndex: 0,
        });
      });
    },
    [updateSessions]
  );
  const importFromCsTimer = (data: SessionCollection) => {
    updateSessions(data);
  };
  return {
    sessions,
    currentSessionCollection: useMemo(
      () => findCurrentSessionCollection(sessions),
      [findCurrentSessionCollection, sessions]
    ),
    variation,
    sessionIndex: useMemo(
      () => findCurrentSessionCollection(sessions).selectedSessionIndex,
      [findCurrentSessionCollection, sessions]
    ),
    setSessionIndex: useCallback<Dispatch<SetStateAction<number>>>(
      (action) =>
        updateSessions((draft) => {
          const sessionCollection = findCurrentSessionCollection(draft);
          if (typeof action === 'function') {
            sessionCollection.selectedSessionIndex = action(
              sessionCollection.selectedSessionIndex
            );
          } else {
            sessionCollection.selectedSessionIndex = action;
          }
        }),
      [findCurrentSessionCollection, updateSessions]
    ),
    setVariation,
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
    addSessionGroup,
  } as const;
};