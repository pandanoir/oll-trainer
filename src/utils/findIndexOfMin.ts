export const findIndexOfMin = (arr: number[]) =>
  arr.length === 0
    ? -1
    : arr.reduce(
        (index, item, currentIndex) =>
          item < arr[index] ? currentIndex : index,
        0
      );
