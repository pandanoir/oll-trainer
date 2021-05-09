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
export const DNF = 'dnf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUnknownObject = (item: any): item is Record<PropertyKey, unknown> => {
  return typeof item === 'object' && item !== null;
};
export const fromCsTimer = (json: unknown) => {
  if (!isUnknownObject(json)) {
    throw new Error('invalid JSON given');
  }
  return Object.keys(json).reduce((acc: TimeData[][], key) => {
    if (!key.startsWith('session')) {
      return acc;
    }
    const arr = json[key];
    if (!Array.isArray(arr)) {
      throw new Error('invalid JSON given');
    }
    return [
      ...acc,
      arr.map((item: unknown) => {
        if (!Array.isArray(item)) {
          throw new Error('invalid JSON given');
        }
        return {
          penalty: item[0][0] === 2000,
          isDNF: item[0][0] === -1,
          scramble: item[1],
          date: item[3],
          time: item[0][1],
        };
      }),
    ];
  }, []);
};
