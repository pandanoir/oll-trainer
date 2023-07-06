import {
  faBars,
  faCog,
  faExternalLinkAlt,
  faMoon,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useState, VFC } from 'react';
import { createPortal } from 'react-dom';
import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';
import tw from 'twin.macro';

import { RouteList } from '../route';
import { useDarkModeState } from '../utils/hooks/useDarkMode';
import { usePortalRoot } from '../utils/hooks/usePortalRoot';
import { IconButton } from './common/IconButton';
import { SwitchButton } from './common/SwitchButton';

const CustomNavLink = ({ children, to, className, ...props }: LinkProps) => {
  const resolved = useResolvedPath(to);
  const isActive = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      to={to}
      className={clsx(className, { 'font-bold': isActive })}
      {...props}
    >
      {children}
    </Link>
  );
};

const SideMenu: VFC<{ hidden?: boolean; onClose: () => void }> = ({
  hidden = false,
  onClose,
}) => {
  const [prevHidden, setPrevHidden] = useState(hidden);
  const linkStyle = tw`inline-block no-underline text-gray-600 dark:text-gray-300 py-1.5`;

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
              <CustomNavLink to={path} css={linkStyle} onClick={onClose}>
                {name}
              </CustomNavLink>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/pandanoir/oll-trainer"
              target="_blank"
              rel="noreferrer"
              css={[linkStyle, tw`flex space-x-1 items-center`]}
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

export const Header: VFC<{
  onSettingButtonClick: () => void;
  onDarkModeToggle: () => void;
}> = ({ onSettingButtonClick, onDarkModeToggle }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const linkStyle = tw`no-underline text-gray-600 dark:text-gray-300 hover:text-hover hover:dark:text-hover-dark hover:underline`;
  const darkMode = useDarkModeState();

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
                <CustomNavLink to={path} css={linkStyle}>
                  {name}
                </CustomNavLink>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/pandanoir/oll-trainer"
                target="_blank"
                rel="noreferrer"
                css={[linkStyle, tw`flex space-x-1 items-center`]}
              >
                <span>GitHub</span>
                <FontAwesomeIcon tw="text-sm" icon={faExternalLinkAlt} />
              </a>
            </li>
          </ul>
        </span>
        <span tw="flex space-x-2">
          <a
            href="https://hi-timer.vercel.app"
            target="_blank"
            rel="noreferrer"
            tw="px-2 border-2 border-transparent bg-yellow-400 font-bold text-white dark:border-yellow-500 dark:bg-transparent dark:text-yellow-300"
          >
            new timer available!
          </a>
          <IconButton
            tw="w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-white"
            icon={faCog}
            onClick={onSettingButtonClick}
          />
          <span tw="flex items-center flex-nowrap">
            <SwitchButton
              value={darkMode ? 'right' : 'left'}
              onChange={onDarkModeToggle}
            />
            <FontAwesomeIcon icon={faMoon} />
          </span>
        </span>
      </nav>
      <SideMenu
        hidden={!isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </header>
  );
};
