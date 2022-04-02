import { Variation } from '../data/variations';
import {
  SessionCollection,
  SessionCollectionV2,
} from '../features/timer/data/timeData';

/** @see {isHiTimerDataJSONV1} ts-auto-guard:type-guard */
export interface HiTimerDataJSONV1 {
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
  settings: {
    variation: string;
    userDefinedVariation: Variation[];
  };
}
/** @see {isHiTimerDataJSONV2} ts-auto-guard:type-guard */
export interface HiTimerDataJSONV2 {
  sessions: SessionCollectionV2;
  settings: {
    variation: string;
    userDefinedVariation: Variation[];
  };
}
/** @see {isHiTimerDataJSON} ts-auto-guard:type-guard */
export interface HiTimerDataJSON {
  sessions: SessionCollection;
  settings: {
    variation: string;
    userDefinedVariation: Variation[];
  };
}
