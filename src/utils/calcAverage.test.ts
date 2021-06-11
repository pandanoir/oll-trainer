import { calcAverage } from './calcAverage';

describe('calcAverage', () => {
  it('calculates average of given number array', () => {
    expect(calcAverage([0, 1, 10, 100])).toBe(111 / 4);
    expect(calcAverage([0, -1, -10, -100])).toBe(-111 / 4);
  });
});
