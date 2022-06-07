import Cube, { CubeType, Direction } from '@pandanoir/rubikscube';
import immer from 'immer';
import {
  ComponentProps,
  forwardRef,
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
const Cubelet = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof BaseCubelet> & {
    selected?: boolean;
    color: 'white' | 'green' | 'red' | 'blue' | 'orange' | 'yellow';
  }
>(function Cubelet({ color, ...props }, ref) {
  return color === 'white' ? (
    <WhiteCubelet {...props} ref={ref} />
  ) : color === 'green' ? (
    <GreenCubelet {...props} ref={ref} />
  ) : color === 'red' ? (
    <RedCubelet {...props} ref={ref} />
  ) : color === 'blue' ? (
    <BlueCubelet {...props} ref={ref} />
  ) : color === 'orange' ? (
    <OrangeCubelet {...props} ref={ref} />
  ) : color === 'yellow' ? (
    <YellowCubelet {...props} ref={ref} />
  ) : null;
});

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
  faceColor: {
    [k in 'U' | 'L' | 'F' | 'R' | 'D' | 'B']:
      | 'white'
      | 'green'
      | 'red'
      | 'blue'
      | 'orange'
      | 'yellow';
  };
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
  faceColor,
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
            <Cubelet
              color={faceColor.U}
              key={index}
              selected={isSelected('U', index)}
            >
              {char}
            </Cubelet>
          ))}
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 6)}
          >
            {numbering[0][6]}
          </Cubelet>
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 7)}
          >
            {numbering[0][7]}
          </Cubelet>
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 8)}
          >
            {numbering[0][8]}
          </Cubelet>
        </Face>
      </div>
      <div tw="flex border-t border-gray-800">
        <Face tw="border-l">
          {numbering[1].map((char, index) => (
            <Cubelet
              color={faceColor.L}
              key={index}
              selected={isSelected('L', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
        <Face>
          {numbering[2].map((char, index) => (
            <Cubelet
              color={faceColor.F}
              key={index}
              selected={isSelected('F', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
        <Face>
          {numbering[3].map((char, index) => (
            <Cubelet
              color={faceColor.R}
              key={index}
              selected={isSelected('R', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[4].map((char, index) => (
            <Cubelet
              color={faceColor.D}
              key={index}
              selected={isSelected('D', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[5].map((char, index) => (
            <Cubelet
              color={faceColor.B}
              key={index}
              selected={isSelected('B', index)}
            >
              {char}
            </Cubelet>
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
type FaceColor = {
  [key in 'U' | 'L' | 'F' | 'R' | 'D' | 'B']:
    | 'white'
    | 'green'
    | 'red'
    | 'blue'
    | 'orange'
    | 'yellow';
};
const oppositeColorDict = {
  white: 'yellow',
  green: 'blue',
  red: 'orange',
  blue: 'green',
  orange: 'red',
  yellow: 'white',
} as const;
const getFaceColor = (
  u: FaceColor['U'],
  f: FaceColor['F']
): FaceColor | null => {
  const [normalizedU, normalizedF] =
    u === 'yellow' || u === 'blue' || u === 'orange'
      ? [oppositeColorDict[u], oppositeColorDict[f]]
      : [u, f]; // これで normalizedU は白緑赤のいずれかになった
  const l = (
    {
      white: {
        green: 'orange',
        red: 'green',
        blue: 'red',
        orange: 'blue',
      },
      green: {
        white: 'red',
        red: 'yellow',
        yellow: 'orange',
        orange: 'white',
      },
      red: {
        white: 'blue',
        blue: 'yellow',
        yellow: 'green',
        green: 'white',
      },
    } as const
  )[normalizedU][normalizedF];
  if (typeof l === 'undefined') {
    return null;
  }
  return {
    U: u,
    L: l,
    F: f,
    R: oppositeColorDict[l],
    D: oppositeColorDict[u],
    B: oppositeColorDict[f],
  };
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
const CubeSettingMode: VFC<{
  currentNumbering: Numbering;
  currentFaceColor: FaceColor;
  onFinish: (newNumbering: Numbering, newFaceColor: FaceColor) => void;
  onCancel: () => void;
}> = ({ currentNumbering, currentFaceColor, onFinish, onCancel }) => {
  const { LL } = useI18nContext();
  const [numbering, setNumbering] = useState<Numbering>(currentNumbering);

  const updateNumbering = (face: number, index: number, newValue: string) => {
    setNumbering(
      immer((draft) => {
        draft[face][index] = newValue;
      })
    );
  };
  const [uFaceColor, setUFaceColor] = useState<FaceColor['U']>(
    currentFaceColor.U
  );
  const [fFaceColor, setFFaceColor] = useState<FaceColor['F']>(
    currentFaceColor.F
  );
  const isValidFaceColor =
    uFaceColor !== fFaceColor && oppositeColorDict[uFaceColor] !== fFaceColor;
  const faceColor: FaceColor = isValidFaceColor
    ? (getFaceColor(uFaceColor, fFaceColor) as FaceColor) // valid でない場合に null がくる想定なので assertion 使って OK
    : {
        U: 'white',
        L: 'white',
        F: 'white',
        R: 'white',
        D: 'white',
        B: 'white',
      };
  return (
    <div tw="flex flex-col gap-y-3">
      {LL['click and change labels']()}
      <div tw="w-max">
        <div tw="flex justify-center">
          <Face tw="border-t border-l">
            {numbering[0].slice(0, 6).map((char, index) => (
              <Cubelet color={faceColor.U} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(0, index, value)
                  }
                />
              </Cubelet>
            ))}
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][6]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 6, value)
                }
              />
            </Cubelet>
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][7]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 7, value)
                }
              />
            </Cubelet>
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][8]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 8, value)
                }
              />
            </Cubelet>
          </Face>
        </div>
        <div tw="flex border-t border-gray-800">
          <Face tw="border-l">
            {numbering[1].map((char, index) => (
              <Cubelet color={faceColor.L} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(1, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
          <Face>
            {numbering[2].map((char, index) => (
              <Cubelet color={faceColor.F} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(2, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
          <Face>
            {numbering[3].map((char, index) => (
              <Cubelet color={faceColor.R} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(3, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[4].map((char, index) => (
              <Cubelet color={faceColor.D} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(4, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[5].map((char, index) => (
              <Cubelet color={faceColor.B} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(5, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
      </div>
      <details>
        <summary>{LL['choose from presets']()}</summary>
        <ul tw="flex gap-x-3">
          {numberingPresets.map((preset, index) => (
            <li tw="text-center" key={index}>
              <NetDrawing numbering={preset} faceColor={faceColor} />
              <SecondaryButton onClick={() => setNumbering(preset)}>
                {LL['use this preset']()}
              </SecondaryButton>
            </li>
          ))}
        </ul>
      </details>
      <div>
        U面:{' '}
        <select
          tw="text-black"
          value={uFaceColor}
          onChange={({ target: { value } }) =>
            setUFaceColor(value as FaceColor['U'])
          }
        >
          {['white', 'orange', 'green', 'red', 'yellow', 'blue'].map(
            (color) => (
              <option key={color}>{color}</option>
            )
          )}
        </select>
        <br />
        F面:
        <select
          tw="text-black"
          value={fFaceColor}
          onChange={({ target: { value } }) =>
            setFFaceColor(value as FaceColor['F'])
          }
        >
          {['white', 'orange', 'green', 'red', 'yellow', 'blue'].map(
            (color) => (
              <option key={color}>{color}</option>
            )
          )}
        </select>
        {!isValidFaceColor && 'invalid color pattern!'}
      </div>
      <div tw="flex gap-3">
        <PrimaryButton
          disabled={!isValidFaceColor}
          onClick={() => {
            onFinish(numbering, faceColor);
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
  faceColor: FaceColor;
  onCubeSettingClick: () => void;
}> = ({ numbering, faceColor, onCubeSettingClick: onCubeSettingClick }) => {
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
    <div tw="flex flex-col gap-y-2 md:flex-row">
      <div tw="flex-1 flex flex-col gap-y-2 px-3">
        {isValidCornerBuffer(cornerBuffer) && isValidEdgeBuffer(edgeBuffer) && (
          <div tw="border border-gray-400 p-3 rounded">
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
        <PrimaryButton
          tw="w-max"
          onClick={() => {
            renewScramble();
          }}
        >
          {LL['renew scramble']()}
        </PrimaryButton>{' '}
      </div>
      <div tw="px-3 flex flex-col gap-y-2">
        <div tw="flex justify-center">
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
            faceColor={faceColor}
          />
        </div>
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
        <SecondaryButton onClick={onCubeSettingClick} tw="w-max">
          {LL['change cube setting']()}
        </SecondaryButton>
      </div>
    </div>
  );
};

export const ExecutionPage: VFC = () => {
  useTitle('Practice execution of blindfolded method');

  const [numbering, setNumbering] = useStoragedState<Numbering>(
    withPrefix('numbering'),
    numberingPresets[0]
  );
  const [faceColor, setFaceColor] = useStoragedState<FaceColor>(
    withPrefix('execution--faceColor'),
    {
      U: 'white',
      L: 'orange',
      F: 'green',
      R: 'red',
      D: 'yellow',
      B: 'blue',
    }
  );
  const [scene, setScene] = useState<'cubeSetting' | 'practice'>('practice');
  return scene === 'practice' ? (
    <PracticeMode
      numbering={numbering}
      faceColor={faceColor}
      onCubeSettingClick={() => setScene('cubeSetting')}
    />
  ) : scene === 'cubeSetting' ? (
    <CubeSettingMode
      currentNumbering={numbering}
      currentFaceColor={faceColor}
      onFinish={(newNumbering, newFaceColor) => {
        setNumbering(newNumbering);
        setFaceColor(newFaceColor);
        setScene('practice');
      }}
      onCancel={() => setScene('practice')}
    />
  ) : null;
};
