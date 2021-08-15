import { TimeData, DNF } from '../components/Timer/timeData';
import { calcRecord } from './calcRecord';
import { PrioritySumStructure } from './prioritySumStructure';

// calcAo と同じアルゴリズムで best Ao を計算する
export const calcBestAo = (
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

  let bestAo = Infinity;
  for (let i = 0, len = times.length, sum = 0, dnfCount = 0; i < len; i++) {
    const record = calcRecord(times[i]);
    if (record === DNF) {
      dnfCount++;
    } else {
      sumOfWorsts.insert(record);
      sumOfBests.insert(record);
      sum += record;
    }
    if (i + 1 < n) {
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
      continue;
    }
    if (dnfCount === 1) {
      bestAo = Math.min(
        bestAo,
        (sum - sumOfBests.query()) / (n - fivePercent * 2)
      );
    } else {
      bestAo = Math.min(
        bestAo,
        (sum - sumOfWorsts.query() - sumOfBests.query()) / (n - fivePercent * 2)
      );
    }
  }
  return bestAo;
};
