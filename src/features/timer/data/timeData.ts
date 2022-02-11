import { Variation } from '../../../data/variations';

/**
 * +2 の状態で DNF を押して undo した際に情報が失われないようにpenalty と isDNF は分けて管理する
 */
export const DNF = '__dnf__';
export type TimeData = {
  time: number;
  penalty?: boolean;
  isDNF?: boolean;
  scramble: string;
  date: number; // millisec
};
export type Average = number | typeof DNF | null;
export type SessionData = {
  times: TimeData[];
  name: string;
  isLocked: boolean;
};

/** @see {isSessionCollection} ts-auto-guard:type-guard */
// 種目ごとにまとまったセッション version 3
export type SessionCollection = {
  sessions: SessionData[];
  selectedSessionIndex: number;
  variation: Variation;
}[];

// 種目ごとにまとまったセッション version 2
export type SessionCollectionV2 = {
  sessions: {
    times: {
      time: number;
      penalty?: boolean;
      isDNF?: boolean;
      scramble: string;
      date: number; // millisec
    }[];
    name: string;
  }[];
  selectedSessionIndex: number;
  variation: { name: string; scramble: '3x3' | '2x2' | '4x4' };
}[];
