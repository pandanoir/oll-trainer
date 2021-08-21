import tw from 'twin.macro';
import { ExportButton as ExportButtonRaw } from '../common/ExportButton';

export const ExportButton = tw(
  ExportButtonRaw
)`px-10 py-1.5 bg-blue-400 border-blue-500 rounded font-bold px-3.5 py-0 border-0 border-b-2 whitespace-nowrap  dark:bg-blue-700 dark:border-blue-600`;

// export const PrimaryButton = tw(
//   Button
// )`px-10 py-1.5 border-blue-400 bg-blue-400 text-black rounded font-bold dark:bg-blue-700 dark:border-blue-600 dark:text-white dark:font-normal`;
