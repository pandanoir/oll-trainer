/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useTitle } from './useTitle';

describe('useTitle', () => {
  beforeEach(() => {
    document.title = '';
  });
  it('controls input value', () => {
    const { rerender } = renderHook(({ title }) => useTitle(title), {
      initialProps: { title: 'test title' },
    });
    expect(document.title).toBe('test title');

    act(() => {
      rerender({ title: 'changed title' });
    });
    expect(document.title).toBe('changed title');
  });
});
