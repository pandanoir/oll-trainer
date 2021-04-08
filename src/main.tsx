import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './Header';
import { OllPage } from './pages';
import { CheckContext, useCheck } from './utils';
import './index.css';
import { Route as RouteInfo } from './route';

const App = () => {
  const { checkList, check, reset } = useCheck();
  return (
    <CheckContext.Provider value={{ checkList, check, reset }}>
      <Router basename="/oll">
        <Header />
        <Switch>
          <Route path={['/oll']} exact>
            <OllPage />
          </Route>
          {RouteInfo.map(({ path, component }) => (
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
