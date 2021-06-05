import { findIndexOfMax } from './findIndexOfMax';

describe('findIndexOfMax', () => {
  it('returns index of max value', () => {
    expect(findIndexOfMax([0, 1, 2, 3, 4, 5])).toBe(5);
    expect(findIndexOfMax([5, 4, 3, 2, 1, 0])).toBe(0);
    expect(findIndexOfMax([4, 3, 5, 2, 1, 0])).toBe(2);
  });
  it('returns -1 if array is empty', () => {
    expect(findIndexOfMax([])).toBe(-1);
  });
});
