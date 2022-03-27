import {
  SessionData,
  SessionCollection,
} from '../features/timer/data/timeData';
import { isCsTimerSessionData } from '../types/CsTimerSessionData.guard';
import { isUnknownObject } from './isUnknownObject';

const excludeSessionData = (json: unknown) => {
  const PROPERTIES = 'properties',
    SESSION_DATA = 'sessionData';
  if (!isUnknownObject(json) || !(PROPERTIES in json)) return null;

  const properties = json[PROPERTIES];
  if (!isUnknownObject(properties) || !(SESSION_DATA in properties))
    return null;

  const sessionData = properties[SESSION_DATA];
  if (typeof sessionData !== 'string') return null;
  return sessionData;
};

export const fromCsTimer = (json: unknown): SessionCollection => {
  if (!isUnknownObject(json)) {
    throw new Error('invalid JSON given');
  }
  const sessionDataList = JSON.parse(
    ((x: string | null) => (x !== null ? x : 'null'))(excludeSessionData(json))
  );
  if (!isUnknownObject(sessionDataList)) {
    throw new Error('invalid JSON given');
  }
  const res: (SessionData & { scramble: string })[] = [];

  for (const key of Object.keys(json)) {
    if (!key.startsWith('session')) {
      continue;
    }
    const arr = json[key];
    if (!Array.isArray(arr)) {
      throw new Error('invalid JSON given');
    }

    const sessionData =
      sessionDataList[parseInt(key.replace(/^session/, ''), 10)];
    if (!isCsTimerSessionData(sessionData)) {
      throw new Error('invalid JSON given');
    }
    res[sessionData.rank - 1] = {
      times: arr.map((item: unknown) => {
        if (!Array.isArray(item)) {
          throw new Error('invalid JSON given');
        }
        return {
          penalty: item[0][0] === 2000,
          isDNF: item[0][0] === -1,
          scramble: item[1],
          date: item[3] * 1000,
          time: item[0][1],
        };
      }),
      name: `${sessionData.name}`,
      scramble:
        'scrType' in sessionData.opt
          ? (sessionData.opt.scrType as string)
          : 'default',
      isLocked: true,
    };
  }

  // {[scrambleName]: SessionData} という形で整理
  const sessionMap = res.reduce<Record<string, SessionData[] | undefined>>(
    (_acc, { scramble, ...item }) => {
      const { [scramble]: sessions = [], ...acc } = _acc;
      return {
        ...acc,
        [scramble]: sessions.concat(item),
      };
    },
    {}
  );

  return Object.keys(sessionMap).reduce<SessionCollection>((acc, key) => {
    const sessions = sessionMap[key];
    if (!sessions) return acc;

    return [
      ...acc,
      {
        sessions,
        variation: {
          name:
            key === '333oh' ? '3x3 OH' : key === '333ni' ? '3x3 BLD' : '3x3',
          scramble: '3x3',
        },
        selectedSessionIndex: 0,
      },
    ];
  }, []);
};
