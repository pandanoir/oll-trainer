import { faCheck, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cube, { Direction } from '@pandanoir/rubikscube';
import {
  VFC,
  PropsWithChildren,
  DetailedHTMLProps,
  HTMLAttributes,
  useState,
  useMemo,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import tw, { css } from 'twin.macro';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { ToggleButton } from '../components/common/ToggleButton';
import { useInput } from '../utils/hooks/useInput';
import { useTitle } from '../utils/hooks/useTitle';
import { noop } from '../utils/noop';

const Face: VFC<
  PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >
> = ({ className, children }) => (
  <div
    className={className}
    css={[
      tw`absolute inset-0 grid grid-cols-3 gap-1 bg-gray-700 border-2 border-gray-700`,
    ]}
  >
    {children}
  </div>
);
const WhiteCubelet = () => <div tw="bg-gray-50" />;
const GreenCubelet = () => <div tw="bg-green-500" />;
const RedCubelet = () => <div tw="bg-red-600" />;
const BlueCubelet = () => <div tw="bg-blue-500" />;
const OrangeCubelet = () => <div tw="bg-orange-500" />;
const YellowCubelet = () => <div tw="bg-yellow-300" />;
const BlackCubelet = () => <div tw="bg-gray-800" />;

const CubeImage: VFC<{ cube: Cube }> = ({ cube }) => {
  const color2Cubelet = (colors: string[]) =>
    colors.map((color, index) => {
      if (color === 'W') {
        return <WhiteCubelet key={index} />;
      }
      if (color === 'Y') {
        return <YellowCubelet key={index} />;
      }
      if (color === 'G') {
        return <GreenCubelet key={index} />;
      }
      if (color === 'B') {
        return <BlueCubelet key={index} />;
      }
      if (color === 'R') {
        return <RedCubelet key={index} />;
      }
      if (color === 'O') {
        return <OrangeCubelet key={index} />;
      }
      return <BlackCubelet key={index} />;
    });
  return (
    <div
      css={[
        tw`relative`,
        css`
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          transform: rotateX(-30deg) rotateY(-30deg);
        `,
      ]}
    >
      <Face css="transform: rotateX(90deg) translateZ(50px);">
        {color2Cubelet(cube.face.U)}
      </Face>
      <Face css="transform: rotateX(90deg) translateZ(-50px);">
        {color2Cubelet(cube.face.D)}
      </Face>
      <Face css="transform: rotateY(90deg) translateZ(50px);">
        {color2Cubelet(cube.face.R)}
      </Face>
      <Face css="transform: rotateY(90deg) translateZ(-50px);">
        {color2Cubelet(cube.face.L)}
      </Face>
      <Face css="transform: translateZ(50px);">
        {color2Cubelet(cube.face.F)}
      </Face>
      <Face css="transform: translateZ(-50px);">
        {color2Cubelet(cube.face.B)}
      </Face>
    </div>
  );
};

const patterns = [
  { scramble: `y L' U L y' U' R U'2 R' U' R U'2 R'`, answer: false },
  { scramble: `y L' U' L y' U R U R' U'`, answer: false },
  { scramble: `R U R' y U' L' U' L U y'`, answer: true },
  { scramble: `R U' R' U R U' R' U R U' R'`, answer: true },
  { scramble: `y L' U' L y' U' R U R'`, answer: false },
  { scramble: `y L' U' L U'2 L' U L U' L' U' L y'`, answer: true },
  { scramble: `R U R' U'2 R U' R' U R U R'`, answer: true },
  { scramble: `R U' R' y U L' U' L U' L' U' L y'`, answer: false },
  { scramble: `y L' U L y' U' R U R' U R U R'`, answer: false },
  { scramble: `y L' U' L U L' U' L y'`, answer: false },
  { scramble: `R U R' U' R U R'`, answer: true },
  { scramble: `R U' R' U R U' R'`, answer: true },
  { scramble: `y L' U L U' L' U L y'`, answer: false },
  { scramble: `y L' U' L U'2 L' U' L U' y'`, answer: true },
  { scramble: `R U R' U'2 R U R' U`, answer: true },
  { scramble: `R U' R' y U L' U L U' y'`, answer: false },
  { scramble: `y L' U L y' U' R U' R' U`, answer: false },
  { scramble: `y L' U' L U y'`, answer: false },
  { scramble: `R U R' U'`, answer: true },
  { scramble: `R U' R' y U L' U'2 L U' y'`, answer: true },
  { scramble: `y L' U L y' U' R U'2 R' U`, answer: false },
  { scramble: `y L' U L y' U'2 R U R'`, answer: false },
  { scramble: `R U' R' y U'2 L' U' L y'`, answer: true },
  { scramble: `R U' R' U' R U R' U`, answer: true },
  { scramble: `y L' U L U L' U' L U' y'`, answer: false },
  { scramble: `R U R' U' R U R' U R U R' U'`, answer: true },
  { scramble: `y L' U' L U L' U' L U' L' U' L U y'`, answer: false },
  { scramble: `y L' U L U' L' U'2 L y'`, answer: false },
  { scramble: `R U' R' U R U'2 R'`, answer: true },
  { scramble: `y L' U' L U'2 L' U L U' y'`, answer: false },
  { scramble: `R U R' U'2 R U' R' U`, answer: true },
  { scramble: `R U' R' y U L' U' L U' y'`, answer: true },
  { scramble: `y L' U L y' U' R U R' U`, answer: false },
  { scramble: `y L' U' L U'2 L' U'2 L U' y'`, answer: false },
  { scramble: `R U R' U'2 R U'2 R' U`, answer: true },
  { scramble: `R U' R'`, answer: true },
  { scramble: `y L' U L y'`, answer: false },
  { scramble: `y L' U' L U L' U'2 L U y'`, answer: false },
  { scramble: `R U R' U' R U'2 R' U'`, answer: true },
  { scramble: `R U R' U' R U' R' U'2`, answer: true },
  { scramble: `y L' U' L U L' U L U'2 y'`, answer: false },
];

const QUESTION_SCENE = 'QUESTION_SCENE';
const CORRECT_SCENE = 'CORRECT_SCENE';
const INCORRECT_SCENE = 'INCORRECT_SCENE';
type Scene =
  | typeof QUESTION_SCENE
  | typeof CORRECT_SCENE
  | typeof INCORRECT_SCENE;

export const EoQuizPage = () => {
  useTitle('Eo quiz');
  const [id, setId] = useState((Math.random() * patterns.length) | 0);
  const { value: crossColor, onChange: onCrossColorChange } = useInput('Y');
  const [randomizes, setRandomizes] = useState(false);
  const [isFullColor, setIsFullColor] = useState(false);
  const cube = useMemo(() => {
    const fullColor = {
      U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
      R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    };
    const limimtedColor = {
      U: ['', '', '', '', '', '', '', '', ''],
      F: ['', '', '', ...fullColor.F.slice(3)],
      R: ['', '', '', ...fullColor.R.slice(3)],
      B: ['', '', '', '', '', '', '', '', ''],
      L: ['', '', '', '', '', '', '', '', ''],
      D: fullColor.D.slice(),
    };
    const cube = new Cube(fullColor);
    if (crossColor === 'W') {
      cube.rotate('x2');
    } else if (crossColor === 'O') {
      cube.rotate('y', 'x');
    } else if (crossColor === 'R') {
      cube.rotate(`y'`, 'x');
    } else if (crossColor === 'B') {
      cube.rotate('x');
    } else if (crossColor === 'G') {
      cube.rotate('y2', 'x');
    }

    if (randomizes) {
      for (let i = (Math.random() * 4) | 0; i > 0; --i) {
        cube.rotate('y');
      }
    }

    const scrambledCube = cube.rotate(
      ...(patterns[id].scramble.split(' ') as Direction[])
    );
    if (isFullColor) {
      return scrambledCube;
    }
    const limitedColorCube = new Cube(limimtedColor).rotate(
      ...(patterns[id].scramble.split(' ') as Direction[])
    );

    // 「色を抜いた状態で回したときに色がついている箇所」だけ色を残す
    for (const key of Object.keys(
      scrambledCube.face
    ) as (keyof typeof scrambledCube.face)[]) {
      for (let i = 0; i < scrambledCube.face[key].length; i++) {
        if (limitedColorCube.face[key][i] === '') {
          scrambledCube.face[key][i] = '';
        }
      }
    }
    return scrambledCube;
  }, [crossColor, id, isFullColor, randomizes]);

  const answerQuestion = (answer: boolean) => {
    setScene(patterns[id].answer === answer ? CORRECT_SCENE : INCORRECT_SCENE);
    setTimeout(() => {
      setScene(QUESTION_SCENE);
      setId(
        (id) =>
          (id + 1 + ((Math.random() * (patterns.length - 1)) | 0)) %
          patterns.length
      );
    }, 500);
  };
  const onCheckClick = () => {
    answerQuestion(true);
  };
  const onTimesClick = () => {
    answerQuestion(false);
  };
  const [scene, setScene] = useState<Scene>(QUESTION_SCENE);
  useHotkeys(
    'right,left',
    (event) => {
      if (event.key === 'ArrowLeft') {
        answerQuestion(true);
      } else if (event.key === 'ArrowRight') {
        answerQuestion(false);
      }
    },
    [answerQuestion]
  );

  return (
    <div tw="w-full grid place-items-center space-y-3">
      <div tw="text-2xl font-bold">Eo Quiz</div>
      <div tw="h-64 w-64 grid place-items-center">
        <CubeImage cube={cube} />
      </div>
      <div>
        {scene === CORRECT_SCENE ? (
          '正解！'
        ) : scene === INCORRECT_SCENE ? (
          '不正解…'
        ) : (
          <br />
        )}
      </div>
      <div tw="flex space-x-1">
        <SecondaryButton
          onClick={scene === QUESTION_SCENE ? onCheckClick : noop}
        >
          <FontAwesomeIcon icon={faCheck} />
          合っている
        </SecondaryButton>
        <SecondaryButton
          onClick={scene === QUESTION_SCENE ? onTimesClick : noop}
        >
          <FontAwesomeIcon icon={faTimes} />
          合っていない
        </SecondaryButton>
      </div>
      <div>矢印キー(←/→)でも解答可能</div>
      <details tw="w-full ml-10 flex flex-col">
        <summary>
          <FontAwesomeIcon icon={faCog} />
          options
        </summary>
        <span>
          <ToggleButton checked={randomizes} onChange={setRandomizes}>
            側面をランダムに選ぶ
          </ToggleButton>
        </span>
        <span>
          <ToggleButton checked={isFullColor} onChange={setIsFullColor}>
            フルカラーにする
          </ToggleButton>
        </span>
        <span>
          クロス色:{' '}
          <select
            value={crossColor}
            onChange={onCrossColorChange}
            tw="bg-transparent"
          >
            <option tw="text-black" value="W">
              white
            </option>
            <option tw="text-black" value="G">
              green
            </option>
            <option tw="text-black" value="R">
              red
            </option>
            <option tw="text-black" value="B">
              blue
            </option>
            <option tw="text-black" value="O">
              orange
            </option>
            <option tw="text-black" value="Y">
              yellow
            </option>
            );
          </select>
        </span>
      </details>
      <div tw="px-5">
        説明:
        <br />
        F2L のエッジの向き(EO)が合っているかどうか当てるクイズアプリです。
        <br />
        基本的なF2Lのみ出題しています。
      </div>
    </div>
  );
};
