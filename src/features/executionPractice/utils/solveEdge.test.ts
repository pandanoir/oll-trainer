import { solveEdge } from './solveEdge';

describe('solveEdge', () => {
  it('solves edges', () => {
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
    expect(solveEdge(['L2', ...Tperm, 'L2', ...Tperm], 8)).toEqual([
      '4', // か
      '6', // く
    ]);
  });
  it('cannot solve edges if multiple loops exist', () => {
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
    expect(solveEdge([...Tperm, 'L2', ...Tperm, 'L2', ...Tperm], 8)).toBe(-1);
  });
  test('sample1', () => {
    expect(
      solveEdge(
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
        0
      )
    ).toEqual(['5', '19', '1', '23', '22', '9', '18', '14', '16', '20']);
  });
});
