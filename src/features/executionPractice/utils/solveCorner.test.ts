import { solveCorner } from './solveCorner';

describe('solveCorner', () => {
  it('solves corners', () => {
    const alteredYperm = [
      `R`,
      `U'`,
      `R'`,
      `U'`,
      `R`,
      `U`,
      `R'`,
      `F'`,
      `R`,
      `U`,
      `R'`,
      `U'`,
      `R'`,
      `F`,
      `R`,
    ] as const;
    expect(
      solveCorner(['D2', ...alteredYperm, 'D2', 'R', ...alteredYperm, `R'`], 0)
    ).toEqual([
      '21', // か
      '17', // く
    ]);
  });
  it('cannot solve corners if multiple loops exist', () => {
    const Tperm = [
      'R',
      'U',
      `R'`,
      `U'`,
      `R'`,
      'F',
      'R2',
      `U'`,
      `R'`,
      `U'`,
      'R',
      'U',
      `R'`,
      `F'`,
    ] as const;
    expect(solveCorner([...Tperm, 'L2', ...Tperm, 'L2', ...Tperm], 0)).toBe(-1);
  });
  test('sample1', () => {
    expect(
      solveCorner(
        [
          `R`,
          `F'`,
          `L'`,
          `U`,
          `B'`,
          `D`,
          `F'`,
          `U'`,
          `R`,
          `F'`,
          `L'`,
          `U2`,
          `B2`,
          `R2`,
          `F`,
          `L'`,
          `B`,
          `U`,
          `B2`,
          `R`,
        ],
        2
      )
    ).toEqual(['0', '17', '9', '14', '7', '11']);
  });
});
