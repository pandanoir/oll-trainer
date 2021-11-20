import { DNF } from '../features/timer/data/timeData';
import { showAverage } from './showAverage';

describe('showAverage', () => {
  it('prints Average', () => {
    expect(showAverage(null)).toBe('');
    expect(showAverage(null, '-')).toBe('-');
    expect(showAverage(DNF)).toBe('DNF');
    expect(showAverage(60000)).toBe('1:00.000');
    expect(showAverage(59999)).toBe('59.999');
    expect(showAverage(999)).toBe('0.999');
  });
});
