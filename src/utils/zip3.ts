export const zip3 = <A, B, C>(arr1: A[], arr2: B[], arr3: C[]) =>
  arr1.map((item, index) => [item, arr2[index], arr3[index]] as const);
