/**
 * @jest-environment jsdom
 */
import { render, getByTestId } from '@testing-library/react';
import { useCheckbox } from './useCheckbox';

describe('useCheckbox', () => {
  let checked: ReturnType<typeof useCheckbox>[0];
  let onChange: ReturnType<typeof useCheckbox>[1];
  const TestComponent = () => {
    [checked, onChange] = useCheckbox();
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-testid="input"
      />
    );
  };
  it('controls checkbox value', () => {
    const { container } = render(<TestComponent />);
    expect((getByTestId(container, 'input') as HTMLInputElement).checked).toBe(
      false
    );
    expect(checked).toBe(false);

    getByTestId(container, 'input').click();
    expect((getByTestId(container, 'input') as HTMLInputElement).checked).toBe(
      true
    );
    expect(checked).toBe(true);

    getByTestId(container, 'input').click();
    expect((getByTestId(container, 'input') as HTMLInputElement).checked).toBe(
      false
    );
    expect(checked).toBe(false);
  });
});
