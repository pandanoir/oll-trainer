import { Temporal } from '@js-temporal/polyfill';
import immer from 'immer';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import {
  atom,
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { defaultVariation, Variation } from '../../../data/variations';
import { isUnknownObject } from '../../../utils/isUnknownObject';
import { withPrefix } from '../../../utils/withPrefix';
import { zerofill } from '../../../utils/zerofill';
import {
  SessionCollection,
  SessionCollectionV2,
  TimeData,
} from '../../timer/data/timeData';

const version = 3;
const createNewSession = (num = 1) => {
  const today = Temporal.Now.zonedDateTimeISO();
  return {
    times: [],
    name: `${zerofill(today.month, 2)}-${zerofill(today.day, 2)} session${num}`,
    isLocked: false,
  };
};
const getDefaultSessionCollection = (): SessionCollection => {
  return [
    {
      variation: defaultVariation,
      sessions: [createNewSession()],
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
  if (old.version === 2) {
    // ver2
    // type SessionCollectionV2 = {
    //   sessions: {
    //     times: {
    //       time: number;
    //       penalty?: boolean;
    //       isDNF?: boolean;
    //       scramble: string;
    //       date: number; // millisec
    //     }[];
    //     name: string;
    //   }[];
    //   selectedSessionIndex: number;
    //   variation: { name: string; scramble: '3x3' | '2x2' | '4x4' };
    // }[];

    return migration({
      data: immer(old.data as unknown as SessionCollectionV2, (draft) => {
        for (const variation of draft) {
          for (const session of variation.sessions) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (session as unknown as any).isLocked = false;
          }
        }
      }),
      version: 3,
    });
  }
  if (old.version === version) {
    return old as {
      data: SessionCollection;
      version: number;
    }; // ホントは検証しないといけないけど、まあよいでしょう…
  }
  /* istanbul ignore next */
  throw new Error('unexpected version');
};

const sessionsAtom = atom<{ data: SessionCollection; version: number }>({
  key: withPrefix('sessions'),
  default: { data: getDefaultSessionCollection(), version },
  effects: [
    ({ setSelf, onSet }) => {
      const storageKey = withPrefix('sessions');
      const item = localStorage.getItem(storageKey);
      try {
        if (item !== null) {
          setSelf(migration(JSON.parse(item)));
        }
      } catch {}
      onSet((newValue) => {
        localStorage.setItem(storageKey, JSON.stringify(newValue));
      });
    },
  ],
});
const useSetSessionsAtom = (): SetterOrUpdater<SessionCollection> => {
  const setter = useSetRecoilState(sessionsAtom);
  return (value) => {
    setter(({ data }) => ({
      data: typeof value === 'function' ? value(data) : value,
      version,
    }));
  };
};

const variationNameAtom = atom<string>({
  key: withPrefix('variation'),
  default: defaultVariation.name,
  effects: [
    ({ setSelf, onSet }) => {
      const storageKey = withPrefix('variation');
      const item = localStorage.getItem(storageKey);
      try {
        if (item !== null) {
          setSelf(JSON.parse(item));
        }
      } catch {}
      onSet((newValue) => {
        localStorage.setItem(storageKey, JSON.stringify(newValue));
      });
    },
  ],
});
export const useVariationName = () => useRecoilValue(variationNameAtom);

const getCurrentSessionCollection = (
  data: SessionCollection,
  variationName: string
) => {
  for (const val of data) {
    if (val.variation.name !== variationName) {
      continue;
    }
    return val;
  }
  /* istanbul ignore next */
  throw new Error('unexpected error');
};

const getCurrentSession = (data: SessionCollection, variationName: string) => {
  for (const val of data) {
    if (val.variation.name !== variationName) {
      continue;
    }
    if (val.selectedSessionIndex >= val.sessions.length) {
      return val.sessions[0];
    }
    return val.sessions[val.selectedSessionIndex];
  }
  /* istanbul ignore next */
  throw new Error('unexpected error');
};
export const useChangeSessionName = () => {
  const setSessions = useSetSessionsAtom();
  const variationName = useRecoilValue(variationNameAtom);
  return (name: string): void => {
    setSessions(
      immer((draft) => {
        getCurrentSession(draft, variationName).name = name;
      })
    );
  };
};
export const useChangeToDNF = () => {
  const setSessions = useSetSessionsAtom();
  const variationName = useRecoilValue(variationNameAtom);
  return (index: number): void =>
    setSessions(
      immer((draft) => {
        const time = getCurrentSession(draft, variationName).times[index];
        if (time) {
          time.isDNF = true;
        }
      })
    );
};
export const useUndoDNF = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number): void =>
    setSessions(
      immer((draft) => {
        const time = getCurrentSession(draft, variationName).times[index];
        if (time) {
          time.isDNF = false;
        }
      })
    );
};
export const useImposePenalty = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number): void =>
    setSessions(
      immer((draft) => {
        const time = getCurrentSession(draft, variationName).times[index];
        if (time) {
          time.penalty = true;
        }
      })
    );
};
export const useUndoPenalty = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number): void =>
    setSessions(
      immer((draft) => {
        const time = getCurrentSession(draft, variationName).times[index];
        if (time) {
          time.penalty = false;
        }
      })
    );
};
export const useDeleteRecord = () => {
  const { data: sessions } = useRecoilValue(sessionsAtom),
    setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number): TimeData => {
    const removedValue = getCurrentSession(sessions, variationName).times[
      index
    ];
    if (!removedValue) {
      throw new Error('out of bounds');
    }
    setSessions(
      immer((draft) => {
        getCurrentSession(draft, variationName).times.splice(index, 1);
      })
    );
    return removedValue;
  };
};
export const useInsertRecord = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number, record: TimeData) => {
    setSessions(
      immer((draft) => {
        getCurrentSession(draft, variationName).times.splice(index, 0, record);
      })
    );
  };
};
export const useAddTime = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (time: TimeData) => {
    setSessions(
      immer((draft) => {
        getCurrentSession(draft, variationName).times.push(time);
      })
    );
  };
};
export const useAddSession = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return () => {
    setSessions(
      immer((draft) => {
        const { sessions } = getCurrentSessionCollection(draft, variationName);
        sessions.push(createNewSession(sessions.length + 1));
      })
    );
  };
};
export const useDeleteSession = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  const { data: sessions } = useRecoilValue(sessionsAtom);
  const addSession = useAddSession();
  return (index: number) => {
    setSessions(
      immer((draft) => {
        getCurrentSessionCollection(draft, variationName).sessions.splice(
          index,
          1
        );
      })
    );
    const sessionCollection = getCurrentSessionCollection(
      sessions,
      variationName
    );
    if (sessionCollection.sessions.length === 1) {
      addSession();
    } else if (
      sessionCollection.selectedSessionIndex ===
      sessionCollection.sessions.length - 1
    ) {
      setSessions(
        immer((draft) => {
          getCurrentSessionCollection(
            draft,
            variationName
          ).selectedSessionIndex -= 1;
        })
      );
    }
  };
};
export const useAddSessionGroup = () => {
  const setSessions = useSetSessionsAtom();
  return (variation: Variation) => {
    setSessions(
      immer((draft) => {
        if (draft.some(({ variation: { name } }) => variation.name === name)) {
          return;
        }
        draft.push({
          variation,
          sessions: [createNewSession()],
          selectedSessionIndex: 0,
        });
      })
    );
  };
};
export const useImportFromUserData = () => {
  const setSessions = useSetSessionsAtom();
  return (data: SessionCollection) => setSessions(data);
};
export const useDeleteAllSessionsByVariation = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  const setVariationName = useSetRecoilState(variationNameAtom);
  return (variation: Variation) => {
    setSessions(
      immer((draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (draft[i].variation.name === variation.name) {
            draft.splice(i, 1);
            return;
          }
        }
      })
    );
    if (variationName === variation.name) {
      setVariationName(defaultVariation.name);
    }
  };
};
export const useLockSession = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number) => {
    setSessions(
      immer((draft) => {
        getCurrentSessionCollection(draft, variationName).sessions[
          index
        ].isLocked = true;
      })
    );
  };
};
export const useUnlockSession = () => {
  const setSessions = useSetSessionsAtom(),
    variationName = useRecoilValue(variationNameAtom);
  return (index: number) => {
    setSessions(
      immer((draft) => {
        getCurrentSessionCollection(draft, variationName).sessions[
          index
        ].isLocked = false;
      })
    );
  };
};

