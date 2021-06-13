import { toCsTimer } from './toCsTimer';

describe('toCsTimer', () => {
  it('', () => {
    expect(
      toCsTimer([
        {
          times: [
            {
              time: 100,
              penalty: false,
              isDNF: false,
              date: 1000,
              scramble: 'scramble1',
            },
            {
              time: 100,
              penalty: true,
              isDNF: false,
              date: 1000,
              scramble: 'scramble1',
            },
            {
              time: 100,
              penalty: false,
              isDNF: true,
              date: 1000,
              scramble: 'scramble1',
            },
            {
              time: 100,
              penalty: true,
              isDNF: true,
              date: 1000,
              scramble: 'scramble1',
            },
          ],
          name: 'session1',
        },
      ])
    ).toEqual({
      properties: {
        session: 1,
        sessionN: 1,
        sessionData: JSON.stringify({
          1: { name: 'session1', rank: 1, date: [1, 1] },
        }),
      },
      session1: [
        [[0, 100], 'scramble1', '', 1],
        [[2000, 100], 'scramble1', '', 1],
        [[-1, 100], 'scramble1', '', 1],
        [[-1, 100], 'scramble1', '', 1],
      ],
    });
  });
});
