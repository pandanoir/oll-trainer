/*
 * Generated type guards for "timeData.ts".
 * WARNING: Do not manually change this file.
 */
import { SessionCollection } from '../../features/timer/data/timeData';

export function isSessionCollection(
  obj: any,
  _argumentName?: string
): obj is SessionCollection {
  return (
    Array.isArray(obj) &&
    obj.every(
      (e: any) =>
        ((e !== null && typeof e === 'object') || typeof e === 'function') &&
        Array.isArray(e.sessions) &&
        e.sessions.every(
          (e: any) =>
            ((e !== null && typeof e === 'object') ||
              typeof e === 'function') &&
            Array.isArray(e.times) &&
            e.times.every(
              (e: any) =>
                ((e !== null && typeof e === 'object') ||
                  typeof e === 'function') &&
                typeof e.time === 'number' &&
                (typeof e.penalty === 'undefined' ||
                  e.penalty === false ||
                  e.penalty === true) &&
                (typeof e.isDNF === 'undefined' ||
                  e.isDNF === false ||
                  e.isDNF === true) &&
                typeof e.scramble === 'string' &&
                typeof e.date === 'number'
            ) &&
            typeof e.name === 'string'
        ) &&
        typeof e.selectedSessionIndex === 'number' &&
        ((e.variation !== null && typeof e.variation === 'object') ||
          typeof e.variation === 'function') &&
        typeof e.variation.name === 'string' &&
        e.variation.scramble === '3x3'
    )
  );
}
