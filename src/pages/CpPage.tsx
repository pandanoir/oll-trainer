import { ChangeEvent, useCallback, useEffect, useState, VFC } from 'react';
import { useLocation } from 'react-router-dom';
import RubiksCube, { Rotation } from '@pandanoir/rubikscube';
import { calculateScramble } from '../utils';

type Color = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'white';
type TopFace = [
  [Color, null, Color],
  [Color, Color, null, Color, Color],
  [null, null, 'yellow', null, null],
  [Color, Color, null, Color, Color],
  [Color, null, Color]
];
const cpList: Record<string, TopFace[]> = {
  skip: [
    [
      ['green', null, 'green'],
      ['orange', 'yellow', null, 'yellow', 'red'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],

    [
      ['green', null, 'blue'],
      ['orange', 'yellow', null, 'yellow', 'orange'],
      [null, null, 'yellow', null, null],
      ['red', 'yellow', null, 'yellow', 'red'],
      ['green', null, 'blue'],
    ],

    [
      ['green', null, 'green'],
      ['orange', 'yellow', null, 'yellow', 'red'],
      [null, null, 'yellow', null, null],
      ['blue', 'yellow', null, 'yellow', 'blue'],
      ['red', null, 'orange'],
    ],
    [
      ['red', null, 'orange'],
      ['green', 'yellow', null, 'yellow', 'green'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],
    [
      ['orange', null, 'green'],
      ['blue', 'yellow', null, 'yellow', 'red'],
      [null, null, 'yellow', null, null],
      ['green', 'yellow', null, 'yellow', 'red'],
      ['orange', null, 'blue'],
    ],
    [
      ['green', null, 'red'],
      ['orange', 'yellow', null, 'yellow', 'blue'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'green'],
      ['blue', null, 'red'],
    ],
  ],
  HCaswe: [
    [
      ['orange', null, 'red'],
      ['yellow', 'green', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'blue', 'yellow'],
      ['orange', null, 'red'],
    ],
    [
      ['orange', null, 'orange'],
      ['yellow', 'green', null, 'blue', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'green', null, 'blue', 'yellow'],
      ['red', null, 'red'],
    ],
    [
      ['orange', null, 'red'],
      ['yellow', 'green', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'red', null, 'orange', 'yellow'],
      ['blue', null, 'blue'],
    ],
    [
      ['green', null, 'green'],
      ['yellow', 'red', null, 'orange', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'blue', 'yellow'],
      ['orange', null, 'green'],
    ],
    [
      ['blue', null, 'red'],
      ['yellow', 'orange', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'orange', null, 'blue', 'yellow'],
      ['green', null, 'red'],
    ],
    [
      ['orange', null, 'blue'],
      ['yellow', 'green', null, 'red', 'yellow'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'red', 'yellow'],
      ['orange', null, 'green'],
    ],
  ],
  PiCase: [
    [
      ['orange', null, 'yellow'],
      ['yellow', 'green', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'red', 'blue'],
      ['orange', null, 'yellow'],
    ],
    [
      ['orange', null, 'yellow'],
      ['yellow', 'green', null, 'orange', 'blue'],
      [null, null, 'yellow', null, null],
      ['yellow', 'green', null, 'red', 'blue'],
      ['red', null, 'yellow'],
    ],
    [
      ['orange', null, 'yellow'],
      ['yellow', 'green', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['yellow', 'red', null, 'blue', 'orange'],
      ['blue', null, 'yellow'],
    ],
    [
      ['green', null, 'yellow'],
      ['yellow', 'red', null, 'green', 'orange'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'red', 'blue'],
      ['orange', null, 'yellow'],
    ],
    [
      ['blue', null, 'yellow'],
      ['yellow', 'orange', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['yellow', 'orange', null, 'red', 'blue'],
      ['green', null, 'yellow'],
    ],
    [
      ['orange', null, 'yellow'],
      ['yellow', 'green', null, 'blue', 'red'],
      [null, null, 'yellow', null, null],
      ['yellow', 'blue', null, 'green', 'red'],
      ['orange', null, 'yellow'],
    ],
  ],
  TCase: [
    [
      ['orange', null, 'red'],
      ['yellow', 'green', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],
    [
      ['orange', null, 'orange'],
      ['yellow', 'green', null, 'blue', 'yellow'],
      [null, null, 'yellow', null, null],
      ['red', 'yellow', null, 'yellow', 'red'],
      ['green', null, 'blue'],
    ],
    [
      ['orange', null, 'red'],
      ['yellow', 'green', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['blue', 'yellow', null, 'yellow', 'blue'],
      ['red', null, 'orange'],
    ],

    [
      ['green', null, 'green'],
      ['yellow', 'red', null, 'orange', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],
    [
      ['blue', null, 'red'],
      ['yellow', 'orange', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['green', 'yellow', null, 'yellow', 'red'],
      ['orange', null, 'blue'],
    ],
    [
      ['orange', null, 'blue'],
      ['yellow', 'green', null, 'red', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'green'],
      ['blue', null, 'red'],
    ],
  ],
  UCase: [
    [
      ['yellow', null, 'yellow'],
      ['green', 'orange', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],
    [
      ['yellow', null, 'yellow'],
      ['green', 'orange', null, 'orange', 'blue'],
      [null, null, 'yellow', null, null],
      ['red', 'yellow', null, 'yellow', 'red'],
      ['green', null, 'blue'],
    ],
    [
      ['yellow', null, 'yellow'],
      ['green', 'orange', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['blue', 'yellow', null, 'yellow', 'blue'],
      ['red', null, 'orange'],
    ],
    [
      ['yellow', null, 'yellow'],
      ['red', 'green', null, 'green', 'orange'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'red'],
      ['blue', null, 'blue'],
    ],
    [
      ['yellow', null, 'yellow'],
      ['orange', 'blue', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['green', 'yellow', null, 'yellow', 'red'],
      ['orange', null, 'blue'],
    ],
    [
      ['yellow', null, 'yellow'],
      ['green', 'orange', null, 'blue', 'red'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'yellow', 'green'],
      ['blue', null, 'red'],
    ],
  ],
  LCase: [
    [
      ['green', null, 'red'],
      ['orange', 'yellow', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'yellow', 'red'],
      ['yellow', null, 'blue'],
    ],
    [
      ['green', null, 'orange'],
      ['orange', 'yellow', null, 'blue', 'yellow'],
      [null, null, 'yellow', null, null],
      ['green', 'red', null, 'yellow', 'red'],
      ['yellow', null, 'blue'],
    ],
    [
      ['green', null, 'red'],
      ['orange', 'yellow', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['red', 'blue', null, 'yellow', 'blue'],
      ['yellow', null, 'orange'],
    ],
    [
      ['red', null, 'green'],
      ['green', 'yellow', null, 'orange', 'yellow'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'yellow', 'red'],
      ['yellow', null, 'blue'],
    ],
    [
      ['orange', null, 'red'],
      ['blue', 'yellow', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'green', null, 'yellow', 'red'],
      ['yellow', null, 'blue'],
    ],
    [
      ['green', null, 'blue'],
      ['orange', 'yellow', null, 'red', 'yellow'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'yellow', 'green'],
      ['yellow', null, 'red'],
    ],
  ],
  SuneCase: [
    [
      ['yellow', null, 'red'],
      ['green', 'orange', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'red', 'blue'],
      ['blue', null, 'yellow'],
    ],
    [
      ['yellow', null, 'orange'],
      ['green', 'orange', null, 'blue', 'yellow'],
      [null, null, 'yellow', null, null],
      ['red', 'yellow', null, 'red', 'blue'],
      ['green', null, 'yellow'],
    ],
    [
      ['yellow', null, 'red'],
      ['green', 'orange', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['blue', 'yellow', null, 'blue', 'orange'],
      ['red', null, 'yellow'],
    ],
    [
      ['yellow', null, 'green'],
      ['red', 'green', null, 'orange', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'red', 'blue'],
      ['blue', null, 'yellow'],
    ],
    [
      ['yellow', null, 'red'],
      ['orange', 'blue', null, 'green', 'yellow'],
      [null, null, 'yellow', null, null],
      ['green', 'yellow', null, 'red', 'blue'],
      ['orange', null, 'yellow'],
    ],
    [
      ['yellow', null, 'blue'],
      ['green', 'orange', null, 'red', 'yellow'],
      [null, null, 'yellow', null, null],
      ['orange', 'yellow', null, 'green', 'red'],
      ['blue', null, 'yellow'],
    ],
  ],
  AntisuneCase: [
    [
      ['green', null, 'yellow'],
      ['orange', 'yellow', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'blue', 'yellow'],
      ['yellow', null, 'red'],
    ],
    [
      ['green', null, 'yellow'],
      ['orange', 'yellow', null, 'orange', 'blue'],
      [null, null, 'yellow', null, null],
      ['green', 'red', null, 'blue', 'yellow'],
      ['yellow', null, 'red'],
    ],
    [
      ['green', null, 'yellow'],
      ['orange', 'yellow', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['red', 'blue', null, 'orange', 'yellow'],
      ['yellow', null, 'blue'],
    ],
    [
      ['red', null, 'yellow'],
      ['green', 'yellow', null, 'green', 'orange'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'blue', 'yellow'],
      ['yellow', null, 'red'],
    ],
    [
      ['orange', null, 'yellow'],
      ['blue', 'yellow', null, 'red', 'green'],
      [null, null, 'yellow', null, null],
      ['orange', 'green', null, 'blue', 'yellow'],
      ['yellow', null, 'red'],
    ],
    [
      ['green', null, 'yellow'],
      ['orange', 'yellow', null, 'blue', 'red'],
      [null, null, 'yellow', null, null],
      ['blue', 'orange', null, 'red', 'yellow'],
      ['yellow', null, 'green'],
    ],
  ],
};

const Cube: VFC<{ color: string; onClick?: () => void }> = ({
  color,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{ width: 30, height: 30, background: color }}
  ></div>
);
const EmptyCube: VFC = () => {
  return <div style={{ width: 30, height: 30, background: '#333' }}></div>;
};
const CubeFace: VFC<{ cube: TopFace }> = ({ cube }) => {
  return (
    <div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div
          key={row}
          style={{
            width: 150,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {cube[row].map((color: Color | null, column: number) =>
            color === null ? <EmptyCube /> : <Cube key={column} color={color} />
          )}
        </div>
      ))}
    </div>
  );
};
const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    []
  );

  return {
    value,
    onChange,
  };
};
const useQuery = () => new URLSearchParams(useLocation().search);

export const CpPage: VFC = () => {
  const query = useQuery();
  const { value, onChange } = useInput(query.get('solve') || '');
  const [topFaceType, setTopFaceType] = useState<null | string>(null);
  const [cpIndex, setCpIndex] = useState(0);
  useEffect(() => {
    setTopFaceType(null);
    setCpIndex(0);
    try {
      const sides: Color[] = ['orange', 'blue', 'red', 'green'];
      let found = false;
      for (let i = 0; i < 4 && !found; ++i) {
        const cube = new RubiksCube({
          U: Array(9).fill('yellow'),
          F: Array(9).fill(sides[i]),
          R: Array(9).fill(sides[(i + 1) % 4]),
          B: Array(9).fill(sides[(i + 2) % 4]),
          L: Array(9).fill(sides[(i + 3) % 4]),
          D: Array(9).fill('white'),
        }).rotate(...(calculateScramble(value).split(' ') as Rotation[]));

        const UFace = [
          [cube.face.B[6], null, cube.face.B[8]],
          [
            cube.face.L[0],
            cube.face.U[0],
            null,
            cube.face.U[2],
            cube.face.R[2],
          ],
          [null, null, 'yellow', null, null],
          [
            cube.face.L[2],
            cube.face.U[6],
            null,
            cube.face.U[8],
            cube.face.R[0],
          ],
          [cube.face.F[0], null, cube.face.F[2]],
        ] as TopFace;
        const rotate = (face: TopFace): TopFace => {
          return [
            [face[3][0], face[2][0], face[1][0]],
            [face[4][0], face[3][1], face[2][1], face[1][1], face[0][0]],
            [face[4][1], face[3][2], face[2][2], face[1][2], face[0][1]],
            [face[4][2], face[3][3], face[2][3], face[1][3], face[0][2]],
            [face[3][4], face[2][4], face[1][4]],
          ];
        };
        for (const key of Object.keys(cpList)) {
          for (let i = 0; i < 4; ++i) {
            const cpIndex = cpList[key].findIndex((_cube) => {
              let cube = _cube;
              for (let j = 0; j < i; ++j) {
                cube = rotate(cube);
              }
              for (let i = 0; i < cube.length; ++i) {
                for (let j = 0; j < cube[i].length; ++j) {
                  if (cube[i][j] !== UFace[i][j]) {
                    return false;
                  }
                }
              }
              return true;
            });
            if (cpIndex !== -1) {
              setTopFaceType(key);
              setCpIndex(cpIndex);
              found = true;
              break;
            }
          }
        }
      }
    } catch {}
  }, [value]);
  return (
    <div>
      <h1>CP判断用</h1>
      <p>OLL の手順を入力するとそれに対応するCPを表示します。</p>
      <input
        type="text"
        value={value}
        className="border rounded-md mt-1 block w-full"
        onChange={onChange}
      />
      {topFaceType && (
        <>
          逆手順: {calculateScramble(value)}
          <br />
          無交換(Skip,U,H,Z-perm): {topFaceType}{' '}
          {
            ['no-swap', 'diagonal', 'F-swap', 'B-swap', 'L-swap', 'R-swap'][
              cpIndex
            ]
          }
          <CubeFace cube={cpList[topFaceType][cpIndex]} />
          <br />
          対角交換(E,N,V,Y-perm): {topFaceType}{' '}
          {
            ['no-swap', 'diagonal', 'F-swap', 'B-swap', 'L-swap', 'R-swap'][
              cpIndex % 2 === 0 ? cpIndex + 1 : cpIndex - 1
            ]
          }
          <CubeFace
            cube={
              cpList[topFaceType][cpIndex % 2 === 0 ? cpIndex + 1 : cpIndex - 1]
            }
          />
          <br />
          隣接交換(A,F,G,J,R,T-perm): その他
        </>
      )}
    </div>
  );
};
