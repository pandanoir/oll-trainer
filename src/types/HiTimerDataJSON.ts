import { Variation } from '../data/variations';
import { SessionCollection } from '../features/timer/data/timeData';

/** @see {isHiTimerDataJSON} ts-auto-guard:type-guard */
export interface HiTimerDataJSON {
  sessions: SessionCollection;
  settings: {
    variation: string;
    userDefinedVariation: Variation[];
  };
}
