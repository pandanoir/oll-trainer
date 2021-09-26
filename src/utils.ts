export type CubeFace = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export const faces: CubeFace[] = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1, 1, 0, 0, 0],
  [0, 1, 0, 1, 1, 0, 1, 0, 0],
  [1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 1, 0, 1],
  [0, 1, 0, 0, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 1, 0, 1, 0, 1],
  [0, 1, 1, 0, 1, 1, 0, 0, 1],
  [0, 0, 1, 0, 1, 1, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1],
  [1, 1, 0, 1, 1, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 1, 0, 0, 1],
  [0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 1, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
];
export const solves = [
  [`R U'2 R'2 F R F' U2 R' F R F'`], // 0
  [`F R U R' U' F' Fw R U R' U' Fw'`],
  [`Fw R U R' U' Fw' U' F R U R' U' F'`],
  [`Fw R U R' U' Fw' U F R U R' U' F'`],
  [`Rw' U2 R U R' U Rw`],
  [`Rw U2 R' U' R U' Rw'`], // 5
  [`Rw U R' U R U'2 Rw'`],
  [`Rw' U' R U' R' U2 Rw`],
  [`R U R' U' R' F R2 U R' U' F'`],
  [`R U R' U R' F R F' R U2 R'`],
  [`Rw' R2 U R' U R U2 R' U M'`], // 10
  [`F R U R' U' F' U F R U R' U' F'`],
  [`F U R U' R'2 F' R U R U' R'`, `Rw U' Rw' U' Rw U Rw' F' U F`],
  [`Rw U R' U' Rw' F R2 U R' U' F'`],
  [`Rw' U' Rw R' U' R U Rw' U Rw`],
  [`Rw U Rw' R U R' U' Rw U' Rw'`], // 15
  [
    `Fw R U R' U' Fw' U' R U R' U' R' F R F'`,
    `(U') Fw R U R' U' Fw' U R U R' U' R' F R F'`,
  ],
  [`R U'2 R'2 F R F' U2 M' U R U' Rw'`],
  [`Rw' R U R U R' U' Rw R'2 F R F'`],
  [`Rw' R U R U R' U' M'2 U R U' Rw'`],
  [`R' U' R U' R' U R U' R' U2 R`], // 20
  [`R U'2 R'2 U' R2 U' R'2 U'2 R`],
  [`R2 D R' U2 R D' R' U2 R'`, `(U2) R'2 D' R U2 R' D R U2 R`],
  [`Rw U R' U' Rw' F R F'`],
  [`x' R U' R' D R U R' D'`, `(U) F R' F' Rw U R U' Rw'`],
  [`R' U' R U' R' U2 R`], // 25
  [`R U R' U R U2 R'`],
  [`Rw U R' U' Rw' R U R U' R'`],
  [`R' F R F' R U2 R' U' F' U' F`, `(U2) M U R U R' U' R' F R F' M'`],
  [`F R' F R2 U' R' U' R U R' F2`],
  [`R' U' F U R U' R' F' R`], // 30
  [`S R U R' U' R' F R Fw'`],
  [`R U R' U' R' F R F'`],
  [`R' U' R U x' z' R U L' U' M'`, `(U2) R U R2 U' R' F R U R U' F'`],
  [`R U'2 R'2 F R F' R U'2 R'`],
  [`R' U' R U' R' U R U x' R U' R' U`], // 35
  [`F R U' R' U' R U R' F'`],
  [`R U R' U R U' R' U' R' F R F'`],
  [`F R U R' U' F' R' U' R U' R' U2 R`, `(U2) R U R' F' U' F U R U2 R'`],
  [`R' F R U R' U' F' U R`],
  [`R U R' U R U2 R' F R U R' U' F'`], // 40
  [`R' U' R U' R' U2 R F R U R' U' F'`],
  [`R' U' F' U F R`],
  [`Fw R U R' U' Fw'`],
  [`F R U R' U' F'`],
  [`R' U' R' F R F' U R`],
  [
    `R' U' x R' U R U' R' U R U' x' U R`,
    `(U') F U R U' R' F' R U R' U R U2 R'`,
  ],
  [`F R U R' U' R U R' U' F'`],
  [`R B' R'2 F R2 B R'2 F' R`],
  [`Rw' U Rw2 U' Rw'2 U' Rw2 U Rw'`],
  [`Fw R U R' U' R U R' U' Fw'`, `(U') R' U' R' F R F' R U' R' U2 R`],
  [`R' F' U' F U' R U R' U R`],
  [`Rw' U' R U' R' U R U' R' U2 Rw`],
  [`Rw U R' U R U' R' U R U'2 Rw'`],
  [`Rw U2 R'2 F R F' U2 Rw' F R F'`, `(U) R' F U R U' R'2 F' R2 U R' U' R`],
  [`Rw' U' Rw U' R' U R U' R' U R Rw' U Rw`],
  [`R U R' U' M' U R U' Rw'`],
];
export const groups: Record<string, number[]> = {
  'A. すでに覚えているもの': [21, 22, 23, 24, 25, 26, 27],
  'B. 実はすでに覚えているもの': [2, 43, 44, 45],
  'C. Bと上面が同じもの': [1, 31, 32, 33],
  'D. 手数が短いもの': [37, 46],
  'E. Dと上面が同じもの': [34, 35],
  'F. 26番と27番に手順が似てるものと、それらと上面が同じもの': [
    5, 6, 7, 8, 11, 12,
  ],
  'G. コーナーが全て揃っているもの': [20, 28, 57],
  'H. エッジが1個も揃っていないもの　残り': [3, 4, 17, 18, 19],
  'I. 左右対称以外に上面が同じパターンがないもの': [9, 10, 36, 38, 39, 40],
  'J. 大きいL型のもの': [13, 14, 15, 16],
  'K. 小さいL型のもの': [47, 48, 49, 50, 53, 54],
  'L. 棒型のもの': [51, 52, 55, 56],
  'M. 変な形のもの': [29, 30, 41, 42],
};

