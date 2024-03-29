import { ReactNode, VFC, useEffect, useMemo } from 'react';
import tw from 'twin.macro';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
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
import { RecordItem } from './RecordItem';
import { TapTimerDisplay } from './TapTimerDisplay';
import { TimerArea } from './TimerArea';
import { TimerCover } from './TimerCover';
import { TypingTimer } from './TypingTimer';

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
  variationChooseButton: ReactNode;
  statisticsButton: ReactNode;
  recordModifier: ReactNode;
  disabled?: boolean;
}
export const Timer: VFC<Props> = ({
  usesInspection,
  inputsTimeManually,
  onFinish,
  onTypingTimerInput,
  times,
  variationChooseButton,
  statisticsButton,
  recordModifier,
  disabled = false,
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
  const { volume, playAudio } = useAudio();
  useEffect(() => {
    (async () => {
      if (timerState === STEADY || timerState === INSPECTION_STEADY) {
        playAudio(await steadySound);
      }
    })();
  }, [playAudio, timerState]);

  useWarningSound(inspectionTime);

  const ao5 = useMemo(() => {
    const res = calcAo(5, times.slice(-5)).pop();
    return typeof res !== 'undefined' ? res : null;
  }, [times]);
  const ao12 = useMemo(() => {
    const res = calcAo(12, times.slice(-12)).pop();
    return typeof res !== 'undefined' ? res : null;
  }, [times]);

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
      disabled={inputsTimeManually || disabled}
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
            onPointerCancel={cancelTimer}
            disabled={inputsTimeManually || disabled}
            transparent={timerState === IDOLING}
            pressed={
              timerState === READY ||
              timerState === STEADY ||
              timerState === INSPECTION_READY ||
              timerState === INSPECTION_STEADY
            }
          />
        ),
        [
          cancelTimer,
          disabled,
          inputsTimeManually,
          onPointerDown,
          onPointerUp,
          timerState,
          volume,
        ]
      )}
    >
      {variationChooseButton}
      {statisticsButton}
      {inputsTimeManually ? (
        <TypingTimer
          tw="z-20"
          prevTime={times.length > 0 ? times[times.length - 1] : undefined}
          onInput={onTypingTimerInput}
        />
      ) : (
        <TapTimerDisplay
          disabled={disabled}
          tw="z-20 pointer-events-none"
          timerState={timerState}
        >
          {timerStr}
        </TapTimerDisplay>
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
