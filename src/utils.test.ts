import { clamp } from './utils';
describe('clamp()', () => {
  it('clamps a value between an upper and lower bound', () => {
    expect(clamp(4, 2, 13)).toBe(4);
    expect(clamp(-1, 2, 13)).toBe(2);
    expect(clamp(21, 2, 13)).toBe(13);
  });
});
