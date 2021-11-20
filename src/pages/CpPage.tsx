import { useEffect, useState, VFC } from 'react';
import 'twin.macro';
import useTitle from 'react-use/lib/useTitle';
import { TopFace, Color, cpList } from '../data/cpList';
import { calculateScramble } from '../utils';
import {
  checkCpPattern,
  cpSwapPatterns,
  getCompanionSwap,
} from '../utils/checkCpPattern';
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
const EmptyCube: VFC = () => (
  <div style={{ width: 30, height: 30, background: '#333' }}></div>
);
const CubeFace: VFC<{ cube: TopFace }> = ({ cube }) => (
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
          color === null ? (
            <EmptyCube key={column} />
          ) : (
            <Cube key={column} color={color} />
          )
        )}
      </div>
    ))}
  </div>
);

export const CpPage: VFC = () => {
  useTitle('Cp check');
  const query = useQuery();
  const { value, onChange } = useInput(query.get('solve') || '');
  const [topFaceType, setTopFaceType] = useState<null | string>(null);
  const [cpIndex, setCpIndex] = useState(0);
  useEffect(() => {
    try {
      const res = checkCpPattern(value);
      if (res) {
        setTopFaceType(res[0]);
        setCpIndex(res[1]);
      }
    } catch {
      setTopFaceType(null);
      setCpIndex(0);
    }
  }, [value]);
  return (
    <div>
      <h1>CP(Corner PLL)判断用</h1>
      <p>OLL の手順を入力するとそれに対応するCPを表示します。</p>
      <div tw="flex">
        <input
          type="text"
          value={value}
          tw="border rounded-md mt-1 mx-2 block flex-grow"
          onChange={onChange}
        />
      </div>
      {topFaceType && (
        <>
          逆手順: {calculateScramble(value)}
          <br />
          無交換(Skip,U,H,Z-perm): {topFaceType} {cpSwapPatterns[cpIndex]}
          <CubeFace cube={cpList[topFaceType][cpIndex]} />
          <br />
          対角交換(E,N,V,Y-perm): {topFaceType}{' '}
          {cpSwapPatterns[getCompanionSwap(cpIndex)]}
          <CubeFace cube={cpList[topFaceType][getCompanionSwap(cpIndex)]} />
          <br />
          隣接交換(A,F,G,J,R,T-perm): その他
        </>
      )}
    </div>
  );
};
