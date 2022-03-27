import { SessionCollection } from '../features/timer/data/timeData';
import { CsTimerSessionData } from '../types/CsTimerSessionData';
import { findIndexOfMax } from './findIndexOfMax';
import { findIndexOfMin } from './findIndexOfMin';

const toSessionData = (
  sessions: SessionCollection
): Record<number, CsTimerSessionData> => {
  let index = 0;
  return sessions
    .reduce<CsTimerSessionData[]>(
      (acc, { sessions, variation }) => [
        ...acc,
        ...sessions.reduce<CsTimerSessionData[]>((acc, { name, times }) => {
          index++;
          const dates = times.map(({ date }) => date);
          const minIndex = findIndexOfMin(dates),
            maxIndex = findIndexOfMax(dates);
          const opt: { scrType?: string } = {};

          if (variation.name === '3x3 OH') {
            opt.scrType = '333oh';
          }
          if (variation.name === '3x3 BLD') {
            opt.scrType = '333ni';
          }
          return [
            ...acc,
            {
              name,
              rank: index,
              ...(times.length > 0 && {
                date: [dates[minIndex] / 1000, dates[maxIndex] / 1000],
              }),
              opt,
            },
          ];
        }, []),
      ],
      []
    )
    .reduce((acc, item, index) => ({ ...acc, [index + 1]: item }), {});
};

export const toCsTimer = (sessionGroup: SessionCollection) => {
  const csTimerSessions: [
    readonly [0 | -1 | 2000, number],
    string,
    '',
    number
  ][][] = [];
  for (const { sessions } of sessionGroup) {
    for (const session of sessions) {
      csTimerSessions.push(
        session.times.map(({ penalty, isDNF, scramble, date, time }) => [
          [isDNF === true ? -1 : penalty === true ? 2000 : 0, time] as const,
          scramble,
          '',
          date / 1000,
        ])
      );
    }
  }

  return {
    ...csTimerSessions.reduce(
      (acc, item, index) => ({ ...acc, [`session${index + 1}`]: item }),
      {}
    ),
    properties: {
      sessionData: JSON.stringify(toSessionData(sessionGroup)),
      sessionN: csTimerSessions.length,
      session: csTimerSessions.length,
    },
  };
};
