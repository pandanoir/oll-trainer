import { getTimezoneStr } from './getTimezoneStr';

describe('getTimezoneStr', () => {
  it('returns timezone string', () => {
    expect(getTimezoneStr(300)).toBe('-0500');
    expect(getTimezoneStr(0)).toBe('+0000');
    expect(getTimezoneStr(-0)).toBe('+0000');
    expect(getTimezoneStr(-540)).toBe('+0900');
    expect(getTimezoneStr(30)).toBe('-0030');
  });
});
