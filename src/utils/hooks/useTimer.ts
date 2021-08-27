import { useState, useRef, useCallback, useEffect } from 'react';
import {
  TimerState,
  IDOLING,
  WORKING,
  READY,
  INSPECTION_READY,
  INSPECTION,
  INSPECTION_STEADY,
  STEADY,
} from '../../components/Timer/timerState';
import { exhaustiveCheck } from '../exhaustiveCheck';

/**
 * 各種仕様
 * time: タイマーの現在のタイム。millisec。タイマー作動中は60fpsで変化する。
 * inspectionTime: インスペクション中の経過時刻を millisec で保持するステート。タイマーがスタートしてインスペクションが終了した時点で 0 にセットされる。
 * timerState: タイマーの状態。静止状態、ready、steady、タイム記録中、インスペクション中、インスペクション中ready、インスペクション中steadyなどがある。
 *   readyはキャンセル可能で、キーを離したらキャンセルされる。steadyでキーを離すとタイマーが作動する。
 */
export const useTimer = ({
  onFinishTimer,
  now = () => performance.now(),
}: {
  onFinishTimer: (time: number) => void;
  now?: () => number;
}) => {
  const [time, setTime] = useState(0); // millisec
  const timerStartAt = useRef(0);
  const [inspectionTime, setInspectionTime] = useState(0); // millisec
  const inspectionStartAt = useRef(0);
  const [timerState, _setTimerState] = useState<TimerState>(IDOLING);
  const timerStateRef = useRef<TimerState>(IDOLING);
  const setTimerState = (nextState: TimerState) => {
    _setTimerState(nextState);
    timerStateRef.current = nextState;
  };
  const startTimer = useCallback(() => {
      setTimerState(WORKING);
      setInspectionTime(0);
      timerStartAt.current = now();
    }, [now]),
    finishTimer = useCallback(() => {
      setTimerState(IDOLING);
      const time = now() - timerStartAt.current;
      onFinishTimer(time);
    }, [now, onFinishTimer]),
    tapTimer = useCallback(() => {
      setTimerState(READY);
    }, []),
    cancelTimer = useCallback(() => {
      setTimerState(IDOLING);
      setInspectionTime(0);
      // TODO: ここの扱い、かなりしっかり考えないとまずそう
    }, []),
    tapTimerInInspection = useCallback(() => {
      setTimerState(INSPECTION_READY);
    }, []),
    returnToInspection = useCallback(() => {
      setTimerState(INSPECTION);
    }, []);
  const startInspection = useCallback(() => {
    setTimerState(INSPECTION);
    setInspectionTime(15000);
    inspectionStartAt.current = now();
  }, [now]);

  /** タイマーの時刻を更新する */
  useEffect(() => {
    if (timerState === IDOLING) {
      timerStartAt.current = 0;
      78;
      setTime(0);
      return;
    }
    if (timerState === WORKING) {
      const id = setInterval(() => {
        setTime(now() - timerStartAt.current);
      }, 1000 / 60);
      return () => clearInterval(id);
    }
    if (
      timerState === INSPECTION ||
      timerState === INSPECTION_READY ||
      timerState === INSPECTION_STEADY
    ) {
      const id = setInterval(() => {
        setInspectionTime(15000 - (now() - inspectionStartAt.current));
      }, 1000 / 60);
      return () => clearInterval(id);
    }
    if (timerState === READY || timerState === STEADY) {
      // nothing to do
      return;
    }
    exhaustiveCheck(timerState); // timerState のパターンすべてを網羅できているかチェック
  }, [now, timerState]);

  /** ready -> steady の管理 */
  useEffect(() => {
    if (timerState === READY) {
      const id = setTimeout(() => {
        setTimerState(STEADY);
      }, 300);
      return () => clearTimeout(id);
    }
    if (timerState === INSPECTION_READY) {
      const id = setTimeout(() => {
        setTimerState(INSPECTION_STEADY);
      }, 300);
      return () => clearTimeout(id);
    }
  }, [timerState]);

  return {
    time,
    inspectionTime,
    startTimer,
    finishTimer,
    tapTimer,
    tapTimerInInspection,
    cancelTimer,
    timerState,
    startInspection,
    returnToInspection,
  } as const;
};
