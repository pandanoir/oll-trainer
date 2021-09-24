import { memo } from 'react';
import tw from 'twin.macro';
import { Button } from './Button';

const SecondaryButtonRaw = tw(
  Button
)`border-2 border-blue-400 text-blue-600 bg-transparent rounded-md font-bold dark:border-blue-400 dark:text-blue-300`;
export const SecondaryButton = memo(SecondaryButtonRaw);
