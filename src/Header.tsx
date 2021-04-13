import { VFC } from 'react';
import { NavLink } from 'react-router-dom';
import { RouteList } from './route';

export const Header: VFC = () => (
  <header>
    <nav>
      <ul>
        {RouteList.map(({ path, name }) => (
          <li key={path}>
            <NavLink to={path} exact>
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
