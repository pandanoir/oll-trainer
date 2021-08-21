import {
  faBars,
  faExternalLinkAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, VFC } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

import { RouteList } from '../route';
import { usePortalRoot } from '../utils/hooks/usePortalRoot';
import { IconButton } from './common/IconButton';

const SideMenu: VFC<{ hidden?: boolean; onClose: () => void }> = ({
  hidden = false,
  onClose,
}) => {
  const [prevHidden, setPrevHidden] = useState(hidden);

  return createPortal(
    <div
      css={[
        hidden && prevHidden
          ? tw`opacity-0 pointer-events-none`
          : tw`md:hidden absolute z-10 inset-0 bg-gray-300 bg-opacity-30 dark:bg-black dark:bg-opacity-50`,
      ]}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        css={[
          tw`m-0 p-3 pr-6 flex flex-col transform items-start space-y-3 md:hidden list-none border-r-2 absolute top-0 bottom-0 bg-white dark:bg-gray-800 transition-transform duration-150`,
          hidden ? tw`-translate-x-full` : tw`translate-x-0`,
        ]}
        onTransitionEnd={() => setPrevHidden(hidden)}
      >
        <IconButton
          tw="dark:text-white p-1 py-0.5 text-lg"
          icon={faTimes}
          onClick={onClose}
        />
        <ul tw="flex flex-col space-y-1">
          {RouteList.map(({ path, name }) => (
            <li key={path}>
              <NavLink
                to={path}
                exact
                tw="inline-block no-underline text-gray-600 dark:text-gray-300 py-1.5"
                activeClassName="font-bold"
                onClick={onClose}
              >
                {name}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/pandanoir/oll-trainer"
              target="_blank"
              rel="noreferrer"
              tw="no-underline text-gray-600 dark:text-gray-300 flex space-x-1 items-center"
            >
              <span>GitHub</span>
              <FontAwesomeIcon tw="text-sm" icon={faExternalLinkAlt} />
            </a>
          </li>
        </ul>
      </div>
    </div>,
    usePortalRoot().current
  );
};

export const Header: VFC<{ right: JSX.Element }> = ({ right }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  return (
    <header tw="px-3 pt-5 pb-3 bg-white dark:bg-gray-800">
      <nav tw="flex place-content-between">
        <span>
          <IconButton
            icon={faBars}
            tw="md:hidden"
            onClick={() => setIsMenuVisible((b) => !b)}
          />
          <ul tw="m-0 p-0 list-none hidden md:flex md:flex-row md:space-x-3">
            {RouteList.map(({ path, name }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  exact
                  tw="no-underline text-gray-600 dark:text-gray-300"
                  activeClassName="font-bold"
                >
                  {name}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/pandanoir/oll-trainer"
                target="_blank"
                rel="noreferrer"
                tw="no-underline text-gray-600 dark:text-gray-300 flex space-x-1 items-center"
              >
                <span>GitHub</span>
                <FontAwesomeIcon tw="text-sm" icon={faExternalLinkAlt} />
              </a>
            </li>
          </ul>
        </span>
        {right}
      </nav>
      <SideMenu
        hidden={!isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </header>
  );
};
