import { SessionCollection } from '../components/Timer/timeData';
import { Variation } from '../data/variations';

/** @see {isHiTimerDataJSON} ts-auto-guard:type-guard */
export interface HiTimerDataJSON {
  sessions: SessionCollection;
  settings: {
    variation: string;
    userDefinedVariation: Variation[];
  };
}
