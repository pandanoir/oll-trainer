import { Direction } from '@pandanoir/rubikscube';
import { VFC, useMemo, useState, useCallback, useEffect } from 'react';
import Scrambo from 'scrambo';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { SecondaryButton } from '../../../components/common/SecondaryButton';
import { useI18nContext } from '../../../i18n/i18n-react';
import { useInputWithStorage } from '../../../utils/hooks/useInput';
import { withPrefix } from '../../../utils/withPrefix';
import { isCorner, solveCorner } from '../utils/solveCorner';
import { isEdge, solveEdge } from '../utils/solveEdge';
import { NetDrawing } from './NetDrawing';
import { Numbering, FaceColor } from './types';
import 'twin.macro';

const getCorners = (numbering: string[][]) =>
  numbering.map((row) => row.filter((_, index) => isCorner(index)));
const getEdges = (numbering: string[][]) =>
  numbering.map((row) => row.filter((_, index) => isEdge(index)));

const numericNumbering = [
  ['0', '0', '12', '4', ' ', '8', '3', '3', '15'],
  ['16', '16', '19', '17', ' ', '19', '17', '18', '18'],
  ['7', '15', '11', '7', ' ', '11', '6', '14', '10'],
  ['23', '20', '20', '23', ' ', '21', '22', '22', '21'],
  ['2', '2', '14', '6', ' ', '10', '1', '1', '13'],
  ['5', '13', '9', '5', ' ', '9', '4', '12', '8'],
];
const mapToEdgeNumbering = (edgeSolution: string[], numbering: Numbering) =>
  edgeSolution.map((char) => {
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
  });
const mapToCornerNumbering = (cornerSolution: string[], numbering: Numbering) =>
  cornerSolution?.map((char) => {
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
  });

const isValidEdgeBuffer = (edgeBuffer: string) =>
  getEdges(numericNumbering).some((row) => row.includes(edgeBuffer));
const isValidCornerBuffer = (cornerBuffer: string) =>
  getCorners(numericNumbering).some((row) => row.includes(cornerBuffer));

export const PracticeMode: VFC<{
  numbering: Numbering;
  faceColor: FaceColor;
  onCubeSettingClick: () => void;
}> = ({ numbering, faceColor, onCubeSettingClick: onCubeSettingClick }) => {
  const { LL } = useI18nContext();
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
  }, [edgeBufferInput, numbering]);
  const cornerBuffer = useMemo(() => {
    const row = numbering.findIndex((row) =>
      row.filter((_, index) => isCorner(index)).includes(cornerBufferInput)
    );
    if (row === -1) return '';
    const index = numbering[row].findIndex(
      (char, index) => isCorner(index) && char === cornerBufferInput
    );
    return numericNumbering[row][index];
  }, [cornerBufferInput, numbering]);

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
  }, [cornerBuffer, edgeBuffer]);
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
  }, [edgeBuffer]);
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
  }, [cornerBuffer]);

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
  }, [edgeBuffer, scramble]);
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
  }, [cornerBuffer, scramble]);

  return (
    <div tw="flex flex-col gap-y-2 md:flex-row">
      <div tw="flex-1 flex flex-col gap-y-2 px-3">
        {isValidCornerBuffer(cornerBuffer) && isValidEdgeBuffer(edgeBuffer) && (
          <div tw="border border-gray-400 p-3 rounded">
            <div> scramble: {scramble}</div>
            <div tw="flex gap-x-1 w-max">
              {LL['edge execution']()}:
              {edgeSolution && mapToEdgeNumbering(edgeSolution, numbering)}
            </div>
            <div tw="flex gap-x-1 w-max">
              {LL['corner execution']()}:
              {cornerSolution &&
                mapToCornerNumbering(cornerSolution, numbering)}
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
        </PrimaryButton>
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
