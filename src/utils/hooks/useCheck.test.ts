/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useCheck } from './useCheck';

describe('useCheck', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('stores checklist', () => {
    const { result } = renderHook(() => useCheck(10));
    const res = Array(10).fill(false);
    expect(result.current.checkList).toEqual(res);

    act(() => {
      result.current.check(3);
    });
    res[3] = true;
    expect(result.current.checkList).toEqual(res);
    expect(localStorage.getItem('OLL_RANDOM_CHECKED')).toBe(
      JSON.stringify(res)
    );

    act(() => {
      result.current.check(8);
    });
    res[8] = true;
    expect(result.current.checkList).toEqual(res);
    expect(localStorage.getItem('OLL_RANDOM_CHECKED')).toBe(
      JSON.stringify(res)
    );

    act(() => {
      result.current.check(8);
    });
    res[8] = false;
    expect(result.current.checkList).toEqual(res);
    expect(localStorage.getItem('OLL_RANDOM_CHECKED')).toBe(
      JSON.stringify(res)
    );
  });
  test('.reset() resets state', () => {
    const { result } = renderHook(() => useCheck(10));
    const res = Array(10).fill(false);
    expect(result.current.checkList).toEqual(res);

    act(() => {
      result.current.check(3);
      result.current.check(8);
      result.current.reset();
    });
    expect(result.current.checkList).toEqual(res);
  });
});
