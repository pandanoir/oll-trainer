import { DNF } from '../features/timer/data/timeData';
import { calcRecord } from './calcRecord';

describe('calcRecord', () => {
  it('calculates actual time by record', () => {
    expect(calcRecord({ time: 10 })).toBe(10);
    expect(calcRecord({ time: 10, isDNF: true })).toBe(DNF);
    expect(calcRecord({ time: 10, penalty: true })).toBe(2010);
    expect(calcRecord({ time: 10, penalty: true, isDNF: true })).toBe(DNF);
  });
});
