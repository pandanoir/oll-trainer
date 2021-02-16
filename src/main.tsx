import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './Header';
import { LearningPage, ListPage, OllPage } from './pages';
import { CheckContext, useCheck } from './utils';
import './index.css';

const App = () => {
  const { checkList, check, reset } = useCheck();
  return (
    <CheckContext.Provider value={{ checkList, check, reset }}>
      <Router basename="/oll">
        <Header />
        <Switch>
          <Route path={['/', '/oll']} exact>
            <OllPage />
          </Route>
          <Route path="/learn" exact>
            <LearningPage />
          </Route>
          <Route path="/list" exact>
            <ListPage />
          </Route>
        </Switch>
      </Router>
    </CheckContext.Provider>
  );
};
render(<App />, document.querySelector('#app'));
