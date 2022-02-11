import tw from 'twin.macro';
import { Button } from './Button';

export const SecondaryDangerButton = tw(
  Button
)`border-2 border-pink-400 text-pink-600 font-bold rounded
dark:border-pink-600 dark:text-pink-500
disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-default
disabled:dark:border-gray-600 disabled:dark:text-gray-500`;
