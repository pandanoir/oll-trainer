/**
 * +2 の状態で DNF を押して undo した際に情報が失われないようにpenalty と isDNF は分けて管理する
 */
export type TimeData = {
  time: number;
  penalty?: boolean;
  isDNF?: boolean;
  scramble: string;
};
export const DNF = 'dnf';
