import { faQuora } from '@fortawesome/free-brands-svg-icons';
import {
  faCube,
  faExclamation,
  faHourglassStart,
  faPen,
  faRandom,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import useTitle from 'react-use/lib/useTitle';
import 'twin.macro';

const RouteList = [
  { path: '/timer', name: 'Hi-Timer', icon: faStopwatch },
  { path: '/oll', name: 'oll', icon: faCube },
  { path: '/quiz', name: 'quiz', icon: faQuora },
  { path: '/scramble', name: 'scramble', icon: faRandom },
  { path: '/inspection', name: 'inspection', icon: faHourglassStart },
  { path: '/learn', name: 'learn', icon: faPen },
] as const;

export const TopPage = () => {
  useTitle('Top page');
  return (
    <div tw="flex justify-center space-x-4 gap-y-3 flex-wrap">
      {RouteList.map(({ path, name, icon = faExclamation }) => (
        <div key={path} tw="flex flex-col space-y-1 text-center">
          <NavLink
            to={path}
            tw="text-4xl text-center px-6 py-2 border-2 border-blue-400 text-blue-600 bg-transparent rounded-md dark:border-blue-400 dark:text-blue-300"
          >
            <FontAwesomeIcon icon={icon} />
          </NavLink>
          {name}
        </div>
      ))}
    </div>
  );
};
