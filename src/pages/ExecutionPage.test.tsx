/**
 * @jest-environment jsdom
 */
import { solveCorner, solveEdge } from './ExecutionPage';

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
// describe('ExecutionPage', () => {
//   it('snapshot', () => {
//     const { asFragment, queryByText, getByText } = render(
//       <BrowserRouter>`
//         <ExecutionPage />
//       </BrowserRouter>
//     );
//     expect(asFragment()).toMatchSnapshot();
//     expect(queryByText(/15 seconds/)).toBe(null);
//     act(() => {
//       getByText(/press space or tap to start inspection/).click();
//     });
//     expect(asFragment()).toMatchSnapshot();
//     expect(queryByText(/15 seconds/)).not.toBe(null);
//     act(() => {
//       jest.advanceTimersByTime(1000 + (1000 / 60) * 2);
//     });
//     expect(queryByText(/14 seconds/)).not.toBe(null);

//     act(() => {
//       jest.advanceTimersByTime(14000);
//     });
//     expect(queryByText(/\+2/)).not.toBe(null);
//   });
// });