/**
 * @jest-environment jsdom
 */
import {
  createEvent,
  fireEvent,
  getByTestId,
  render,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { usePreventDefault } from './usePreventDefault';

describe('usePreventDefault', () => {
  const TestComponent = ({
    eventName,
    disabled = false,
  }: {
    eventName: string;
    disabled?: boolean;
  }) => {
    const ref = usePreventDefault<HTMLDivElement>(
      eventName,
      disabled ? false : undefined
    );
    return <div ref={ref} data-testid="main" />;
  };
  it('prevents default behavior', () => {
    const { container } = render(<TestComponent eventName="touchstart" />);
    const touchEvent = createEvent.touchStart(getByTestId(container, 'main'));
    expect(touchEvent.defaultPrevented).toBe(false);
    act(() => {
      fireEvent(getByTestId(container, 'main'), touchEvent);
    });
    expect(touchEvent.defaultPrevented).toBe(true);
  });
  it(`doesn't prevent default behavior when disabled`, () => {
    const { container } = render(
      <TestComponent eventName="touchstart" disabled />
    );
    const touchEvent = createEvent.touchStart(getByTestId(container, 'main'));
    expect(touchEvent.defaultPrevented).toBe(false);
    act(() => {
      fireEvent(getByTestId(container, 'main'), touchEvent);
    });
    expect(touchEvent.defaultPrevented).toBe(false);
  });
});
