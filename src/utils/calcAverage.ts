export const calcAverage = (arr: number[]) => {
  let sum = 0;
  for (let i = 0, len = arr.length; i < len; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
};
