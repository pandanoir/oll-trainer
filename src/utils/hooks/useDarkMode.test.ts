/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import { useDarkMode } from './useDarkMode';
import { act } from 'react-test-renderer';
import { withPrefix } from '../withPrefix';

const STORAGE_KEY = withPrefix('theme');
describe('useDarkMode', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });
  });
  beforeEach(() => {
    localStorage.clear();
  });
  it('manages darkMode', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.darkMode).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      result.current.setDarkMode();
    });
    expect(result.current.darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setLightMode();
    });
    expect(result.current.darkMode).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('uses userSetting if value is not saved on localStorage', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(true));
  });
  it('saves darkMode setting on localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(true));

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(true));

    act(() => {
      result.current.setDarkMode();
    });
    expect(result.current.darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(true));

    act(() => {
      result.current.setLightMode();
    });
    expect(result.current.darkMode).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(false));
  });
});
