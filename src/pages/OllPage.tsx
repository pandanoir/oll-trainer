import { VFC } from 'react';

import { useFace, faces, rotate, CubeFace } from '../utils';
import { Solve } from '../components/Solve';
import { Button } from '../components/Button';
import '../index.css';

const CubeFace: VFC<{
  cubeStatus: CubeFace;
  toggleCube: (index: number) => void;
}> = ({ cubeStatus, toggleCube }) => {
  return (
    <div className="mx-auto border border-gray-800 grid grid-cols-3 max-w-max">
      {cubeStatus.map((isChecked, index) => (
        <div
          key={index}
          onClick={() => {
            toggleCube(index);
          }}
          className={`${
            isChecked ? 'bg-yellow-200' : 'bg-gray-600'
          } w-24 h-24 border border-gray-800`}
        />
      ))}
    </div>
  );
};

export const OllPage: VFC = () => {
  const { cubeStatus, toggleCube, clearCube } = useFace();
  return (
    <div>
      <CubeFace cubeStatus={cubeStatus} toggleCube={toggleCube} />
      <Button onClick={clearCube}>clear face</Button>
      <div className="flex overflow-x-scroll gap-3">
        {faces.map((_face, index) => {
          for (let face = _face, j = 0; j < 4; ++j, face = rotate(face)) {
            if ([...Array(9).keys()].every((i) => cubeStatus[i] === face[i])) {
              return (
                <div className="flex-shrink-0 px-12 border-l-4 border-gray-300 first:border-0">
                  <Solve index={index} />
                  <a
                    href={`http://algdb.net/puzzle/333/oll/oll${index + 1}`}
                    className="underline text-blue-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AlgDb.net で他のやり方を調べる
                  </a>
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};
