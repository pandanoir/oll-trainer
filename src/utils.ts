import { ChangeEvent, createContext, useEffect, useState } from 'react';
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
    5,
    6,
    7,
    8,
    11,
    12,
  ],
  'G. コーナーが全て揃っているもの': [20, 28, 57],
  'H. エッジが1個も揃っていないもの　残り': [3, 4, 17, 18, 19],
  'I. 左右対称以外に上面が同じパターンがないもの': [9, 10, 36, 38, 39, 40],
  'J. 大きいL型のもの': [13, 14, 15, 16],
  'K. 小さいL型のもの': [47, 48, 49, 50, 53, 54],
  'L. 棒型のもの': [51, 52, 55, 56],
  'M. 変な形のもの': [29, 30, 41, 42],
};

export const rotate = (arr: CubeFace): CubeFace => {
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
export const useFace = (): {
  cubeStatus: CubeFace;
  toggleCube: (index: number) => void;
  clearCube: () => void;
} => {
  const init: CubeFace = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [cubeStatus, setIsCheckedList] = useState<CubeFace>(init);
  return {
    cubeStatus,
    toggleCube: (index: number) => {
      setIsCheckedList((list) => {
        const copied = list.concat() as CubeFace;
        copied[index] = 1 - copied[index];
        return copied;
      });
    },
    clearCube: () => {
      setIsCheckedList(init);
    },
  } as const;
};
export const calculateScramble = (solve: string): string => {
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
  const _rotations = solve
    .split(' ')
    .filter((direction) => {
      return /[xyzMESw]/.test(direction);
    })
    .flatMap((direction) => {
      const isTwiceRotation = direction.includes('2');
      if (isTwiceRotation) {
        direction = direction.replace(/'/, '').replace(/2/, '');
      }
      let rot = direction;

      if (direction === 'M') rot = "x'";
      else if (direction === "M'") rot = 'x';
      else if (direction === 'E') rot = "y'";
      else if (direction === "E'") rot = 'y';
      else if (direction === 'S') rot = 'z';
      else if (direction === "S'") rot = "z'";
      else if (direction === 'Rw') rot = 'x';
      else if (direction === "Rw'") rot = "x'";
      else if (direction === 'Lw') rot = "x'";
      else if (direction === "Lw'") rot = 'x';
      else if (direction === 'Uw') rot = 'y';
      else if (direction === "Uw'") rot = "y'";
      else if (direction === 'Dw') rot = "y'";
      else if (direction === "Dw'") rot = 'y';
      else if (direction === 'Fw') rot = 'z';
      else if (direction === "Fw'") rot = "z'";
      else if (direction === 'Bw') rot = "z'";
      else if (direction === "Bw'") rot = 'z';

      if (isTwiceRotation) return [rot, rot];
      return rot;
    });
  const rotations: string[] = [];
  for (const rot of _rotations) {
    if (rotations.length === 0) {
      rotations.push(rot);
      continue;
    }
    const before = rotations[rotations.length - 1];
    if (
      rot.includes("'") !== before.includes("'") &&
      rot.replace(/'/, '') === before.replace(/'/, '')
    ) {
      rotations.pop();
      continue;
    }
    rotations.push(rot);
    if (rotations.length >= 4) {
      let isSame = true;
      const last = rotations.length - 1;
      for (let i = 0; i < 4; ++i) {
        if (rotations[last] !== rotations[last - i]) isSame = false;
      }
      if (isSame) {
        for (let i = 0; i < 4; ++i) rotations.pop();
      }
    }
  }
  return [...rotations, ...scramble].join(' ');
};

const CHECKED_STORE = 'OLL_RANDOM_CHECKED' as const;
interface CheckList {
  checkList: boolean[];
  check: (index: number) => void;
  reset: () => void;
}
export const CheckContext = createContext<CheckList>({} as CheckList);

export const nextIndex = (index: number, size: number): number =>
    (index + 1) % size,
  prevIndex = (index: number, size: number): number =>
    (index - 1 + size) % size;
const useStorage = <T extends unknown>(
  key: string,
  value: T,
  setter: (arg: T) => void
) => {
  useEffect(() => {
    const json = localStorage.getItem(key);
    if (json !== null) {
      setter(JSON.parse(json));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
};
export const useCheck = (): CheckList => {
  const [checkList, setCheckList] = useState<boolean[]>(() =>
    Array(57).fill(false)
  );
  useStorage(CHECKED_STORE, checkList, setCheckList);

  const check = (index: number) => {
    setCheckList(Object.assign([], checkList, { [index]: !checkList[index] }));
  };
  return {
    checkList,
    check,
    reset: () => {
      setCheckList(Array(57).fill(false));
    },
  };
};
export const useCheckbox = (
  init = false
): [boolean, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [checked, setChecked] = useState(init);
  return [
    checked,
    (event: ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    },
  ];
};
