import { Variation } from '../../data/variations';

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
};

// 種目ごとにまとまったセッション
export type SessionCollection = {
  sessions: SessionData[];
  selectedSessionIndex: number;
  variation: Variation;
}[];
