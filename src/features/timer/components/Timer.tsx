import { ReactNode, VFC, useEffect, useMemo } from 'react';
import tw from 'twin.macro';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { RecordItem } from '../../../components/Timer/RecordItem';
import { TimerCover } from '../../../components/Timer/TimerCover';
import { TypingTimer } from '../../../components/Timer/TypingTimer';
import steadySoundUrl from '../../../sound/steady.mp3';
import { calcAo } from '../../../utils/calcAo';
import { useAudio } from '../../../utils/hooks/useAudio';
import { isAwayFromBeginningElement } from '../../../utils/isAwayFromBeginningElement';
import { playSilence } from '../../../utils/playAudio';
import { showAverage } from '../../../utils/showAverage';
import { showTime } from '../../../utils/showTime';
import { withStopPropagation } from '../../../utils/withStopPropagation';
import { TimeData } from '../data/timeData';
import {
  STEADY,
  INSPECTION_STEADY,
  INSPECTION,
  INSPECTION_READY,
  IDOLING,
  READY,
  WORKING,
} from '../data/timerState';
import { useCubeTimer } from '../hooks/useCubeTimer';
import { useWarningSound } from '../hooks/useWarningSound';
import { TapTimer } from './TapTimer';
import { TimerArea } from './TimerArea';

const steadySound = fetch(steadySoundUrl).then((response) =>
  response.arrayBuffer()
);

interface Props {
  usesInspection: boolean;
  inputsTimeManually: boolean;
  onFinish: (time: {
    time: number;
    penalty?: boolean | undefined;
    isDNF?: boolean | undefined;
  }) => void;
  onTypingTimerInput: (time: number) => void;
  times: TimeData[];
  volume: number;
  variationChooseButton: ReactNode;
  statisticsButton: ReactNode;
  recordModifier: ReactNode;
}
export const Timer: VFC<Props> = ({
  usesInspection,
  inputsTimeManually,
  onFinish,
  onTypingTimerInput,
  times,
  volume,
  variationChooseButton: yesButton,
  statisticsButton: awesomeButton,
  recordModifier,
}) => {
  const {
    onPointerDown,
    onPointerUp,
    cancelTimer,
    timerState,
    inspectionTime,
    time,
  } = useCubeTimer({
    usesInspection,
    inputsTimeManually,
    onFinish,
  });
  const inspectionTimeInteger = Math.ceil(inspectionTime / 1000);
  const { playAudio } = useAudio();
  useEffect(() => {
    (async () => {
      if (timerState === STEADY || timerState === INSPECTION_STEADY) {
        playAudio(await steadySound);
      }
    })();
  }, [playAudio, timerState]);

  useWarningSound(inspectionTime);

  const ao5 = useMemo(() => calcAo(5, times.slice(-5)).pop() || null, [times]);
  const ao12 = useMemo(
    () => calcAo(12, times.slice(-12)).pop() || null,
    [times]
  );

  const timerStr = useMemo(() => {
    if (
      timerState === INSPECTION ||
      timerState === INSPECTION_READY ||
      timerState === INSPECTION_STEADY
    )
      return inspectionTimeInteger > 0
        ? inspectionTimeInteger
        : inspectionTimeInteger > -2
        ? '+ 2'
        : 'DNF';
    if (timerState === IDOLING && times.length > 0)
      return <RecordItem record={times[times.length - 1]} />;
    if (timerState === READY) return 'READY';
    if (timerState === STEADY) return 'STEADY';
    return showTime(time);
  }, [inspectionTimeInteger, time, timerState, times]);

  return (
    <TimerArea
      disabled={inputsTimeManually}
      overlappingScreen={timerState !== IDOLING}
      cover={useMemo(
        () => (
          <TimerCover
            onPointerDown={() => {
              if (volume > 0) {
                playSilence();
              }
              onPointerDown();
            }}
            onPointerUp={onPointerUp}
            disabled={inputsTimeManually}
            transparent={timerState === IDOLING}
          />
        ),
        [inputsTimeManually, onPointerDown, onPointerUp, timerState, volume]
      )}
    >
      {yesButton}
      {awesomeButton}
      {inputsTimeManually ? (
        <TypingTimer
          tw="z-20"
          prevTime={times.length > 0 ? times[times.length - 1] : undefined}
          onInput={onTypingTimerInput}
        />
      ) : (
        <TapTimer tw="z-20 pointer-events-none" timerState={timerState}>
          {timerStr}
        </TapTimer>
      )}
      <div>ao5: {showAverage(ao5, '-')}</div>
      <div>ao12: {showAverage(ao12, '-')}</div>
      <div
        css={[
          tw`pointer-events-none select-none`,
          timerState === READY ||
          timerState === STEADY ||
          timerState === WORKING
            ? tw`z-auto`
            : tw`z-20`,
        ]}
      >
        {timerState === INSPECTION ||
        timerState === INSPECTION_READY ||
        timerState === INSPECTION_STEADY ? (
          <PrimaryButton
            onTouchEnd={(event) => {
              if (isAwayFromBeginningElement(event)) {
                return;
              }
              event.stopPropagation();
              event.preventDefault();
              cancelTimer();
            }}
            onClick={withStopPropagation(cancelTimer)}
          >
            cancel
          </PrimaryButton>
        ) : (
          times.length > 0 && recordModifier
        )}
      </div>
    </TimerArea>
  );
};
