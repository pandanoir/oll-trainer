import { memo } from 'react';
import tw from 'twin.macro';
import { Button } from './Button';

const SecondaryButtonRaw = tw(Button)`
border-2 border-blue-400 text-blue-600 bg-transparent rounded-md font-bold
dark:border-blue-400 dark:text-blue-300
disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-default
disabled:dark:border-gray-600 disabled:dark:text-gray-500`;
export const SecondaryButton = memo(SecondaryButtonRaw);
