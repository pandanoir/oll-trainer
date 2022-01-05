/**
 * @jest-environment jsdom
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { act } from 'react-dom/test-utils';
import { IntlProvider, MessageFormatElement } from 'react-intl';
import en from '../../../../compiled-lang/en.json';
import ja from '../../../../compiled-lang/ja.json';
import { useSessions } from '../../sessionList/hooks/useSessions';
import { TimeData } from '../data/timeData';
import { Timer } from './Timer';
import '@testing-library/jest-dom';

const selectMessages = (
  locale: string
): Record<string, string> | Record<string, MessageFormatElement[]> => {
  switch (locale) {
    case 'en':
      return en;
    case 'ja':
      return ja;
    default:
      return en;
  }
};

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
describe('TypingTimer', () => {
  beforeEach(() => {
    timesRef.current = [];
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
  });

  const now = 1609426800000;
  const timesRef: { current: TimeData[] } = { current: [] };
  const TestComponent = ({
    onFinish,
    onTypingTimerInput,
  }: Pick<ComponentProps<typeof Timer>, 'onFinish' | 'onTypingTimerInput'>) => {
    const { currentSessionCollection, sessionIndex, addTime } = useSessions();
    const { times } = currentSessionCollection.sessions[sessionIndex];
    timesRef.current = times;
    return (
      <IntlProvider
        locale="ja"
        defaultLocale="en"
        messages={selectMessages('ja')}
      >
        <Timer
          usesInspection={false}
          inputsTimeManually={true}
          times={times}
          onFinish={(data) => {
            addTime({
              ...data,
              scramble: '',
              date: now,
            });
            onFinish(data);
          }}
          onTypingTimerInput={(secTime) => {
            addTime({
              time: secTime * 1000,
              scramble: '',
              date: now,
            });
            onTypingTimerInput(secTime);
          }}
          variationChooseButton={<button />}
          statisticsButton={<div />}
          recordModifier={<div />}
        />
      </IntlProvider>
    );
  };
  test('in normal case', () => {
    const onFinish = jest.fn();
    const onTypingTimerInput = jest.fn();
    const { getByRole } = render(
      <TestComponent
        onFinish={onFinish}
        onTypingTimerInput={onTypingTimerInput}
      />
    );
    expect(getByRole('textbox', { name: 'input your time' })).toHaveValue('');

    act(() => {
      fireEvent.change(getByRole('textbox', { name: 'input your time' }), {
        target: { value: '1234' },
      });
    });
    act(() => {
      fireEvent.keyDown(getByRole('textbox', { name: 'input your time' }), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
    });

    expect(onTypingTimerInput).toHaveBeenCalledTimes(1);
    expect(onTypingTimerInput).toHaveBeenLastCalledWith(12.34);
    expect(getByRole('textbox', { name: 'input your time' })).toHaveValue('');
    expect(timesRef.current).toEqual([
      {
        date: now,
        scramble: '',
        time: 12340,
      },
    ]);
  });
  test('TapTimer accepts decimal number', () => {
    const onTypingTimerInput = jest.fn();
    const { getByRole } = render(
      <TestComponent
        onFinish={jest.fn()}
        onTypingTimerInput={onTypingTimerInput}
      />
    );
    expect(getByRole('textbox', { name: 'input your time' })).toHaveValue('');

    fireEvent.change(getByRole('textbox', { name: 'input your time' }), {
      target: { value: '1.234' },
    });
    fireEvent.keyDown(getByRole('textbox', { name: 'input your time' }), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(onTypingTimerInput).toHaveBeenCalledTimes(1);
    expect(onTypingTimerInput).toHaveBeenLastCalledWith(1.234);
    expect(getByRole('textbox', { name: 'input your time' })).toHaveValue('');
    expect(timesRef.current).toEqual([
      {
        date: now,
        scramble: '',
        time: 1234,
      },
    ]);
  });
});
