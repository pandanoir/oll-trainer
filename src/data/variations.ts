import { createContext } from 'react';
import { Updater } from 'use-immer';
import { noop } from '../utils/noop';

// name は unique とする
export type Scramble = '3x3' | '2x2' | '4x4';
export const availableScrambles: Scramble[] = ['3x3'];
export type Variation = { name: string; scramble: Scramble };
export const defaultVariation = { name: '3x3', scramble: '3x3' } as const;
export const defaultVariations: Variation[] = [
  defaultVariation,
  { name: '3x3 OH', scramble: '3x3' },
  { name: '3x3 BLD', scramble: '3x3' },
];
export const UserDefinedVariationContext = createContext<
  readonly [Variation[], Updater<Variation[]>]
>([[], noop]);
