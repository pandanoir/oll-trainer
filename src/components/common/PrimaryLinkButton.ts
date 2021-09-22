import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

export const PrimaryLinkButton = tw(
  NavLink
)`border inline-block cursor-pointer select-none focus:outline-none pointer-events-auto whitespace-nowrap
px-10 py-1.5 border-blue-400 bg-blue-400 text-gray-800 rounded font-bold dark:bg-blue-700 dark:border-blue-600 dark:text-white dark:font-normal`;
