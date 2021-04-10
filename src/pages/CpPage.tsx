import { useEffect, useState, VFC } from 'react';
import RubiksCube, { Rotation } from '@pandanoir/rubikscube';
import { calculateScramble } from '../utils';
import { TopFace, Color, cpList } from '../data/cpList';
import { useInput } from '../utils/hooks/useInput';
import { useQuery } from '../utils/hooks/useQuery';

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
