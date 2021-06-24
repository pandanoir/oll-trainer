// name は unique とする
export type Variation = { name: string; scramble: string };
export const defaultVariation = { name: '3x3', scramble: '3x3' } as const;
export const defaultVariations: Variation[] = [
  defaultVariation,
  { name: '3x3 OH', scramble: '3x3' },
  { name: '3x3 BLD', scramble: '3x3' },
];
