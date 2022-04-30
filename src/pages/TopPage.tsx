import { faQuora } from '@fortawesome/free-brands-svg-icons';
import {
  faCube,
  faExclamation,
  faEyeSlash,
  faHourglassStart,
  faPen,
  faRandom,
  faStopwatch,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import useTitle from 'react-use/lib/useTitle';
import 'twin.macro';
import { RouteList } from '../route';

const icons: { [k in typeof RouteList[number]['name']]: IconDefinition } = {
  'Hi-Timer': faStopwatch,
  oll: faCube,
  quiz: faQuora,
  scramble: faRandom,
  inspection: faHourglassStart,
  learn: faPen,
  'cp check': faExclamation,
  execution: faEyeSlash,
};

export const TopPage = () => {
  useTitle('Top page');
  return (
    <div tw="flex justify-center space-x-4 gap-y-3 flex-wrap">
      {RouteList.map(({ path, name }) => (
        <div key={path} tw="flex flex-col space-y-1 text-center">
          <NavLink
            to={path}
            tw="text-4xl text-center px-6 py-2 border-2 border-blue-400 text-blue-600 bg-transparent rounded-md dark:border-blue-400 dark:text-blue-300"
          >
            <FontAwesomeIcon icon={icons[name]} />
          </NavLink>
          {name}
        </div>
      ))}
    </div>
  );
};
