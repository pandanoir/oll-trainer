import { VFC } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './Header';
import { OllPage } from './pages';
import { CheckContext, useCheck } from './utils/hooks/useCheck';
import './index.css';
import { RouteList } from './route';

const App: VFC = () => {
  const { checkList, check, reset } = useCheck();
  return (
    <CheckContext.Provider value={{ checkList, check, reset }}>
      <Router basename="/oll">
        <Header />
        <Switch>
          <Route path={['/oll']} exact>
            <OllPage />
          </Route>
          {RouteList.map(({ path, component }) => (
            <Route path={path} exact key={path}>
              {component}
            </Route>
          ))}
        </Switch>
      </Router>
    </CheckContext.Provider>
  );
};
render(<App />, document.querySelector('#app'));
