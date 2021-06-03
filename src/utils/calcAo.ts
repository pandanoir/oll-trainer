import { Average, DNF, TimeData } from '../components/Timer/timeData';
import { Heap } from './heap';
import { calcRecord } from './calcRecord';

export const calcAo = (n: number, times: TimeData[]) => {
  const maxHeap = new Heap(),
    minHeap = new Heap((x: number, y: number) => x > y);
  let sum = 0,
    dnfCount = 0;
  const ao: Average[] = [];
  for (let i = 0, len = times.length; i < len; i++) {
    const record = calcRecord(times[i]);
    if (record === DNF) {
      dnfCount++;
    } else {
      maxHeap.push(record);
      minHeap.push(record);
      sum += record;
    }
    if (i + 1 < n) {
      ao.push(null);
      continue;
    }
    if (i + 1 > n) {
      const record = calcRecord(times[i - n]);
      if (record === DNF) {
        dnfCount--;
      } else {
        maxHeap.remove(record);
        minHeap.remove(record);
        sum -= record;
      }
    }
    if (dnfCount >= 2) {
      ao.push(DNF);
    } else if (dnfCount === 1) {
      ao.push((sum - minHeap.top()) / (n - 2));
    } else {
      ao.push((sum - maxHeap.top() - minHeap.top()) / (n - 2));
    }
  }
  return ao;
};
