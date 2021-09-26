import tw from 'twin.macro';
import { Button } from './Button';

export const DangerButton = tw(Button)`px-10 py-1.5
border-pink-400 dark:border-pink-600
bg-pink-600 dark:bg-pink-700
bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700
text-white rounded
`;
