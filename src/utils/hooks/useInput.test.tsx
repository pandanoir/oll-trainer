/**
 * @jest-environment jsdom
 */
import { render, getByTestId, fireEvent } from '@testing-library/react';
import { useInput } from './useInput';

describe('useInput', () => {
  let value: ReturnType<typeof useInput>['value'];
  const TestComponent = () => {
    const hook = useInput();
    value = hook.value;
    return <input value={value} onChange={hook.onChange} data-testid="input" />;
  };
  it('controls input value', () => {
    const { container } = render(<TestComponent />);
    expect(value).toBe('');

    fireEvent.change(getByTestId(container, 'input'), {
      target: { value: 'Hello world' },
    });
    expect(value).toBe('Hello world');
  });
});
