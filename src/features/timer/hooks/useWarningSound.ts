import { useEffect } from 'react';
import eightSecondsSoundUrl from '../../../sound/eightSeconds.mp3';
import twelveSecondsSoundUrl from '../../../sound/twelveSeconds.mp3';
import { useAudio } from '../../../utils/hooks/useAudio';

const eightSecondsSound = fetch(eightSecondsSoundUrl).then((response) =>
  response.arrayBuffer()
);
const twelveSecondsSound = fetch(twelveSecondsSoundUrl).then((response) =>
  response.arrayBuffer()
);

/**
 * インスペクションの経過時間に応じて警告音を鳴らす
 */
export const useWarningSound = (spentInspectionTime: number) => {
  const inspectionTimeInteger = Math.ceil(spentInspectionTime / 1000);
  const { playAudio } = useAudio();

  useEffect(() => {
    (async () => {
      if (15 - inspectionTimeInteger === 8) {
        playAudio(await eightSecondsSound);
      }
      if (15 - inspectionTimeInteger === 12) {
        playAudio(await twelveSecondsSound);
      }
    })();
  }, [inspectionTimeInteger, playAudio]);
};
