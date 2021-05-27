import { VFC } from 'react';
import { NavLink } from 'react-router-dom';
import 'twin.macro';
import { RouteList } from './route';

export const Header: VFC<{ right: JSX.Element }> = ({ right }) => (
  <header tw="px-3 py-6 mb-5 bg-white dark:bg-gray-800">
    <nav tw="flex place-content-between">
      <ul tw="m-0 p-0 list-none flex gap-3">
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
      </ul>
      {right}
    </nav>
  </header>
);
