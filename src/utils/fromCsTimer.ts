import { SessionData } from '../components/Timer/timeData';
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
