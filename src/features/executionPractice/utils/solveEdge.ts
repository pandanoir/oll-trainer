import Cube, { Direction, CubeType } from '@pandanoir/rubikscube';

export const solveEdge = (scramble: Direction[], bufferLabel: number) => {
  const initial = Object.freeze({
    U: ['0', '0', '12', '4', '-1', '8', '3', '3', '15'],
    L: ['16', '16', '19', '17', '-1', '19', '17', '18', '18'],
    F: ['7', '15', '11', '7', '-1', '11', '6', '14', '10'],
    R: ['23', '20', '20', '23', '-1', '21', '22', '22', '21'],
    D: ['2', '2', '14', '6', '-1', '10', '1', '1', '13'],
    B: ['5', '13', '9', '5', '-1', '9', '4', '12', '8'],
  });
  const countCorrectEdge = (cube: CubeType) =>
    cube.U.filter(
      (cubelet, index) => isEdge(index) && cubelet === initial.U[index]
    ).length +
    cube.D.filter(
      (cubelet, index) => isEdge(index) && cubelet === initial.D[index]
    ).length +
    cube.F.filter(
      (cubelet, index) =>
        (index === 3 || index === 5) && cubelet === initial.F[index]
    ).length +
    cube.B.filter(
      (cubelet, index) =>
        (index === 3 || index === 5) && cubelet === initial.B[index]
    ).length;
  const cube = new Cube({
    U: ['0', '0', '12', '4', '-1', '8', '3', '3', '15'],
    L: ['16', '16', '19', '17', '-1', '19', '17', '18', '18'],
    F: ['7', '15', '11', '7', '-1', '11', '6', '14', '10'],
    R: ['23', '20', '20', '23', '-1', '21', '22', '22', '21'],
    D: ['2', '2', '14', '6', '-1', '10', '1', '1', '13'],
    B: ['5', '13', '9', '5', '-1', '9', '4', '12', '8'],
  }).rotate(...scramble).face;
  const calcPosFromNumbering = (label: string) => {
    const face = (Object.keys(initial) as (keyof typeof initial)[]).filter(
      (face) =>
        initial[face][1] === label ||
        initial[face][3] === label ||
        initial[face][5] === label ||
        initial[face][7] === label
    )[0];
    const index = initial[face].findIndex(
      (cubelet, index) => cubelet === label && isEdge(index)
    );
    return { face, index };
  };
  const getNumberingFromPos = ({
    face,
    index,
  }: {
    face: keyof typeof cube;
    index: number;
  }) => cube[face][index];
  const solution = [];

  const numberOfCorrectEdge = countCorrectEdge(cube);
  for (
    let i = 0,
      currentBufferLabel = getNumberingFromPos(
        calcPosFromNumbering(`${bufferLabel}`)
      ); // いまのバッファのラベルが指している位置
    i < 30;
    i++
  ) {
    if (currentBufferLabel === `${bufferLabel}`) {
      break;
    }
    solution.push(currentBufferLabel);
    const nextLabel = getNumberingFromPos(
      calcPosFromNumbering(currentBufferLabel)
    );
    currentBufferLabel = nextLabel;
  }
  if (solution.length + numberOfCorrectEdge !== 11) {
    return -1; //ループあり
  }

  return solution;
};

export const isEdge = (index: number) => index % 2 === 1;
