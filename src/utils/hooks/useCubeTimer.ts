import { useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { DNF } from '../../components/Timer/timeData';
import {
  READY,
  STEADY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  IDOLING,
  WORKING,
} from '../../components/Timer/timerState';
import { exhaustiveCheck } from '../exhaustiveCheck';
import { useTimer } from './useTimer';

export const useCubeTimer = ({
  inputsTimeManually,
  usesInspection,
  onFinish,
  now = () => performance.now(),
}: {
  inputsTimeManually: boolean;
  usesInspection: boolean;
  onFinish: (time: {
    time: number;
    penalty?: boolean;
    isDNF?: boolean;
  }) => void;
  now?: () => number;
}) => {
  const [penalty, setPenalty] = useState<null | '+2' | typeof DNF>(null);
  const {
    time,
    inspectionTime,
    timerState,

    startTimer,
    finishTimer,
    tapTimer,
    cancelTimer,
    startInspection,
    tapTimerInInspection,
    returnToInspection,
  } = useTimer({
    now,
    onFinishTimer: useCallback(
      (time) => {
        if (penalty === '+2') {
          onFinish({
            time,
            penalty: true,
          });
        } else if (penalty === DNF) {
          onFinish({
            time,
            isDNF: true,
          });
        } else {
          onFinish({ time });
        }
      },
      [penalty, onFinish]
    ),
  });

  useEffect(() => {
    if (timerState === IDOLING) {
      setPenalty(null);
    }
  }, [timerState]);

  const inspectionTimeRef = useRef(inspectionTime);
  useEffect(() => {
    inspectionTimeRef.current = inspectionTime;
  }, [inspectionTime]);

  const onPointerDown = useCallback(() => {
    if (inputsTimeManually) {
      return;
    }
    switch (timerState) {
      case READY:
      case STEADY:
      case INSPECTION_READY:
      case INSPECTION_STEADY:
        break;
      case IDOLING:
        if (usesInspection) {
          startInspection();
        } else {
          tapTimer();
        }
        break;
      case INSPECTION:
        tapTimerInInspection();
        break;
      case WORKING:
        finishTimer();
        break;
      default:
        exhaustiveCheck(timerState);
    }
  }, [
    finishTimer,
    inputsTimeManually,
    startInspection,
    tapTimer,
    tapTimerInInspection,
    timerState,
    usesInspection,
  ]);
  const onPointerUp = useCallback(() => {
    if (inputsTimeManually) {
      return;
    }
    switch (timerState) {
      case IDOLING:
      case INSPECTION:
      case WORKING:
        break;
      case READY:
        cancelTimer();
        break;
      case INSPECTION_READY:
        returnToInspection();
        break;
      case STEADY:
      case INSPECTION_STEADY:
        if (usesInspection) {
          if (inspectionTimeRef.current >= 0) {
            // 問題なし
          } else if (inspectionTimeRef.current >= -2000) {
            // +2
            setPenalty('+2');
          } else {
            // DNF
            setPenalty(DNF);
          }
        }
        startTimer();
        break;
      default:
        exhaustiveCheck(timerState);
    }
  }, [
    cancelTimer,
    inputsTimeManually,
    returnToInspection,
    startTimer,
    timerState,
    usesInspection,
  ]);

  const spacePressed = useRef(false);
  /**
   * なんでかわからないけど space,esc で設定をするとバグがある。
   * スペースキーを押したままescapeを押したときに
   * escape キーの keydown イベントへ切り替わらずに
   * keyboard event が取得できなくなる。
   * そのため '*' で設定してある */
  useHotkeys(
    '*',
    (event) => {
      const { type, code } = event;
      if (inputsTimeManually) {
        return;
      }
      if (code === 'Escape') {
        if (
          timerState === READY ||
          timerState === STEADY ||
          timerState === INSPECTION ||
          timerState === INSPECTION_READY ||
          timerState === INSPECTION_STEADY
        ) {
          event.preventDefault();
          cancelTimer();
        }
        return;
      }
      if (code === 'Space') {
        event.preventDefault();
        if (type === 'keyup') {
          spacePressed.current = false;
          onPointerUp();
          return;
        }
        if (type !== 'keydown') {
          return;
        }
        if (!spacePressed.current) {
          onPointerDown();
        }
        spacePressed.current = true;
      }
    },
    { keyup: true, keydown: true },
    [cancelTimer, inputsTimeManually, onPointerDown, onPointerUp, timerState]
  );
  return {
    onPointerDown,
    onPointerUp,
    cancelTimer,
    inspectionTime,
    timerState,
    time,
  } as const;
};
