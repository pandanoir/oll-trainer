export const zerofill = (n: number, digit: number) =>
  `${'0'.repeat(digit)}${n}`.slice(-digit);
