/** @see {isCsTimerSessionData} ts-auto-guard:type-guard */
export type CsTimerSessionData = {
  name: number | string;
  rank: number;
  date?: [number, number];
  opt: { scrType?: string };
};
