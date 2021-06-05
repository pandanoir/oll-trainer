import { exhaustiveCheck } from './exhaustiveCheck';
import { noop } from './noop';

describe('exhaustiveCheck', () => {
  it('do nothing because exhaustiveCheck is used for type checking', () => {
    const a = 3;
    if (typeof a === 'number') {
      noop();
    } else expect(exhaustiveCheck(a)).toBeUndefined();

    // @ts-expect-error: 一応id関数になっていることを確認
    expect(exhaustiveCheck(a)).toBe(a);
  });
});
