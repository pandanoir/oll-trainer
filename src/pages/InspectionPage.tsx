import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import 'twin.macro';

import eightSecondsSoundUrl from '../sound/eightSeconds.mp3';
import twelveSecondsSoundUrl from '../sound/twelveSeconds.mp3';
import timeoutSoundUrl from '../sound/警告音1.mp3';
import dnfSoundUrl from '../sound/警告音2.mp3';
import { playAudio, playSilence } from '../utils/playAudio';

const showRestInspectionTime = (pastMillisec: number) =>
  15 * 1000 >= pastMillisec
    ? `${Math.ceil(15 - pastMillisec / 1000)} seconds`
    : 17 * 1000 >= pastMillisec
    ? '+2'
    : 'DNF';

const fetchAudio = (url: string) =>
  fetch(url).then((response) => response.arrayBuffer());
const eightSecondsSound = fetchAudio(eightSecondsSoundUrl);
const twelveSecondsSound = fetchAudio(twelveSecondsSoundUrl);
const timeoutSound = fetchAudio(timeoutSoundUrl);
const dnfSound = fetchAudio(dnfSoundUrl);

type StopwatchMode = 'in inspection' | 'wait for user input';

const usePlayOnce = (audio: Promise<ArrayBuffer>) => {
  const [hasPlayed, setHasPlayed] = useState(false);

  return {
    play: useCallback(async () => {
      if (!hasPlayed) {
        setHasPlayed(true);
        playAudio(await audio);
      }
    }, [audio, hasPlayed]),
    reset: useCallback(() => {
      setHasPlayed(false);
    }, []),
  } as const;
};
export const InspectionPage = () => {
  const [pastMillisec, setPastMillisec] = useState(0);
  const [mode, setMode] = useState<StopwatchMode>('wait for user input');
  const { play: call8Seconds, reset: resetHasCalled8Seconds } =
    usePlayOnce(eightSecondsSound);
  const { play: call12Seconds, reset: resetHasCalled12Seconds } =
    usePlayOnce(twelveSecondsSound);
  const { play: callTimeout, reset: resetHasCalledTimeout } =
    usePlayOnce(timeoutSound);
  const { play: callDNF, reset: resetHasCalledDNF } = usePlayOnce(dnfSound);

  useHotkeys(
    'space',
    () => {
      playSilence();
      if (mode === 'wait for user input') {
        setMode('in inspection');
      } else if (mode === 'in inspection') {
        setMode('wait for user input');
      }
    },
    [mode]
  );
  useEffect(() => {
    if (mode === 'in inspection') {
      const startAt = performance.now();
      resetHasCalled8Seconds();
      resetHasCalled12Seconds();
      resetHasCalledTimeout();
      resetHasCalledDNF();
      const id = setInterval(() => {
        setPastMillisec(performance.now() - startAt);
      }, 1000 / 30);
      return () => {
        clearInterval(id);
        setPastMillisec(0);
      };
    }
  }, [
    mode,
    resetHasCalled8Seconds,
    resetHasCalled12Seconds,
    resetHasCalledTimeout,
    resetHasCalledDNF,
  ]);
  useEffect(() => {
    if (pastMillisec < 8e3) {
      return;
    }
    if (pastMillisec < 12e3) {
      call8Seconds();
    } else if (pastMillisec < 15e3) {
      call12Seconds();
    } else if (pastMillisec < 17e3) {
      callTimeout();
    } else {
      callDNF();
    }
  }, [call8Seconds, call12Seconds, callTimeout, callDNF, pastMillisec]);

  return (
    <div tw="flex flex-col flex-1 space-y-3">
      <h1 tw="text-2xl">inspection</h1>
      <div
        tw="flex flex-col justify-center items-center flex-1"
        onClick={() => {
          playSilence();
          if (mode === 'wait for user input') {
            setMode('in inspection');
          } else if (mode === 'in inspection') {
            setMode('wait for user input');
          }
        }}
      >
        {mode === 'wait for user input' ? (
          <span tw="select-none text-blue-400 font-bold">
            press space or tap to start inspection.
          </span>
        ) : (
          <div tw="flex flex-col space-y-1 select-none text-center">
            <span tw="text-5xl font-bold">
              {showRestInspectionTime(pastMillisec)}
            </span>
            <span tw="text-gray-700 dark:text-gray-400">
              esc or tap to reset inspection.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
