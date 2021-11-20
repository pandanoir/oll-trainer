import { Variation } from '../../../data/variations';
/**
 * +2 の状態で DNF を押して undo した際に情報が失われないようにpenalty と isDNF は分けて管理する
 */
export declare const DNF = '__dnf__';
export declare type TimeData = {
  time: number;
  penalty?: boolean;
  isDNF?: boolean;
  scramble: string;
  date: number;
};
export declare type Average = number | typeof DNF | null;
export declare type SessionData = {
  times: TimeData[];
  name: string;
};
/** @see {isSessionCollection} ts-auto-guard:type-guard */
export declare type SessionCollection = {
  sessions: SessionData[];
  selectedSessionIndex: number;
  variation: Variation;
}[];
