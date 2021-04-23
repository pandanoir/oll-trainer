import { VFC } from 'react';
import { NavLink } from 'react-router-dom';
import { RouteList } from './route';

export const Header: VFC = () => (
  <header className="px-3 py-6 mb-5">
    <nav>
      <ul className="m-0 p-0 list-none flex gap-3">
        {RouteList.map(({ path, name }) => (
          <li key={path}>
            <NavLink
              to={path}
              exact
              className="no-underline text-gray-600"
              activeClassName="font-bold"
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
