import {
  Average,
  DNF,
  SessionCollection,
  TimeData,
} from '../components/Timer/timeData';
import { calcAo } from '../utils/calcAo';
import { calcAverage } from '../utils/calcAverage';
import { calcRecord } from '../utils/calcRecord';
import { calcStandardDeviation } from '../utils/calcStandardDeviation';
import { findIndexOfMin } from '../utils/findIndexOfMin';

type SessionAverage = {
  ao5?: Average;
  ao12?: Average;
  ao25?: Average;
  ao50?: Average;
  ao100?: Average;
  average: number | null;
  ao5List: Average[];
  ao12List: Average[];
  standardDeviation: number | null;
  name: string;
};
export type WorkerResult = {
  [variation in string]?: {
    best?: number;
    bestAo5?: Average;
    bestAo12?: Average;
    bestAo25?: Average;
    bestAo50?: Average;
    bestAo100?: Average;
    average?: Average;
    sessionAverage: SessionAverage[];
  };
};
const calcSessionAverage = (
  sessionCollection: SessionCollection
): {
  [variationName in string]: SessionAverage[];
} => {
  const sessionAverage: {
    [variationName in string]: SessionAverage[];
  } = {};

  const calcBestAverage: (...args: Parameters<typeof calcAo>) => Average = (
    n,
    times
  ) => {
    const average = calcAo(n, times).filter(
      <T>(x: T): x is Exclude<T, null> => x !== null
    );
    if (average.length === 0) {
      return null;
    }
    const avgOnlyNumber = average.filter(
      (x): x is number => typeof x === 'number'
    );
    if (avgOnlyNumber.length === 0) {
      return DNF;
    }
    return avgOnlyNumber[findIndexOfMin(avgOnlyNumber)];
  };
  for (const { variation, sessions } of sessionCollection) {
    sessionAverage[variation.name] = sessions.map(({ times, name }) => {
      const timesExcludingDNF = times
        .map(calcRecord)
        .filter((x): x is Exclude<typeof x, typeof DNF> => x !== DNF);
      const res: SessionAverage = {
        name,
        average:
          timesExcludingDNF.length === 0
            ? null
            : calcAverage(timesExcludingDNF),
        standardDeviation:
          timesExcludingDNF.length === 0
            ? null
            : calcStandardDeviation(timesExcludingDNF),
        ao5List: calcAo(5, times),
        ao12List: calcAo(12, times),
      };
      if (times.length >= 5) res.ao5 = calcBestAverage(5, times);
      if (times.length >= 12) res.ao12 = calcBestAverage(12, times);
      if (times.length >= 25) res.ao25 = calcBestAverage(25, times);
      if (times.length >= 50) res.ao50 = calcBestAverage(50, times);
      if (times.length >= 100) res.ao100 = calcBestAverage(100, times);
      return res;
    });
  }
  return sessionAverage;
};

declare const self: DedicatedWorkerGlobalScope;
self.addEventListener(
  'message',
  ({ data }) => {
    const sessions: SessionCollection = data;
    const sessionAverage = calcSessionAverage(sessions);

    const calcBestAo: (
      ...args: Parameters<typeof calcAo>
    ) => Average | undefined = (n, times) => {
      const sortedAo = calcAo(n, times)
        .filter(
          (x): x is Exclude<typeof x, null | typeof DNF> =>
            x !== DNF && x !== null
        )
        .sort((a, b) => a - b);
      return sortedAo.length > 0 ? sortedAo[0] : undefined;
    };
    const message: WorkerResult = {};
    for (const { variation, sessions: session } of sessions) {
      const allSessionTime = session.reduce<TimeData[]>(
        (acc, item) => [...acc, ...item.times],
        []
      );
      const timesExcludingDNF = allSessionTime
        .map(calcRecord)
        .filter((x): x is Exclude<typeof x, typeof DNF> => x !== DNF);
      const averageOfAllSessions =
        timesExcludingDNF.length > 0 ? calcAverage(timesExcludingDNF) : null;

      message[variation.name] = {
        best: timesExcludingDNF.concat().sort((a, b) => a - b)[0],
        bestAo5: calcBestAo(5, allSessionTime),
        bestAo12: calcBestAo(12, allSessionTime),
        bestAo25: calcBestAo(25, allSessionTime),
        bestAo50: calcBestAo(50, allSessionTime),
        bestAo100: calcBestAo(100, allSessionTime),
        average: averageOfAllSessions,
        sessionAverage: sessionAverage[variation.name],
      };
    }

    self.postMessage(message);
  },
  false
);
