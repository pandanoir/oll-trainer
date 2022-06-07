import tw from 'twin.macro';
import { Button } from './Button';

export const PrimaryButton = tw(Button)`px-10 py-1.5  rounded
border-blue-400 text-gray-100
dark:border-blue-600 dark:text-white dark:font-normal
bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700
disabled:text-gray-400 disabled:dark:text-gray-400 disabled:cursor-not-allowed
disabled:from-blue-700 disabled:to-blue-700 disabled:dark:from-blue-800 disabled:dark:to-blue-800
`;
