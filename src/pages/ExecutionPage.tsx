import Cube, { CubeType, Direction } from '@pandanoir/rubikscube';
import immer from 'immer';
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
import tw, { styled } from 'twin.macro';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { SecondaryDangerButton } from '../components/common/SecondaryDangerButton';
import { useI18nContext } from '../i18n/i18n-react';
import { useInputWithStorage } from '../utils/hooks/useInput';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { withPrefix } from '../utils/withPrefix';

const BaseCubelet = tw.div`w-8 h-8 text-center align-top text-lg border-r border-b border-gray-800`;
const WhiteCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-gray-300 text-black` : tw`bg-gray-50 text-black`
);
const GreenCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-green-600 text-black` : tw`bg-green-500 text-black`
);
const RedCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-red-700` : tw`bg-red-600`
);
const BlueCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-blue-600` : tw`bg-blue-500`
);
const OrangeCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-orange-700` : tw`bg-orange-500`
);
const YellowCubelet = styled(BaseCubelet)(
  ({ selected = false }: { selected?: boolean }) =>
    selected ? tw`bg-yellow-500 text-black` : tw`bg-yellow-300 text-black`
);

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
  numbering?: Numbering;
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
    <div tw="w-max">
      <div tw="flex justify-center">
        <Face tw="border-t border-l">
          {numbering[0].slice(0, 6).map((char, index) => (
            <WhiteCubelet key={index} selected={isSelected('U', index)}>
              {char}
            </WhiteCubelet>
          ))}
          <WhiteCubelet tw="border-b-0" selected={isSelected('U', 6)}>
            {numbering[0][6]}
          </WhiteCubelet>
          <WhiteCubelet tw="border-b-0" selected={isSelected('U', 7)}>
            {numbering[0][7]}
          </WhiteCubelet>
          <WhiteCubelet tw="border-b-0" selected={isSelected('U', 8)}>
            {numbering[0][8]}
          </WhiteCubelet>
        </Face>
      </div>
      <div tw="flex border-t border-gray-800">
        <Face tw="border-l">
          {numbering[1].map((char, index) => (
            <OrangeCubelet key={index} selected={isSelected('L', index)}>
              {char}
            </OrangeCubelet>
          ))}
        </Face>
        <Face>
          {numbering[2].map((char, index) => (
            <GreenCubelet key={index} selected={isSelected('F', index)}>
              {char}
            </GreenCubelet>
          ))}
        </Face>
        <Face>
          {numbering[3].map((char, index) => (
            <RedCubelet key={index} selected={isSelected('R', index)}>
              {char}
            </RedCubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[4].map((char, index) => (
            <YellowCubelet key={index} selected={isSelected('D', index)}>
              {char}
            </YellowCubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[5].map((char, index) => (
            <BlueCubelet key={index} selected={isSelected('B', index)}>
              {char}
            </BlueCubelet>
          ))}
        </Face>
      </div>
    </div>
  );
};

type Numbering = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
][];
const numberingPresets: Numbering[] = [
  [
    ['あ', 'あ', 'た', 'か', '', 'さ', 'え', 'え', 'て'],
    ['な', 'な', 'ね', 'に', '', 'ね', 'に', 'ぬ', 'ぬ'],
    ['け', 'て', 'せ', 'け', '', 'せ', 'く', 'つ', 'す'],
    ['れ', 'ら', 'ら', 'れ', '', 'り', 'る', 'る', 'り'],
    ['う', 'う', 'つ', 'く', '', 'す', 'い', 'い', 'ち'],
    ['き', 'ち', 'し', 'き', '', 'し', 'か', 'た', 'さ'],
  ],
  [
    ['え', 'あ', 'あ', 'え', '', 'い', 'う', 'う', 'い'],
    ['て', 'た', 'た', 'て', '', 'ち', 'つ', 'つ', 'ち'],
    ['せ', 'さ', 'さ', 'せ', '', 'し', 'す', 'す', 'し'],
    ['め', 'ま', 'ま', 'め', '', 'み', 'む', 'む', 'み'],
    ['れ', 'ら', 'ら', 'れ', '', 'り', 'る', 'る', 'り'],
    ['き', 'く', 'く', 'き', '', 'け', 'か', 'か', 'け'],
  ],
];

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
      (cubelet, index) => isCorner(index) && cubelet === initial.U[index]
    ).length +
    cube.D.filter(
      (cubelet, index) => isCorner(index) && cubelet === initial.D[index]
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
      (cubelet, index) => cubelet === label && isCorner(index)
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

const isEdge = (index: number) => index % 2 === 1;
const isCorner = (index: number) => index % 2 === 0 && index !== 4;

const getCorners = (numbering: string[][]) =>
  numbering.map((row) => row.filter((_, index) => isCorner(index)));
const getEdges = (numbering: string[][]) =>
  numbering.map((row) => row.filter((_, index) => isEdge(index)));

const CubeletInput = tw.input`w-4 bg-transparent`;
const NumberingSettingMode: VFC<{
  currentNumbering: Numbering;
  onFinish: (newNumbering: Numbering) => void;
  onCancel: () => void;
}> = ({ currentNumbering, onFinish, onCancel }) => {
  const { LL } = useI18nContext();
  const [numbering, setNumbering] = useState<Numbering>(currentNumbering);

  const updateNumbering = (face: number, index: number, newValue: string) => {
    setNumbering(
      immer((draft) => {
        draft[face][index] = newValue;
      })
    );
  };
  return (
    <div tw="flex flex-col gap-y-3">
      {LL['click and change labels']()}
      <div tw="w-max">
        <div tw="flex justify-center">
          <Face tw="border-t border-l">
            {numbering[0].slice(0, 6).map((char, index) => (
              <WhiteCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(0, index, value)
                  }
                />
              </WhiteCubelet>
            ))}
            <WhiteCubelet tw="border-b-0">
              <CubeletInput
                value={numbering[0][6]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 6, value)
                }
              />
            </WhiteCubelet>
            <WhiteCubelet tw="border-b-0">
              <CubeletInput
                value={numbering[0][7]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 7, value)
                }
              />
            </WhiteCubelet>
            <WhiteCubelet tw="border-b-0">
              <CubeletInput
                value={numbering[0][8]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 8, value)
                }
              />
            </WhiteCubelet>
          </Face>
        </div>
        <div tw="flex border-t border-gray-800">
          <Face tw="border-l">
            {numbering[1].map((char, index) => (
              <OrangeCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(1, index, value)
                  }
                />
              </OrangeCubelet>
            ))}
          </Face>
          <Face>
            {numbering[2].map((char, index) => (
              <GreenCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(2, index, value)
                  }
                />
              </GreenCubelet>
            ))}
          </Face>
          <Face>
            {numbering[3].map((char, index) => (
              <RedCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(3, index, value)
                  }
                />
              </RedCubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[4].map((char, index) => (
              <YellowCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(4, index, value)
                  }
                />
              </YellowCubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[5].map((char, index) => (
              <BlueCubelet key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(5, index, value)
                  }
                />
              </BlueCubelet>
            ))}
          </Face>
        </div>
      </div>
      <details>
        <summary>{LL['choose from presets']()}</summary>
        <ul tw="flex gap-x-3">
          {numberingPresets.map((preset, index) => (
            <li tw="text-center" key={index}>
              <NetDrawing numbering={preset} />
              <SecondaryButton onClick={() => setNumbering(preset)}>
                {LL['use this preset']()}
              </SecondaryButton>
            </li>
          ))}
        </ul>
      </details>
      <div tw="flex gap-3">
        <PrimaryButton
          onClick={() => {
            onFinish(numbering);
          }}
        >
          {LL['save setting']()}
        </PrimaryButton>
        <SecondaryDangerButton
          tw="w-max"
          onClick={() => {
            if (numbering === currentNumbering || confirm('discard changes?'))
              onCancel();
          }}
        >
          {LL['back to practice without save setting']()}
        </SecondaryDangerButton>
      </div>
    </div>
  );
};

const PracticeMode: VFC<{
  numbering: Numbering;
  onNumberingSettingClick: () => void;
}> = ({ numbering, onNumberingSettingClick }) => {
  const { LL } = useI18nContext();
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
    useInputWithStorage(withPrefix('edgeBufferInput'), 'さ');
  const { value: cornerBufferInput, onChange: onCornerBufferChange } =
    useInputWithStorage(withPrefix('cornerBufferInput'), 'あ');

  const edgeBuffer = useMemo(() => {
    const row = numbering.findIndex((row) =>
      row.filter((_, index) => isEdge(index)).includes(edgeBufferInput)
    );
    if (row === -1) return '';
    const index = numbering[row].findIndex(
      (char, index) => isEdge(index) && char === edgeBufferInput
    );
    return numericNumbering[row][index];
  }, [edgeBufferInput, numbering, numericNumbering]);

  const cornerBuffer = useMemo(() => {
    const row = numbering.findIndex((row) =>
      row.filter((_, index) => isCorner(index)).includes(cornerBufferInput)
    );
    if (row === -1) return '';
    const index = numbering[row].findIndex(
      (char, index) => isCorner(index) && char === cornerBufferInput
    );
    return numericNumbering[row][index];
  }, [cornerBufferInput, numbering, numericNumbering]);

  const isValidEdgeBuffer = useCallback(
    (edgeBuffer: string) =>
      getEdges(numericNumbering).some((row) => row.includes(edgeBuffer)),
    [numericNumbering]
  );
  const isValidCornerBuffer = useCallback(
    (cornerBuffer: string) =>
      getCorners(numericNumbering).some((row) => row.includes(cornerBuffer)),
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
        row.find((label, index) => isEdge(index) && label === edgeBuffer)
      )
      ?.findIndex((label, index) => isEdge(index) && label === edgeBuffer);
    if (typeof index === 'undefined') {
      return undefined;
    }
    return {
      face: ['U', 'L', 'F', 'R', 'D', 'B'][
        getEdges(numericNumbering).findIndex((edges) =>
          edges.includes(edgeBuffer)
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
        row.find((label, index) => isCorner(index) && label === cornerBuffer)
      )
      ?.findIndex((label, index) => isCorner(index) && label === cornerBuffer);
    if (typeof index === 'undefined') {
      return undefined;
    }
    return {
      face: ['U', 'L', 'F', 'R', 'D', 'B'][
        getCorners(numericNumbering).findIndex((corners) =>
          corners.includes(cornerBuffer)
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
      <SecondaryButton onClick={onNumberingSettingClick} tw="w-max">
        {LL['change numbering setting']()}
      </SecondaryButton>
      <PrimaryButton
        tw="w-max"
        onClick={() => {
          renewScramble();
        }}
      >
        {LL['renew scramble']()}
      </PrimaryButton>
      <div
        tw="grid grid-cols-2 gap-x-3 gap-y-1"
        css="grid-template-columns: max-content max-content"
      >
        <span>{LL['corner buffer']()}: </span>
        <input
          value={cornerBufferInput}
          onChange={onCornerBufferChange}
          tw="text-black rounded"
        />
        <span>{LL['edge buffer']()}: </span>
        <input
          value={edgeBufferInput}
          onChange={onEdgeBufferChange}
          tw="text-black rounded"
        />
      </div>
      {isValidCornerBuffer(cornerBuffer) && isValidEdgeBuffer(edgeBuffer) && (
        <div tw="border border-gray-400 p-3 rounded my-5 mx-3">
          <div> scramble: {scramble}</div>
          <div tw="flex gap-x-1 w-max">
            {LL['edge execution']()}:
            {edgeSolution?.map((char) => {
              const row = getEdges(numericNumbering).findIndex((edges) =>
                edges.includes(char)
              );
              if (row === -1) {
                return '';
              }
              const index = numericNumbering[row].findIndex(
                (cubelet, index) => cubelet === char && isEdge(index)
              );
              return (
                <span
                  key={char}
                  tw="odd:text-black even:text-blue-600 dark:odd:text-white dark:even:text-gray-400"
                >
                  {numbering[row][index]}
                </span>
              );
            })}
          </div>
          <div tw="flex gap-x-1 w-max">
            {LL['corner execution']()}:
            {cornerSolution?.map((char) => {
              const row = getCorners(numericNumbering).findIndex((corners) =>
                corners.includes(char)
              );
              if (row === -1) {
                return '';
              }
              const index = numericNumbering[row].findIndex(
                (cubelet, index) => cubelet === char && isCorner(index)
              );
              return (
                <span
                  key={char}
                  tw="odd:text-black even:text-blue-600 dark:odd:text-white dark:even:text-gray-400"
                >
                  {numbering[row][index]}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const ExecutionPage: VFC = () => {
  useTitle('Practice execution of blindfolded method');

  const [numbering, setNumbering] = useStoragedState<Numbering>(
    withPrefix('numbering'),
    numberingPresets[0]
  );
  const [scene, setScene] = useState<'numberingSetting' | 'practice'>(
    'practice'
  );
  return scene === 'practice' ? (
    <PracticeMode
      numbering={numbering}
      onNumberingSettingClick={() => setScene('numberingSetting')}
    />
  ) : scene === 'numberingSetting' ? (
    <NumberingSettingMode
      currentNumbering={numbering}
      onFinish={(newNumbering) => {
        setNumbering(newNumbering);
        setScene('practice');
      }}
      onCancel={() => setScene('practice')}
    />
  ) : null;
};
