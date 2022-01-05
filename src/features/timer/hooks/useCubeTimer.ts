import {
  useCallback,
  useRef,
  TouchEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { exhaustiveCheck } from '../../../utils/exhaustiveCheck';
import { useTimer } from '../../../utils/hooks/useTimer';
import { DNF } from '../data/timeData';
import {
  READY,
  STEADY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  IDOLING,
  WORKING,
} from '../data/timerState';

/**
 * useTimer はキューブタイマー用のロジックだけ書いてあり、キーボードやマウスと接続する部分が書かれていない。
 * このカスタムフックはキーボード、マウスから useTimer を使うためのフック。
 * 逆に言うと、接続するところしかやっていない。たとえばインスペクションの経過時間に応じて音を出す処理は入っていない。
 */
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
  const penalty = useRef<null | '+2' | typeof DNF>(null);
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
        if (penalty.current === '+2') {
          onFinish({
            time,
            penalty: true,
          });
        } else if (penalty.current === DNF) {
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
  if (timerState === IDOLING) {
    penalty.current = null;
  }

  const inspectionTimeRef = useRef(inspectionTime);
  inspectionTimeRef.current = inspectionTime;

  const onPointerDown = useCallback(
    (
      event?: TouchEvent<HTMLElement> | ReactMouseEvent<HTMLElement, MouseEvent>
    ) => {
      if (inputsTimeManually) {
        return;
      }
      if (
        event &&
        'button' in event.nativeEvent &&
        event.nativeEvent.button !== 0
      ) {
        // 左クリック以外のクリックのケース
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
    },
    [
      finishTimer,
      inputsTimeManually,
      startInspection,
      tapTimer,
      tapTimerInInspection,
      timerState,
      usesInspection,
    ]
  );
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
            penalty.current = '+2';
          } else {
            // DNF
            penalty.current = DNF;
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
      if (event.target !== document.querySelector('body')) {
        // ボタンにフォーカスした状態でスペースを押したときなどに、タイマーをスタートさせないようにする
        return;
      }
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
