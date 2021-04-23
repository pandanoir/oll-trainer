import RubiksCube, { Rotation } from '@pandanoir/rubikscube';
import { Color, TopFace, cpList } from '../data/cpList';
import { calculateScramble } from '../utils';

export const cpSwapPatterns = [
  'no-swap',
  'diagonal',
  'F-swap',
  'B-swap',
  'L-swap',
  'R-swap',
] as const;
export const getCompanionSwap = (cpIndex: number) =>
  cpIndex % 2 === 0 ? cpIndex + 1 : cpIndex - 1;

const notFilter = <T extends unknown[]>(f: (...args: T) => boolean) => (
  ...args: T
) => !f(...args);
const isAUF = (rot: string) => /\(U(?:'2|2'|['2]?)\)/.test(rot);

export const checkCpPattern = (solve: string) => {
  const sides: Color[] = ['orange', 'blue', 'red', 'green'];
  const rotate = (face: TopFace): TopFace => [
    [face[3][0], face[2][0], face[1][0]],
    [face[4][0], face[3][1], face[2][1], face[1][1], face[0][0]],
    [face[4][1], face[3][2], face[2][2], face[1][2], face[0][1]],
    [face[4][2], face[3][3], face[2][3], face[1][3], face[0][2]],
    [face[3][4], face[2][4], face[1][4]],
  ];
  for (let i = 0; i < 4; ++i) {
    const cube = new RubiksCube({
      U: Array(9).fill('yellow'),
      F: Array(9).fill(sides[i]),
      R: Array(9).fill(sides[(i + 1) % 4]),
      B: Array(9).fill(sides[(i + 2) % 4]),
      L: Array(9).fill(sides[(i + 3) % 4]),
      D: Array(9).fill('white'),
    }).rotate(
      ...(calculateScramble(solve)
        .split(' ')
        .filter(notFilter(isAUF)) as Rotation[])
    );

    const UFace = [
      [cube.face.B[6], null, cube.face.B[8]],
      [cube.face.L[0], cube.face.U[0], null, cube.face.U[2], cube.face.R[2]],
      [null, null, 'yellow', null, null],
      [cube.face.L[2], cube.face.U[6], null, cube.face.U[8], cube.face.R[0]],
      [cube.face.F[0], null, cube.face.F[2]],
    ] as TopFace;
    for (const key of Object.keys(cpList)) {
      const cpIndex = cpList[key].findIndex((cube) => {
        for (let i = 0, fit = true; i < 4; ++i, fit = true) {
          for (let row = 0; row < cube.length && fit; ++row) {
            for (let col = 0; col < cube[row].length && fit; ++col) {
              if (cube[row][col] !== UFace[row][col]) {
                fit = false;
              }
            }
          }
          if (fit) {
            return true;
          }
          cube = rotate(cube);
        }
        return false;
      });
      if (cpIndex !== -1) {
        return [key, cpIndex] as const;
      }
    }
  }
  return null;
};
