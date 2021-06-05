import { showRecord } from './showRecord';

describe('showRecord', () => {
  it('shows time', () => {
    expect(showRecord({ time: 999, date: 0, scramble: '' })).toBe('0.999');
    expect(showRecord({ time: 1000, date: 0, scramble: '' })).toBe('1.000');
    expect(showRecord({ time: 59999, date: 0, scramble: '' })).toBe('59.999');
    expect(showRecord({ time: 60000, date: 0, scramble: '' })).toBe('1:00.000');
    expect(showRecord({ time: 123456, date: 0, scramble: '' })).toBe(
      '2:03.456'
    );
  });
  it('adds +2', () => {
    expect(
      showRecord({ time: 1000, date: 0, penalty: true, scramble: '' })
    ).toBe('1.000 + 2');
    expect(
      showRecord({ time: 59999, date: 0, penalty: true, scramble: '' })
    ).toBe('59.999 + 2');
    expect(
      showRecord({ time: 60000, date: 0, penalty: true, scramble: '' })
    ).toBe('1:00.000 + 2');
    expect(
      showRecord({ time: 123456, date: 0, penalty: true, scramble: '' })
    ).toBe('2:03.456 + 2');
  });
  it('returns DNF', () => {
    expect(showRecord({ time: 1000, date: 0, isDNF: true, scramble: '' })).toBe(
      'DNF'
    );
    expect(
      showRecord({ time: 59999, date: 0, isDNF: true, scramble: '' })
    ).toBe('DNF');
    expect(
      showRecord({ time: 60000, date: 0, isDNF: true, scramble: '' })
    ).toBe('DNF');
    expect(
      showRecord({ time: 123456, date: 0, isDNF: true, scramble: '' })
    ).toBe('DNF');
  });
});
