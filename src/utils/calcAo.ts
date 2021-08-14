import { Average, DNF, TimeData } from '../components/Timer/timeData';
import { calcRecord } from './calcRecord';
import { PrioritySumStructure } from './prioritySumStructure';

/**
 * 上位5%と下位5%を除いた平均を求める(除く数は小数点以下切り上げた個数)
 */
export const calcAo = (
  n: number,
  times: Pick<TimeData, 'time' | 'isDNF' | 'penalty'>[]
) => {
  const fivePercent = Math.ceil(n * 0.05);
  const sumOfWorsts = new PrioritySumStructure(
      fivePercent,
      (a, b) => a > b,
      (a, b) => a < b
    ),
    sumOfBests = new PrioritySumStructure(fivePercent);

  let sum = 0,
    dnfCount = 0;
  const ao: Average[] = [];
  for (let i = 0, len = times.length; i < len; i++) {
    const record = calcRecord(times[i]);
    if (record === DNF) {
      dnfCount++;
    } else {
      sumOfWorsts.insert(record);
      sumOfBests.insert(record);
      sum += record;
    }
    if (i + 1 < n) {
      ao[i] = null;
      continue;
    }
    if (i + 1 > n) {
      const record = calcRecord(times[i - n]);
      if (record === DNF) {
        dnfCount--;
      } else {
        sumOfWorsts.erase(record);
        sumOfBests.erase(record);
        sum -= record;
      }
    }
    if (dnfCount >= 2) {
      ao[i] = DNF;
    } else if (dnfCount === 1) {
      ao[i] = (sum - sumOfBests.query()) / (n - fivePercent * 2);
    } else {
      ao[i] =
        (sum - sumOfWorsts.query() - sumOfBests.query()) /
        (n - fivePercent * 2);
    }
  }
  return ao;
};
