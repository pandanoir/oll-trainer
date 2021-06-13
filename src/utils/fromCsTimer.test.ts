import { fromCsTimer } from './fromCsTimer';

describe('fromCsTimer', () => {
  it('throws error if given argument is not object', () => {
    expect(() => fromCsTimer(3)).toThrow();
    expect(() => fromCsTimer('hoge')).toThrow();
    expect(() => fromCsTimer(null)).toThrow();
    expect(() => fromCsTimer({})).not.toThrow();
  });
  it('throws error if given object is invalid', () => {
    expect(() =>
      fromCsTimer({
        session1: [],
        properties: {
          sessionData2: '{}',
        },
      })
    ).toThrow();
    expect(() =>
      fromCsTimer({
        session1: [],
        properties: {
          sessionData: null,
        },
      })
    ).toThrow();
    expect(() =>
      fromCsTimer({
        session1: null,
        properties: {
          sessionData:
            '{"1":{"name":1,"opt":{},"rank":1,"stat":[3,1,1730],"date":[1623582797,1623582801]}}',
        },
      })
    ).toThrow();
    expect(() =>
      fromCsTimer({
        session1: [1],
        properties: {
          sessionData:
            '{"1":{"name":1,"opt":{},"rank":1,"stat":[3,1,1730],"date":[1623582797,1623582801]}}',
        },
      })
    ).toThrow();
  });
  it('converts data of csTimer for hi-timer', () => {
    const csTimerData = {
      session1: [
        [
          [0, 753],
          "F D2 R F2 R2 U' F2 D' R2 U R2 D' L2 U2 R B' L R2 D' F' U",
          '',
          1623582797,
        ],
        [
          [-1, 744],
          "U' R F D2 L2 U2 L2 B' U2 B F L2 D F2 R F' D R' U",
          '',
          1623582799,
        ],
        [
          [2000, 702],
          "F2 U D2 L' F2 R2 D2 B2 D2 F2 L' D2 F2 L D' B' R' U F2 U' B2",
          '',
          1623582801,
        ],
      ],
      properties: {
        sessionData:
          '{"1":{"name":1,"opt":{},"rank":1,"stat":[3,1,1730],"date":[1623582797,1623582801]},"2":{"name":2,"opt":{},"rank":2},"3":{"name":3,"opt":{},"rank":3},"4":{"name":4,"opt":{},"rank":4},"5":{"name":5,"opt":{},"rank":5},"6":{"name":6,"opt":{},"rank":6},"7":{"name":7,"opt":{},"rank":7},"8":{"name":8,"opt":{},"rank":8},"9":{"name":9,"opt":{},"rank":9},"10":{"name":10,"opt":{},"rank":10},"11":{"name":11,"opt":{},"rank":11},"12":{"name":12,"opt":{},"rank":12},"13":{"name":13,"opt":{},"rank":13},"14":{"name":14,"opt":{},"rank":14},"15":{"name":15,"opt":{},"rank":15}}',
      },
    };
    expect(fromCsTimer(csTimerData)).toEqual([
      {
        name: '1',
        times: [
          {
            time: 753,
            isDNF: false,
            penalty: false,
            scramble:
              "F D2 R F2 R2 U' F2 D' R2 U R2 D' L2 U2 R B' L R2 D' F' U",
            date: 1623582797000,
          },
          {
            time: 744,
            isDNF: true,
            penalty: false,

            scramble: "U' R F D2 L2 U2 L2 B' U2 B F L2 D F2 R F' D R' U",
            date: 1623582799000,
          },
          {
            time: 702,
            isDNF: false,
            penalty: true,

            scramble:
              "F2 U D2 L' F2 R2 D2 B2 D2 F2 L' D2 F2 L D' B' R' U F2 U' B2",
            date: 1623582801000,
          },
        ],
      },
    ]);
  });
});
