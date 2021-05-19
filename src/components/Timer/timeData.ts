/**
 * +2 の状態で DNF を押して undo した際に情報が失われないようにpenalty と isDNF は分けて管理する
 */
export type TimeData = {
  time: number;
  penalty?: boolean;
  isDNF?: boolean;
  scramble: string;
  date: number; // millisec
};
export type SessionData = {
  times: TimeData[];
  name: string;
};
export const DNF = 'dnf';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUnknownObject = (item: any): item is Record<PropertyKey, unknown> => {
  return typeof item === 'object' && item !== null;
};
export const fromCsTimer = (json: unknown): SessionData[] => {
  if (!isUnknownObject(json)) {
    throw new Error('invalid JSON given');
  }
  const sessionData = JSON.parse(excludeSessionData(json) || 'null');

  return Object.keys(json).reduce((acc: SessionData[], key): SessionData[] => {
    if (!key.startsWith('session')) {
      return acc;
    }
    const arr = json[key];
    if (!Array.isArray(arr)) {
      throw new Error('invalid JSON given');
    }
    const copied = acc.concat();

    copied[sessionData[key.replace(/^session/, '')].rank - 1] = {
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
      name: sessionData[key.replace(/^session/, '')].name,
    };
    return copied;
  }, []);
};
const toSessionData = (sessions: SessionData[]) =>
  sessions.reduce(
    (acc, { name, times }, index) => ({
      ...acc,
      [index + 1]: {
        name,
        rank: index + 1,
        ...(times.length > 0 && {
          date: [
            times.reduce((acc, { date }) => Math.min(acc, date), Infinity) /
              1000,
            times.reduce((acc, { date }) => Math.max(acc, date), -Infinity) /
              1000,
          ],
        }),
      },
    }),
    {}
  );
export const toCsTimer = (sessions: SessionData[]) => {
  console.log(sessions);
  return {
    ...sessions.reduce(
      (acc, session, index) => ({
        ...acc,
        [`session${
          index + 1
        }`]: session.times.map(({ penalty, isDNF, scramble, date, time }) => [
          [isDNF ? -1 : penalty ? 2000 : 0, time],
          scramble,
          '',
          date / 1000,
        ]),
      }),
      {}
    ),
    properties: {
      sessionData: JSON.stringify(toSessionData(sessions)),
      sessionN: sessions.length,
      session: sessions.length,
    },
  };
};