export const useSessions = (): {
  readonly sessions: SessionCollection;
  readonly currentSessionCollection: {
    sessions: import('/home/pandanoir/Documents/docker/oll/src/features/timer/data/timeData').SessionData[];
    selectedSessionIndex: number;
    variation: Variation;
  };
  readonly variationName: string;
  readonly sessionIndex: number;
  readonly setSessionIndex: Dispatch<SetStateAction<number>>;
  readonly setVariation: (variation: Variation) => void;
  readonly changeSessionName: (name: string) => void;
  readonly importFromUserData: (data: SessionCollection) => void;
  readonly changeToDNF: (index: number) => void;
  readonly undoDNF: (index: number) => void;
  readonly imposePenalty: (index: number) => void;
  readonly undoPenalty: (index: number) => void;
  readonly deleteRecord: (index: number) => TimeData;
  readonly insertRecord: (index: number, record: TimeData) => void;
  readonly addTime: (time: TimeData) => void;
  readonly addSession: () => void;
  readonly deleteSession: (index: number) => void;
  readonly addSessionGroup: (variation: Variation) => void;
  readonly deleteAllSessionsByVariation: (variation: Variation) => void;
  readonly lockSession: (index: number) => void;
  readonly unlockSession: (index: number) => void;
} => {
  const { data: sessions } = useRecoilValue(sessionsAtom);
  const setSessions = useSetSessionsAtom();
  const [variationName, setVariationName] = useRecoilState(variationNameAtom);
  const setVariation = (variation: Variation) => {
    if (sessions.every(({ variation: { name } }) => name !== variation.name)) {
      addSessionGroup(variation);
    }
    setVariationName(variation.name);
  };

  const changeSessionName = useChangeSessionName();

  const changeToDNF = useChangeToDNF();
  const undoDNF = useUndoDNF();
  const imposePenalty = useImposePenalty();
  const undoPenalty = useUndoPenalty();
  const deleteRecord = useDeleteRecord();
  const insertRecord = useInsertRecord();
  const addTime = useAddTime();
  const addSession = useAddSession();
  const deleteSession = useDeleteSession();
  const addSessionGroup = useAddSessionGroup();
  const importFromUserData = useImportFromUserData();
  const deleteAllSessionsByVariation = useDeleteAllSessionsByVariation();
  const lockSession = useLockSession();
  const unlockSession = useUnlockSession();

  return {
    sessions,
    currentSessionCollection: useMemo(
      () => getCurrentSessionCollection(sessions, variationName),
      [sessions, variationName]
    ),
    variationName,
    sessionIndex: useMemo(
      () =>
        getCurrentSessionCollection(sessions, variationName)
          .selectedSessionIndex,
      [sessions, variationName]
    ),
    setSessionIndex: useCallback<Dispatch<SetStateAction<number>>>(
      (action) =>
        setSessions(
          immer((draft) => {
            const sessionCollection = getCurrentSessionCollection(
              draft,
              variationName
            );
            if (typeof action === 'function') {
              sessionCollection.selectedSessionIndex = action(
                sessionCollection.selectedSessionIndex
              );
            } else {
              sessionCollection.selectedSessionIndex = action;
            }
          })
        ),
      [setSessions, variationName]
    ),
    setVariation,
    changeSessionName,
    importFromUserData,
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
    deleteAllSessionsByVariation,
    lockSession,
    unlockSession,
  } as const;
};
