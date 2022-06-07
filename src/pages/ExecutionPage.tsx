import { useState, VFC } from 'react';
import useTitle from 'react-use/lib/useTitle';
import {
  CubeSettingMode,
  numberingPresets,
} from '../features/executionPractice/components/CubeSettingMode';
import { PracticeMode } from '../features/executionPractice/components/PracticeMode';
import {
  FaceColor,
  Numbering,
} from '../features/executionPractice/components/types';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { withPrefix } from '../utils/withPrefix';

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
