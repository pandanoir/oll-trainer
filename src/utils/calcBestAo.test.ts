import { calcBestAo } from './calcBestAo';

describe('calcBestAo', () => {
  it('calculates the best rolling average', () => {
    expect(
      calcBestAo(5, [
        { time: 483 },
        { time: 796 },
        { time: 589 },
        { time: 969 },
        { time: 422 },
        { time: 578, penalty: true },
        { time: 797, isDNF: true, penalty: true },
        { time: 737, isDNF: true },
        { time: 753 },
        { time: 812 },
        { time: 282 },
        { time: 815 },
        { time: 940 },
        { time: 884 },
        { time: 154 },
        { time: 365 },
        { time: 651 },
        { time: 713 },
        { time: 492 },
        { time: 607 },
        { time: 112 },
      ])
    ).toEqual(1508 / 3);
  });
  it('returns Infinity if all records are DNF', () => {
    expect(
      calcBestAo(5, [
        { time: 1, isDNF: true },
        { time: 10 },
        { time: 100, isDNF: true },
        { time: 5 },
        { time: 80 },
      ])
    ).toEqual(Infinity);
  });
  it('considers penalty', () => {
    expect(
      calcBestAo(5, [
        { time: 1000 },
        { time: 10000, penalty: true },
        { time: 100000 },
        { time: 5000 },
        { time: 20000 },
      ])
    ).toEqual((5000 + 12000 + 20000) / 3);
  });
  it('calculates the best average excluding 5% of best and 5% of worst times', () => {
    const data = [
      { time: 483 },
      { time: 796 },
      { time: 589 },
      { time: 969 },
      { time: 422 },
      { time: 578 },
      { time: 797 },
      { time: 737 },
      { time: 753 },
      { time: 812 },
      { time: 282 },
      { time: 815 },
      { time: 940 },
      { time: 884 },
      { time: 154 },
      { time: 365 },
      { time: 651 },
      { time: 713 },
      { time: 492 },
      { time: 607 },
      { time: 112 },
      { time: 643 },
      { time: 912 },
      { time: 573 },
      { time: 7 },
      { time: 556 },
      { time: 935 },
      { time: 488 },
      { time: 835 },
      { time: 696 },
      { time: 766 },
      { time: 626 },
      { time: 233 },
      { time: 702 },
      { time: 20 },
      { time: 13 },
      { time: 471 },
      { time: 945 },
      { time: 354 },
      { time: 996 },
      { time: 233 },
      { time: 190 },
      { time: 392 },
      { time: 62 },
      { time: 486 },
      { time: 935 },
      { time: 936 },
      { time: 980 },
      { time: 486 },
      { time: 931 },
      { time: 182 },
      { time: 403 },
      { time: 175 },
      { time: 945 },
      { time: 799 },
      { time: 567 },
      { time: 398 },
      { time: 996 },
      { time: 128 },
      { time: 858 },
      { time: 943 },
      { time: 974 },
      { time: 920 },
      { time: 90 },
      { time: 232 },
      { time: 681 },
      { time: 536 },
      { time: 43 },
      { time: 161 },
      { time: 148 },
      { time: 36 },
      { time: 783 },
      { time: 701 },
      { time: 174 },
      { time: 527 },
      { time: 120 },
      { time: 881 },
      { time: 890 },
      { time: 829 },
      { time: 105 },
      { time: 788 },
      { time: 782 },
      { time: 559 },
      { time: 254 },
      { time: 388 },
      { time: 61 },
      { time: 373 },
      { time: 615 },
      { time: 487 },
      { time: 116 },
      { time: 204 },
      { time: 617 },
      { time: 434 },
      { time: 1 },
      { time: 231 },
      { time: 903 },
      { time: 935 },
      { time: 458 },
      { time: 242 },
      { time: 233 },
    ];
    const sorted = data.concat().sort((a, b) => a.time - b.time);

    expect(calcBestAo(100, data)).toEqual(
      (sorted.reduce((acc, a) => acc + a.time, 0) -
        (sorted.slice(0, 5).reduce((acc, a) => acc + a.time, 0) +
          sorted.slice(-5).reduce((acc, a) => acc + a.time, 0))) /
        90
    );
  });
});
