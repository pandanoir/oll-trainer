import tw from 'twin.macro';
import { Button } from './Button';

export const PrimaryButton = tw(Button)`px-10 py-1.5  rounded
bg-blue-400 border-blue-400 text-gray-100
dark:bg-blue-700 dark:border-blue-600 dark:text-white dark:font-normal
bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700 
`;
