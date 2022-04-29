import Cube, { CubeType, Direction } from '@pandanoir/rubikscube';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import useTitle from 'react-use/lib/useTitle';
import Scrambo from 'scrambo';
import tw from 'twin.macro';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useInput } from '../utils/hooks/useInput';

const Cubelet = tw.div`w-8 h-8 text-center align-top text-lg border-r border-b border-gray-800`;
const WhiteCubelet = tw(Cubelet)`bg-gray-50 text-black`;
const GreenCubelet = tw(Cubelet)`bg-green-500 text-black`;
const RedCubelet = tw(Cubelet)`bg-red-600`;
const BlueCubelet = tw(Cubelet)`bg-blue-500`;
const OrangeCubelet = tw(Cubelet)`bg-orange-500`;
const YellowCubelet = tw(Cubelet)`bg-yellow-300 text-black`;

const Face: VFC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    tw="grid grid-cols-3 text-gray-100 border-gray-800"
    className={className}
  >
    {children}
  </div>
);
const NetDrawing: VFC<{
  numbering?: string[][];
  selected?: { face: string; index: number }[];
}> = ({
  numbering = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ],
  selected,
}) => {
  const isSelected = (targetFace: string, targetIndex: number) =>
    !!selected &&
    typeof selected
      .filter(({ face }) => face === targetFace)
      .find(({ index }) => index === targetIndex) !== 'undefined';
  return (
    <div>
      <div tw="w-max">
        <div tw="flex justify-center">
          <Face tw="border-t border-l">
            {numbering[0].slice(0, 6).map((char, index) => (
              <WhiteCubelet
                key={index}
                css={isSelected('U', index) ? tw`bg-gray-300` : ''}
              >
                {char}
              </WhiteCubelet>
            ))}
            <WhiteCubelet
              tw="border-b-0"
              css={isSelected('U', 6) ? tw`bg-gray-300` : ''}
            >
              {numbering[0][6]}
            </WhiteCubelet>
            <WhiteCubelet
              tw="border-b-0"
              css={isSelected('U', 7) ? tw`bg-gray-300` : ''}
            >
              {numbering[0][7]}
            </WhiteCubelet>
            <WhiteCubelet
              tw="border-b-0"
              css={isSelected('U', 8) ? tw`bg-gray-300` : ''}
            >
              {numbering[0][8]}
            </WhiteCubelet>
          </Face>
        </div>
        <div tw="flex border-t border-gray-800">
          <Face tw="border-l">
            {numbering[1].map((char, index) => (
              <OrangeCubelet
                key={index}
                css={isSelected('L', index) ? tw`bg-orange-700` : ''}
              >
                {char}
              </OrangeCubelet>
            ))}
          </Face>
          <Face>
            {numbering[2].map((char, index) => (
              <GreenCubelet
                key={index}
                css={isSelected('F', index) ? tw`bg-green-600` : ''}
              >
                {char}
              </GreenCubelet>
            ))}
          </Face>
          <Face>
            {numbering[3].map((char, index) => (
              <RedCubelet
                key={index}
                css={isSelected('R', index) ? tw`bg-red-700` : ''}
              >
                {char}
              </RedCubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[4].map((char, index) => (
              <YellowCubelet
                key={index}
                css={isSelected('D', index) ? tw`bg-yellow-500` : ''}
              >
                {char}
              </YellowCubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[5].map((char, index) => (
              <BlueCubelet
                key={index}
                css={isSelected('B', index) ? tw`bg-blue-600` : ''}
              >
                {char}
              </BlueCubelet>
            ))}
          </Face>
        </div>
      </div>
    </div>
  );
};

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
      (cubelet, index) => index % 2 === 1 && cubelet === initial.U[index]
    ).length +
    cube.D.filter(
      (cubelet, index) => index % 2 === 1 && cubelet === initial.D[index]
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
      (cubelet, index) => cubelet === label && index % 2 === 1
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
export const solveCorner = (scramble: Direction[], bufferLabel: number) => {
  const initial = Object.freeze({
    U: ['0', '0', '12', '4', '-1', '8', '3', '3', '15'],
    L: ['16', '16', '19', '17', '-1', '19', '17', '18', '18'],
    F: ['7', '15', '11', '7', '-1', '11', '6', '14', '10'],
    R: ['23', '20', '20', '23', '-1', '21', '22', '22', '21'],
    D: ['2', '2', '14', '6', '-1', '10', '1', '1', '13'],
    B: ['5', '13', '9', '5', '-1', '9', '4', '12', '8'],
  });
  const countCorrectCorner = (cube: CubeType) =>
    cube.U.filter(
      (cubelet, index) =>
        index % 2 === 0 && index !== 4 && cubelet === initial.U[index]
    ).length +
    cube.D.filter(
      (cubelet, index) =>
        index % 2 === 0 && index !== 4 && cubelet === initial.D[index]
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
        initial[face][0] === label ||
        initial[face][2] === label ||
        initial[face][6] === label ||
        initial[face][8] === label
    )[0];
    const index = initial[face].findIndex(
      (cubelet, index) => cubelet === label && index % 2 === 0
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

  const numberOfCorrectCorner = countCorrectCorner(cube);
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
  if (solution.length + numberOfCorrectCorner !== 7) {
    return -1; //ループあり
  }

  return solution;
};

const myNumbering: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
][] = [
  ['あ', 'あ', 'た', 'か', '', 'さ', 'え', 'え', 'て'],
  ['な', 'な', 'ね', 'に', '', 'ね', 'に', 'ぬ', 'ぬ'],
  ['け', 'て', 'せ', 'け', '', 'せ', 'く', 'つ', 'す'],
  ['れ', 'ら', 'ら', 'れ', '', 'り', 'る', 'る', 'り'],
  ['う', 'う', 'つ', 'く', '', 'す', 'い', 'い', 'ち'],
  ['き', 'ち', 'し', 'き', '', 'し', 'か', 'た', 'さ'],
]; // 白橙緑赤黄青 の順
const nagoyancubeNumbering: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
][] = [
  ['れ', 'ら', 'ら', 'れ', ' ', 'り', 'る', 'る', 'り'], //U
  ['ち', 'つ', 'つ', 'ち', ' ', 'て', 'た', 'た', 'て'], // L
  ['き', 'く', 'く', 'き', ' ', 'け', 'か', 'か', 'け'], // F
  ['み', 'む', 'む', 'み', ' ', 'め', 'ま', 'ま', 'め'], // R
  ['え', 'あ', 'あ', 'え', ' ', 'い', 'う', 'う', 'い'], // D
  ['せ', 'さ', 'さ', 'せ', ' ', 'し', 'す', 'す', 'し'], // B
]; // 白橙緑赤黄青 の順
export const ExecutionPage: VFC = () => {
  useTitle('Practice execution of blindfolded method');

  const [numbering, setNumbering] =
    useState<
      [string, string, string, string, string, string, string, string, string][]
    >(nagoyancubeNumbering);
  const numericNumbering = useMemo(
    () => [
      ['0', '0', '12', '4', ' ', '8', '3', '3', '15'],
      ['16', '16', '19', '17', ' ', '19', '17', '18', '18'],
      ['7', '15', '11', '7', ' ', '11', '6', '14', '10'],
      ['23', '20', '20', '23', ' ', '21', '22', '22', '21'],
      ['2', '2', '14', '6', ' ', '10', '1', '1', '13'],
      ['5', '13', '9', '5', ' ', '9', '4', '12', '8'],
    ],
    []
  );
  const [scramble, setScramble] = useState('');
  const { value: edgeBufferInput, onChange: onEdgeBufferChange } =
    useInput('ら');
  const { value: cornerBufferInput, onChange: onCornerBufferChange } =
    useInput('え');

  const edgeBuffer = useMemo(() => {
    const row = numbering.findIndex((row) =>
      row.filter((_, index) => index % 2 === 1).includes(edgeBufferInput)
    );
    if (row === -1) return '';
    const index = numbering[row].findIndex(
      (char, index) => index % 2 === 1 && char === edgeBufferInput
    );
    return numericNumbering[row][index];
  }, [edgeBufferInput, numbering, numericNumbering]);

  const cornerBuffer = useMemo(() => {
    const row = numbering.findIndex((row) =>
      row
        .filter((_, index) => index % 2 === 0 && index !== 4)
        .includes(cornerBufferInput)
    );
    if (row === -1) return '';
    const index = numbering[row].findIndex(
      (char, index) =>
        index % 2 === 0 && index !== 4 && char === cornerBufferInput
    );
    return numericNumbering[row][index];
  }, [cornerBufferInput, numbering, numericNumbering]);

  const isValidEdgeBuffer = useCallback(
    (edgeBuffer: string) => {
      const index = numericNumbering
        .find((row) =>
          row.find((label, index) => index % 2 === 1 && label === edgeBuffer)
        )
        ?.findIndex((label, index) => index % 2 === 1 && label === edgeBuffer);
      return typeof index === 'number' && index !== -1;
    },
    [numericNumbering]
  );
  const isValidCornerBuffer = useCallback(
    (cornerBuffer: string) => {
      const index = numericNumbering
        .find((row) =>
          row.find((label, index) => index % 2 === 0 && label === cornerBuffer)
        )
        ?.findIndex(
          (label, index) => index % 2 === 0 && label === cornerBuffer
        );
      return typeof index === 'number' && index !== -1;
    },
    [numericNumbering]
  );
  const renewScramble = useCallback(() => {
    const scrambo = new Scrambo();
    for (let i = 0; i < 1e3; i++) {
      const scramble = scrambo.get(1)[0].split(' ') as Direction[];
      if (
        isValidEdgeBuffer(edgeBuffer) &&
        isValidCornerBuffer(cornerBuffer) &&
        solveEdge(scramble, Number(edgeBuffer)) !== -1 &&
        solveCorner(scramble, Number(cornerBuffer)) !== -1
      ) {
        setScramble(scramble.join(' '));
        break;
      }
    }
  }, [cornerBuffer, edgeBuffer, isValidCornerBuffer, isValidEdgeBuffer]);
  useEffect(() => {
    renewScramble();
  }, [renewScramble]);

  const edgeBufferPosition = useMemo(() => {
    if (!isValidEdgeBuffer(edgeBuffer)) {
      return undefined;
    }
    const index = numericNumbering
      .find((row) =>
        row.find((label, index) => index % 2 === 1 && label === edgeBuffer)
      )
      ?.findIndex((label, index) => index % 2 === 1 && label === edgeBuffer);
    if (typeof index === 'undefined') {
      return undefined;
    }
    return {
      face: ['U', 'L', 'F', 'R', 'D', 'B'][
        numericNumbering.findIndex((row) =>
          row.find((label, index) => index % 2 === 1 && label === edgeBuffer)
        )
      ],
      index,
    };
  }, [edgeBuffer, isValidEdgeBuffer, numericNumbering]);
  const cornerBufferPosition = useMemo(() => {
    if (!isValidCornerBuffer(cornerBuffer)) {
      return undefined;
    }
    const index = numericNumbering
      .find((row) =>
        row.find((label, index) => index % 2 === 0 && label === cornerBuffer)
      )
      ?.findIndex((label, index) => index % 2 === 0 && label === cornerBuffer);
    if (typeof index === 'undefined') {
      return undefined;
    }
    return {
      face: ['U', 'L', 'F', 'R', 'D', 'B'][
        numericNumbering.findIndex((row) =>
          row.find((label, index) => index % 2 === 0 && label === cornerBuffer)
        )
      ],
      index,
    };
  }, [cornerBuffer, isValidCornerBuffer, numericNumbering]);

  const edgeSolution = useMemo(() => {
    if (!isValidEdgeBuffer(edgeBuffer)) {
      return null;
    }
    const solution = solveEdge(
      scramble.split(' ') as Direction[],
      Number(edgeBuffer)
    );
    if (solution === -1) {
      return null;
    }
    return solution;
  }, [edgeBuffer, isValidEdgeBuffer, scramble]);
  const cornerSolution = useMemo(() => {
    if (!isValidCornerBuffer(cornerBuffer)) {
      return null;
    }
    const solution = solveCorner(
      scramble.split(' ') as Direction[],
      Number(cornerBuffer)
    );
    if (solution === -1) {
      return null;
    }
    return solution;
  }, [cornerBuffer, isValidCornerBuffer, scramble]);

  return (
    <div tw="flex flex-col gap-y-2">
      <NetDrawing
        numbering={numbering}
        selected={[
          ...(typeof edgeBufferPosition !== 'undefined'
            ? [edgeBufferPosition]
            : []),
          ...(typeof cornerBufferPosition !== 'undefined'
            ? [cornerBufferPosition]
            : []),
        ]}
      />
      <PrimaryButton
        tw="w-max"
        onClick={() => {
          if (numbering === nagoyancubeNumbering) {
            setNumbering(myNumbering);
          } else {
            setNumbering(nagoyancubeNumbering);
          }
        }}
      >
        change numbering
      </PrimaryButton>
      <div
        tw="grid grid-cols-2 gap-x-3 gap-y-1"
        css="grid-template-columns: max-content max-content"
      >
        <span>select corner buffer: </span>
        <input
          value={cornerBufferInput}
          onChange={onCornerBufferChange}
          tw="text-black rounded"
        />
        <span>select edge buffer: </span>
        <input
          value={edgeBufferInput}
          onChange={onEdgeBufferChange}
          tw="text-black rounded"
        />
      </div>
      {isValidCornerBuffer(cornerBuffer) && isValidEdgeBuffer(edgeBuffer) && (
        <div tw="border p-3 rounded my-5 mx-3">
          <div> scramble: {scramble}</div>
          <div>
            edge execution:
            {edgeSolution
              ?.map((char) => {
                const row = numericNumbering.findIndex(
                  (row) =>
                    row[1] === char ||
                    row[3] === char ||
                    row[5] === char ||
                    row[7] === char
                );
                if (row === -1) {
                  return '';
                }
                const index = numericNumbering[row].findIndex(
                  (cubelet, index) => cubelet === char && index % 2 === 1
                );
                return numbering[row][index];
              })
              .join(' ')}
          </div>
          <div>
            corner execution:
            {cornerSolution
              ?.map((char) => {
                const row = numericNumbering.findIndex(
                  (row) =>
                    row[0] === char ||
                    row[2] === char ||
                    row[6] === char ||
                    row[8] === char
                );
                if (row === -1) {
                  return '';
                }
                const index = numericNumbering[row].findIndex(
                  (cubelet, index) =>
                    cubelet === char && index % 2 === 0 && index !== 4
                );
                return numbering[row][index];
              })
              .join(' ')}
          </div>
        </div>
      )}
    </div>
  );
};
