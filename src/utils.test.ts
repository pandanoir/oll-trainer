import { calculateScramble, modulo, rotate } from './utils';
describe('modulo()', () => {
  it('obtains a modulo', () => {
    expect(modulo(-2, 5)).toBe(3);
    expect(modulo(0, 5)).toBe(0);
    expect(modulo(7, 5)).toBe(2);
    expect(modulo(-21, 5)).toBe(4);
    expect(modulo(101, 5)).toBe(1);
  });
});
describe('rotate()', () => {
  it('rotates given array counterclockwise', () => {
    const arr = [...[1, 2, 3], ...[4, 5, 6], ...[7, 8, 9]] as const;
    expect(rotate(arr)).toEqual([...[3, 6, 9], ...[2, 5, 8], ...[1, 4, 7]]);
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(
      rotate(rotate([...[1, 2, 3], ...[4, 5, 6], ...[7, 8, 9]] as const))
    ).toEqual([...[9, 8, 7], ...[6, 5, 4], ...[3, 2, 1]]);
  });
});
describe('calculateScramble', () => {
  it('returns reverse procedure', () => {
    expect(calculateScramble(`R U R' U'`)).toBe(`U R U' R'`);
  });
  // scramble を回したらF緑U白で手順が開始できる
  it('considers reorientation', () => {
    expect(calculateScramble(`x' R U' R' D R U R' D'`)).toBe(
      `x' D R U' R' D' R U R' x`
    );
    expect(calculateScramble(`R' U' R U x' z' R U L' U' M'`)).toBe(
      `x' z' x M U L U' R' z x U' R' U R`
    );
    expect(calculateScramble(`R' U R' U' y R' F' R2 U' R' U R' F R F`)).toBe(
      `y F' R' F' R U' R U R'2 F R y' U R U' R`
    );
    expect(calculateScramble(`R' U R' U' y R' F' R2 U' R' U R' F R F y'`)).toBe(
      `y F' R' F' R U' R U R'2 F R y' U R U' R`
    );
    expect(calculateScramble(`y y R U R' U' y'`)).toBe(`y2 U R U' R' y2`);
    expect(calculateScramble(`Rw M`)).toBe(`M' Rw'`);
    expect(calculateScramble(`Fw M`)).toBe(`z x' M' Fw'`);
    expect(
      calculateScramble(`(U') Fw R U R' U' Fw' U R U R' U' R' F R F'`)
    ).toBe(`F R' F' R U R U' R' U' Fw U R U' R' Fw' (U)`);
  });
});
