/**
 * @jest-environment jsdom
 */
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
  IDOLING,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  READY,
  STEADY,
  WORKING,
} from '../../components/Timer/timerState';
import { useCubeTimer } from './useCubeTimer';

jest.useFakeTimers();
describe('useCubeTimer', () => {
  const value: { current: ReturnType<typeof useCubeTimer> | null } = {
    current: null,
  };
  const time = { current: 0 };
  const TestComponent = (opt: Parameters<typeof useCubeTimer>[0]) => {
    value.current = useCubeTimer(opt);
    return null;
  };
  beforeEach(() => {
    time.current = 0;
  });
  test('normal case with keyboard', () => {
    // タイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(STEADY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('inspection case with keyboard', () => {
    // インスペクション有効時のタイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(INSPECTION_STEADY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('cancel measurement with escape key', () => {
    // escape を使ってキャンセルできることを確認
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(STEADY);

    fireEvent.keyDown(container, { code: 'Escape' });
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('cancel inspection with escape key', () => {
    // escape を使ってインスペクションをキャンセルできることを確認
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION_READY);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(value.current?.timerState).toBe(INSPECTION_STEADY);

    fireEvent.keyDown(container, { code: 'Escape' });
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('cancel by keyup', () => {
    // READY の間にキーを離したらキャンセルする
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(READY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('cancel inspection by keyup', () => {
    // INSPECTION_READY の間にキーを離したらINSPECTIONに戻る
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION_READY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
  });
  test('penalty', () => {
    // インスペクションタイムを超えた際のペナルティを検証する
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      time.current += 17 * 1000;
      jest.advanceTimersByTime(17 * 1000);
    });
    expect(value.current?.timerState).toBe(INSPECTION_STEADY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();
    expect(onFinish).toBeCalledWith({ time: 0, penalty: true });

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('DNF', () => {
    // インスペクションタイムを超えた際のペナルティを検証する
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);
    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      time.current += 17 * 1000 + 1000 / 60;
      jest.advanceTimersByTime(17 * 1000 + 1000 / 60);
    });
    expect(value.current?.timerState).toBe(INSPECTION_STEADY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();
    expect(onFinish).toBeCalledWith({ time: 0, isDNF: true });

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  it('reacts only the moment key is pressed', () => {
    // keydownイベントは押しっぱなしでも発火するので、押された瞬間にのみ動くことを保証する
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(STEADY);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyDown(container, { code: 'Space' });
    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });
  it('ignores key events when inputsTimeManually', () => {
    // インスペクション有効時のタイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    const { container } = render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={true}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyDown(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);

    fireEvent.keyUp(container, { code: 'Space' });
    expect(value.current?.timerState).toBe(IDOLING);
  });

  test('normal case with tap', () => {
    // タイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(STEADY);

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(IDOLING);
  });
  test('inspection case with tap', () => {
    // インスペクション有効時のタイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    render(
      <TestComponent
        usesInspection={true}
        inputsTimeManually={false}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(INSPECTION);

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(INSPECTION);

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(value.current?.timerState).toBe(INSPECTION_READY);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(value.current?.timerState).toBe(INSPECTION_STEADY);

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(WORKING);
    expect(onFinish).not.toBeCalled();

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(IDOLING);
    expect(onFinish).toBeCalled();

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(IDOLING);
  });
  it('ignores tap when inputsTimeManually', () => {
    // インスペクション有効時のタイマースタート → ストップまでの一連をテストする
    const onFinish = jest.fn();
    render(
      <TestComponent
        usesInspection={false}
        inputsTimeManually={true}
        onFinish={onFinish}
      />
    );
    expect(value.current?.timerState).toBe(IDOLING);

    act(() => value.current?.onPointerDown());
    expect(value.current?.timerState).toBe(IDOLING);

    act(() => value.current?.onPointerUp());
    expect(value.current?.timerState).toBe(IDOLING);
  });
});
