import { calcStandardDeviation } from './calcStandardDeviation';

describe('calcStandardDeviation', () => {
  it('calculates standard deviation of given number array', () => {
    expect(calcStandardDeviation([0, 1, 10, 100])).toBe(Math.sqrt(1755.1875));
    expect(calcStandardDeviation([0, -1, -10, -100])).toBe(
      Math.sqrt(1755.1875)
    );
    expect(calcStandardDeviation([90, 80, 40, 60, 90])).toBe(Math.sqrt(376));
  });
});