export const rotate = (arr: Readonly<CubeFace>): CubeFace => {
  return [
    arr[2],
    arr[5],
    arr[8],
    arr[1],
    arr[4],
    arr[7],
    arr[0],
    arr[3],
    arr[6],
  ];
};

type NormalizedRotation = { rotation: string; turnCount: number };
const normalizeRotation = (rot: string): NormalizedRotation => {
  return {
    rotation: rot.replace(/['2]/g, ''),
    turnCount: rot.includes('2') ? 2 : rot.includes(`'`) ? 3 : 1,
  };
};
const fromNormalizedRotation = ({
  turnCount,
  rotation,
}: NormalizedRotation): string => {
  if (turnCount === 2) {
    return `${rotation}2`;
  }
  if (turnCount === 3) {
    return `${rotation}'`;
  }
  return rotation;
};
/**
 * セットアップするための逆手順を生成する。ここでいう逆手順とは、「F緑U白で入力された手順を開始できる状態にする手順」を指す
 * solve で入力される手順は、x,y,z,RLUDFB,MSE,w系を含む。また、(U)などAUF手順も含む。
 * @param solve 行う手順
 * @returns F緑U白で手順が開始できる状態にする手順
 */
export const calculateScramble = (solve: string): string => {
  // 単純に solve を逆にした手順を生成
  const scramble = solve
    .split(' ')
    .map((direction) => {
      if (direction.includes(`'`)) return direction.replace(/'/, '');
      if (direction === `(U)`) return `(U')`;
      if (direction === `(U')`) return `(U)`;
      if (direction === `(U2)`) return `(U'2)`;
      if (direction.includes('2')) return `${direction.slice(0, -1)}'2`;
      return `${direction}'`;
    })
    .reverse();

  // 手順を行うと持ち替えが起きることがある(MSE、wを含む)
  // 手順を最後まで行ったときにどう持っているのか計算し、これを逆手順の前に行う
  const turnToLastPosition = solve
    .split(' ')
    .filter((direction) => /[xyzMESw]/.test(direction))
    .map((direction) => {
      const { turnCount, rotation } = normalizeRotation(direction);
      switch (rotation) {
        case 'M':
          return fromNormalizedRotation({
            rotation: 'x',
            turnCount: 4 - turnCount,
          });
        case 'E':
          return fromNormalizedRotation({
            rotation: 'y',
            turnCount: 4 - turnCount,
          });
        case 'S':
          return fromNormalizedRotation({ rotation: 'z', turnCount });
        case 'Rw':
          return fromNormalizedRotation({ rotation: 'x', turnCount });
        case 'Lw':
          return fromNormalizedRotation({
            rotation: 'x',
            turnCount: 4 - turnCount,
          });
        case 'Uw':
          return fromNormalizedRotation({ rotation: 'y', turnCount });
        case 'Dw':
          return fromNormalizedRotation({
            rotation: 'y',
            turnCount: 4 - turnCount,
          });
        case 'Fw':
          return fromNormalizedRotation({ rotation: 'z', turnCount });
        case 'Bw':
          return fromNormalizedRotation({
            rotation: 'z',
            turnCount: 4 - turnCount,
          });
        default:
          return direction;
      }
    });

  return [...turnToLastPosition, ...scramble]
    .reduce<string[]>((acc, rot) => {
      const last = acc.pop();
      if (typeof last === 'undefined') {
        return [rot];
      }
      const normalizedLast = normalizeRotation(last);
      const normalizedRot = normalizeRotation(rot);
      if (normalizedLast.rotation !== normalizedRot.rotation) {
        return [...acc, last, rot];
      }
      if ((normalizedLast.turnCount + normalizedRot.turnCount) % 4 === 0) {
        return acc;
      }
      const newRot = fromNormalizedRotation({
        rotation: normalizedRot.rotation,
        turnCount: (normalizedLast.turnCount + normalizedRot.turnCount) % 4,
      });
      return [...acc, newRot];
    }, [])
    .join(' ');
};

export const modulo = (a: number, n: number): number => ((a % n) + n) % n;
