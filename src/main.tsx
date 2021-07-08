import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, VFC } from 'react';
import { render } from 'react-dom';
import { MessageFormatElement, IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'twin.macro';

import en from '../compiled-lang/en.json';
import ja from '../compiled-lang/ja.json';
import { SwitchButton } from './components/common/SwitchButton';
import { Header } from './components/Header';
import { RouteList } from './route';
import { VolumeContext } from './utils/hooks/useAudio';
import { CheckContext, useCheck } from './utils/hooks/useCheck';
import { useDarkMode, DarkModeContext } from './utils/hooks/useDarkMode';
import { useStoragedState } from './utils/hooks/useLocalStorage';
import { withPrefix } from './utils/withPrefix';
import './index.css';

const selectMessages = (
  locale: string
): Record<string, string> | Record<string, MessageFormatElement[]> => {
  switch (locale) {
    case 'en':
      return en;
    case 'ja':
      return ja;
    default:
      return en;
  }
};

const App: VFC = () => {
  const { checkList, check, reset } = useCheck();
  const { darkMode, setLightMode, setDarkMode } = useDarkMode();
  const OllPage = useMemo(
    () => RouteList.find(({ name }) => name === 'oll')?.component,
    []
  );
  const [locale] = useStoragedState(withPrefix('locale'), navigator.language);
  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={selectMessages(locale)}
    >
      <VolumeContext.Provider value={useStoragedState(withPrefix('volume'), 1)}>
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
      </VolumeContext.Provider>
    </IntlProvider>
  );
};
render(<App />, document.querySelector('#app'));
