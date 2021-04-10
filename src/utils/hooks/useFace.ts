import { useState } from 'react';
import { CubeFace } from 'src/utils';

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
