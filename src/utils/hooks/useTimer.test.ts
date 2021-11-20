import { act, renderHook } from '@testing-library/react-hooks';
import {
  IDOLING,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  READY,
  STEADY,
  WORKING,
} from '../../features/timer/data/timerState';
import { useTimer } from './useTimer';

jest.useFakeTimers();
describe('useTimer', () => {
  test('initial state', () => {
    const onFinishTimer = jest.fn();
    const now = { current: 0 };
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: () => now.current })
    );
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(IDOLING);
  });
  test('measure time', () => {
    /**
     * 1. タップ開始
     * 1. 300ms 経過
     * 1. タイマー開始
     * 1. 1秒経過
     * 1. タイマー停止
     * という流れをテスト
     */
    const onFinishTimer = jest.fn();
    const now = { current: 0 },
      nowFn = jest.fn().mockImplementation(() => now.current);
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: nowFn })
    );
    act(() => result.current.tapTimer());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(STEADY);

    act(() => result.current.startTimer());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(WORKING);

    act(() => {
      now.current += 1000;
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.time).toBe(1000);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(WORKING);

    act(() => result.current.finishTimer());
    expect(onFinishTimer).toBeCalled();
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(IDOLING);
  });
  test('measure time after inspection', () => {
    /**
     * 1. インスペクションスタート
     * 1. タップ開始
     * 1. 300ms 経過
     * 1. タイマーをスタート
     * 1. 1秒経過
     * 1. タイマー停止
     * という流れをテスト
     */
    const onFinishTimer = jest.fn();
    const now = { current: 0 },
      nowFn = jest.fn().mockImplementation(() => now.current);
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: nowFn })
    );
    act(() => result.current.startInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION);

    act(() => result.current.tapTimerInInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000 - 150);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000 - 300);
    expect(result.current.timerState).toBe(INSPECTION_STEADY);

    act(() => result.current.startTimer());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(WORKING);

    act(() => result.current.startTimer());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(WORKING);

    act(() => {
      now.current += 1000;
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.time).toBe(1000);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(WORKING);

    act(() => result.current.finishTimer());
    expect(onFinishTimer).toBeCalled();
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(IDOLING);
  });
  test('cancel inspection', () => {
    const onFinishTimer = jest.fn();
    const now = { current: 0 },
      nowFn = jest.fn().mockImplementation(() => now.current);
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: nowFn })
    );
    act(() => result.current.startInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION);

    act(() => result.current.tapTimerInInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000 - 150);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      result.current.returnToInspection();
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000 - 150);
    expect(result.current.timerState).toBe(INSPECTION);
  });
  test('cancel measurement', () => {
    const onFinishTimer = jest.fn();
    const now = { current: 0 },
      nowFn = jest.fn().mockImplementation(() => now.current);
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: nowFn })
    );
    act(() => result.current.tapTimer());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(STEADY);

    act(() => {
      result.current.cancelTimer();
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(IDOLING);
  });
  test('cancel inspection', () => {
    const onFinishTimer = jest.fn();
    const now = { current: 0 },
      nowFn = jest.fn().mockImplementation(() => now.current);
    const { result } = renderHook(() =>
      useTimer({ onFinishTimer, now: nowFn })
    );
    act(() => result.current.startInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION);

    act(() => result.current.tapTimerInInspection());
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      now.current += 150;
      jest.advanceTimersByTime(150);
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(15000 - 150);
    expect(result.current.timerState).toBe(INSPECTION_READY);

    act(() => {
      result.current.cancelTimer();
    });
    expect(result.current.time).toBe(0);
    expect(result.current.inspectionTime).toBe(0);
    expect(result.current.timerState).toBe(IDOLING);
  });
});
