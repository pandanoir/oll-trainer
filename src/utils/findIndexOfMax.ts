export const findIndexOfMax = (arr: number[]) =>
  arr.reduce(
    (index, item, currentIndex) => (item > arr[index] ? currentIndex : index),
    0
  );
