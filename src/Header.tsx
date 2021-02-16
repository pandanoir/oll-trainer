import { FC } from 'react';
import { NavLink } from 'react-router-dom';

export const Header: FC = () => (
  <header>
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact>
            oll
          </NavLink>
        </li>
        <li>
          <NavLink to="/learn" exact>
            learn
          </NavLink>
        </li>
        <li>
          <NavLink to="/list" exact>
            checklist
          </NavLink>
        </li>
      </ul>
    </nav>
  </header>
);
