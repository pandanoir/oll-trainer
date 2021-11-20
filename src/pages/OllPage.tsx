import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC } from 'react';
import { useTitle } from 'react-use';
import tw from 'twin.macro';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Solve } from '../components/Solve';
import { faces, rotate, CubeFace as CubeFaceType } from '../utils';
import { useFace } from '../utils/hooks/useFace';
import '../index.css';

const CubeFace: VFC<{
  cubeStatus: CubeFaceType;
  toggleCube: (index: number) => void;
}> = ({ cubeStatus, toggleCube }) => {
  return (
    <div tw="mx-auto border border-gray-800 grid grid-cols-3 max-w-max">
      {cubeStatus.map((isChecked, index) => (
        <div
          key={index}
          onClick={() => {
            toggleCube(index);
          }}
          css={[
            isChecked ? tw`bg-yellow-200` : tw`bg-gray-600`,
            tw`w-24 h-24 border border-gray-800 cursor-pointer`,
          ]}
        />
      ))}
    </div>
  );
};

export const OllPage: VFC = () => {
  useTitle('OLL');
  const { cubeStatus, toggleCube, clearCube } = useFace();
  return (
    <div tw="flex flex-col space-y-3 items-center">
      <CubeFace cubeStatus={cubeStatus} toggleCube={toggleCube} />
      <PrimaryButton tw="w-max" onClick={clearCube}>
        clear face
      </PrimaryButton>
      <div tw="flex overflow-x-auto space-x-3">
        {faces.map((_face, index) => {
          for (let face = _face, j = 0; j < 4; ++j, face = rotate(face)) {
            if ([...Array(9).keys()].every((i) => cubeStatus[i] === face[i])) {
              return (
                <div tw="flex-shrink-0 px-12 border-l-4 border-gray-300 first:border-0">
                  <Solve index={index} />
                  <a
                    href={`http://algdb.net/puzzle/333/oll/oll${index + 1}`}
                    tw="underline text-blue-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AlgDb.net で他のやり方を調べる{' '}
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
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
