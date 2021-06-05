import { findIndexOfMin } from './findIndexOfMin';

describe('findIndexOfMin', () => {
  it('returns index of max value', () => {
    expect(findIndexOfMin([0, 1, 2, 3, 4, 5])).toBe(0);
    expect(findIndexOfMin([5, 4, 3, 2, 1, 0])).toBe(5);
    expect(findIndexOfMin([4, 3, 0, 2, 1, 5])).toBe(2);
  });
  it('returns -1 if array is empty', () => {
    expect(findIndexOfMin([])).toBe(-1);
  });
});
