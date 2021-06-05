import { showTime } from './showTime';

describe('showTime', () => {
  it('shows time', () => {
    expect(showTime(1000)).toBe('1.000');
    expect(showTime(999)).toBe('0.999');
    expect(showTime(59999)).toBe('59.999');
    expect(showTime(60000)).toBe('1:00.000');
    expect(showTime(123456)).toBe('2:03.456');
  });
});
