import { VFC } from 'react';
import { NavLink } from 'react-router-dom';
import { Route } from './route';

export const Header: VFC = () => (
  <header>
    <nav>
      <ul>
        {Route.map(({ path, name }) => (
          <li key="path">
            <NavLink to={path} exact>
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
