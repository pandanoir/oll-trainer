import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from 'react';
import { noop } from '../noop';
import { playAudio } from '../playAudio';

export const VolumeContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
>([1, noop]);
export const useAudio = () => {
  const [volume, setVolume] = useContext(VolumeContext);
  return {
    volume,
    setVolume,
    playAudio: useCallback(
      (audioData: ArrayBuffer) => playAudio(audioData, { volume }),
      [volume]
    ),
  } as const;
};
