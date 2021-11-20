import { zip3 } from './zip3';

describe('zip3', () => {
  it('makes list of tuples', () => {
    expect(zip3([1, 2, 3], [4, 5, 6], [7, 8, 9])).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });
});
