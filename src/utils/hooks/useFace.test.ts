import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { useFace } from './useFace';

describe('useFace', () => {
  it('manages cube faces', () => {
    const { result } = renderHook(useFace);
    expect(result.current.cubeStatus).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    act(() => {
      result.current.toggleCube(2);
    });
    expect(result.current.cubeStatus).toEqual([0, 0, 1, 0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.toggleCube(2);
    });
    expect(result.current.cubeStatus).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
  test('.clearCube() resets cube status', () => {
    const { result } = renderHook(useFace);
    expect(result.current.cubeStatus).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    act(() => {
      result.current.toggleCube(2);
      result.current.toggleCube(5);
    });
    expect(result.current.cubeStatus).toEqual([0, 0, 1, 0, 0, 1, 0, 0, 0]);

    act(() => {
      result.current.clearCube();
    });
    expect(result.current.cubeStatus).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});
