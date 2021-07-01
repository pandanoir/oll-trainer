import { useMemo, VFC } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'twin.macro';

import { Header } from './Header';
import { CheckContext, useCheck } from './utils/hooks/useCheck';
import './index.css';
import { RouteList } from './route';
import { useDarkMode, DarkModeContext } from './utils/hooks/useDarkMode';
import { SwitchButton } from './components/common/SwitchButton';

const App: VFC = () => {
  const { checkList, check, reset } = useCheck();
  const { darkMode, setLightMode, setDarkMode } = useDarkMode();
  const OllPage = useMemo(
    () => RouteList.find(({ name }) => name === 'oll')?.component,
    []
  );
  return (
    <DarkModeContext.Provider value={darkMode}>
      <CheckContext.Provider value={{ checkList, check, reset }}>
        <Router basename="/oll">
          <Header
            right={
              <div tw="flex items-center flex-nowrap">
                <SwitchButton
                  value={darkMode ? 'right' : 'left'}
                  onChange={(value) => {
                    if (value === 'left') {
                      setLightMode();
                    } else {
                      setDarkMode();
                    }
                  }}
                />
                <FontAwesomeIcon icon={faMoon} />
              </div>
            }
          />
          <Switch>
            <Route path={['/oll']} exact>
              {OllPage}
            </Route>
            {RouteList.map(({ path, component }) => (
              <Route path={path} exact key={path}>
                {component}
              </Route>
            ))}
          </Switch>
        </Router>
      </CheckContext.Provider>
    </DarkModeContext.Provider>
  );
};
render(<App />, document.querySelector('#app'));
