import { PrioritySumStructure } from './prioritySumStructure';

describe('PrioritySumStructure', () => {
  it('calculates sum of best 5', () => {
    const maxSum = new PrioritySumStructure(
      5,
      (a, b) => a > b,
      (a, b) => a < b
    );
    maxSum.insert(3);
    maxSum.insert(1);
    maxSum.insert(4);
    maxSum.insert(1);
    maxSum.insert(5);
    expect(maxSum.query()).toBe(14);
    maxSum.insert(14);
    expect(maxSum.query()).toBe(27);
    maxSum.insert(14);
    expect(maxSum.query()).toBe(40);
    maxSum.insert(2);
    expect(maxSum.query()).toBe(40);
  });
  it('calculates sum of worst 5', () => {
    const minSum = new PrioritySumStructure(5);
    minSum.insert(3);
    minSum.insert(1);
    minSum.insert(4);
    minSum.insert(1);
    minSum.insert(5);
    expect(minSum.query()).toBe(14);
    minSum.insert(14);
    expect(minSum.query()).toBe(14);
    minSum.insert(14);
    expect(minSum.query()).toBe(14);
    minSum.insert(2);
    expect(minSum.query()).toBe(11);
  });
});
