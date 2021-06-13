import { SessionData } from '../components/Timer/timeData';

const toSessionData = (sessions: SessionData[]) =>
  sessions.reduce(
    (acc, { name, times }, index) => ({
      ...acc,
      [index + 1]: {
        name,
        rank: index + 1,
        ...(times.length > 0 && {
          date: [
            times.reduce((acc, { date }) => Math.min(acc, date), Infinity) /
              1000,
            times.reduce((acc, { date }) => Math.max(acc, date), -Infinity) /
              1000,
          ],
        }),
      },
    }),
    {}
  );
export const toCsTimer = (sessions: SessionData[]) => ({
  ...sessions.reduce(
    (acc, session, index) => ({
      ...acc,
      [`session${
        index + 1
      }`]: session.times.map(({ penalty, isDNF, scramble, date, time }) => [
        [isDNF ? -1 : penalty ? 2000 : 0, time],
        scramble,
        '',
        date / 1000,
      ]),
    }),
    {}
  ),
  properties: {
    sessionData: JSON.stringify(toSessionData(sessions)),
    sessionN: sessions.length,
    session: sessions.length,
  },
});
