import { calcAverage } from './calcAverage';

export const calcStandardDeviation = (arr: number[]) => {
  let sum = 0;
  const avg = calcAverage(arr);
  for (let i = 0, len = arr.length; i < len; i++) {
    sum += (arr[i] - avg) ** 2;
  }
  return Math.sqrt(sum / arr.length);
};
