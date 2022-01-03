/**
 * @jest-environment jsdom
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { act } from 'react-dom/test-utils';
import { TimeData } from '../data/timeData';
import { Timer } from './Timer';
import '@testing-library/jest-dom';

jest.mock('../../../sound/steady.mp3', () => '');
jest.mock('../../../sound/eightSeconds.mp3', () => '');
jest.mock('../../../sound/twelveSeconds.mp3', () => '');
jest.mock('./Timer.css', () => '');
jest.mock('../../../utils/playAudio.ts', () => ({
  playAudio: jest.fn(),
  playSilence: jest.fn(),
}));

jest.useFakeTimers();
describe('Timer', () => {
  afterEach(() => {
    cleanup();
  });

  const now = 1609426800000;
  test('in normal case', () => {
    const onFinish: ComponentProps<typeof Timer>['onFinish'] = jest
      .fn()
      .mockImplementation((data) => {
        times.push({ ...data, scramble: '', date: now });
      });
    const onTypingTimerInput = jest.fn();
    const times: TimeData[] = [];
    const { getByRole } = render(
      <Timer
        usesInspection={false}
        inputsTimeManually={false}
        times={times}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    // keep tapping for 300ms to start timer
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('READY');

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(getByRole('main')).toHaveTextContent('READY');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(getByRole('main')).toHaveTextContent('STEADY');

    // timer starts
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('0.000');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByRole('main')).toHaveTextContent('0.985');

    // stop timer
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(getByRole('main')).toHaveTextContent('1.000');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('1.000');
  });

  test('in case of using inspection', () => {
    const onFinish: ComponentProps<typeof Timer>['onFinish'] = jest
      .fn()
      .mockImplementation((data) => {
        times.push({ ...data, scramble: '', date: now });
      });
    const onTypingTimerInput = jest.fn();
    const times: TimeData[] = [];
    const { getByRole } = render(
      <Timer
        usesInspection={true}
        inputsTimeManually={false}
        times={times}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    // start inspection
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('15');

    act(() => {
      jest.advanceTimersByTime(1001);
    });
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('15');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(getByRole('main')).toHaveTextContent('14');
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('14');

    // keep tapping for 300ms to start timer
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(getByRole('main')).toHaveTextContent('14');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(getByRole('main')).toHaveTextContent('14');

    // timer starts
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('0.000');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByRole('main')).toHaveTextContent('0.985');

    // stop timer
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(getByRole('main')).toHaveTextContent('1.000');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('1.000');
  });

  test('with penalty', () => {
    const onFinish: ComponentProps<typeof Timer>['onFinish'] = jest
      .fn()
      .mockImplementation((data) => {
        times.push({ ...data, scramble: '', date: now });
      });
    const onTypingTimerInput = jest.fn();
    const times: TimeData[] = [];
    const { getByRole } = render(
      <Timer
        usesInspection={true}
        inputsTimeManually={false}
        times={times}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    // start inspection
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('15');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));

    act(() => {
      jest.advanceTimersByTime(15000);
    });
    expect(getByRole('main')).toHaveTextContent('1');
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('+ 2');

    // keep tapping for 300ms to start timer
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(getByRole('main')).toHaveTextContent('+ 2');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(getByRole('main')).toHaveTextContent('+ 2');

    // timer starts
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('0.000');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByRole('main')).toHaveTextContent('0.985');

    // stop timer
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenLastCalledWith({ time: 1000, penalty: true });
    expect(times).toEqual([
      {
        date: now,
        penalty: true,
        scramble: '',
        time: 1000,
      },
    ]);
    expect(getByRole('main')).toHaveTextContent('1.000 + 2');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('1.000 + 2');
  });

  test('DNF', () => {
    const onFinish: ComponentProps<typeof Timer>['onFinish'] = jest
      .fn()
      .mockImplementation((data) => {
        times.push({ ...data, scramble: '', date: now });
      });
    const onTypingTimerInput = jest.fn();
    const times: TimeData[] = [];
    const { getByRole } = render(
      <Timer
        usesInspection={true}
        inputsTimeManually={false}
        times={times}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    // start inspection
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('15');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));

    act(() => {
      jest.advanceTimersByTime(17000);
    });
    expect(getByRole('main')).toHaveTextContent('+ 2');
    act(() => {
      jest.advanceTimersByTime(17);
    });
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('DNF');

    // keep tapping for 300ms to start timer
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(getByRole('main')).toHaveTextContent('DNF');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(getByRole('main')).toHaveTextContent('DNF');

    // timer starts
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('0.000');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByRole('main')).toHaveTextContent('0.985');

    // stop timer
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenLastCalledWith({ time: 1000, isDNF: true });
    expect(times).toEqual([
      {
        date: now,
        isDNF: true,
        scramble: '',
        time: 1000,
      },
    ]);
    expect(getByRole('main')).toHaveTextContent('DNF(1.000)');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('DNF(1.000)');
  });

  test('user needs to keep tapping for 300ms to start timer', () => {
    const onFinish: ComponentProps<typeof Timer>['onFinish'] = jest
      .fn()
      .mockImplementation((data) => {
        times.push({ ...data, scramble: '', date: now });
      });
    const onTypingTimerInput = jest.fn();
    const times: TimeData[] = [];
    const { getByRole } = render(
      <Timer
        usesInspection={false}
        inputsTimeManually={false}
        times={times}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('READY');

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(getByRole('main')).toHaveTextContent('READY');

    // timer doesn't start
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('0.000');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onFinish).not.toBeCalled();
    expect(getByRole('main')).toHaveTextContent('0.000');
  });

  test('user can cancel inspection with cancel button', () => {
    const onFinish = jest.fn();
    const onTypingTimerInput = jest.fn();
    const { getByRole } = render(
      <Timer
        usesInspection={true}
        inputsTimeManually={false}
        times={[]}
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
        variationChooseButton={<button />}
        statisticsButton={<div />}
        recordModifier={<div />}
      />
    );
    expect(getByRole('main')).toHaveTextContent('0.000');

    // start inspection
    fireEvent.touchStart(getByRole('button', { name: 'timer' }));
    expect(getByRole('main')).toHaveTextContent('15');
    fireEvent.touchEnd(getByRole('button', { name: 'timer' }));

    getByRole('button', { name: 'cancel' }).click();
    expect(onFinish).not.toBeCalled();
    expect(getByRole('main')).toHaveTextContent('0.000');
  });
});
