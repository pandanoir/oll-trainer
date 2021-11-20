import { faCog, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC } from 'react';
import { render } from 'react-dom';
import { MessageFormatElement, IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'twin.macro';

import en from '../compiled-lang/en.json';
import ja from '../compiled-lang/ja.json';
import { IconButton } from './components/common/IconButton';
import { Modal, useModal } from './components/common/Modal';
import { ModalCloseButton } from './components/common/ModalCloseButton';
import { SwitchButton } from './components/common/SwitchButton';
import { Header } from './components/Header';
import { LanguageSettingSelect } from './components/Timer/LanguageSettingSelect';
import { UserDefinedVariationContext, Variation } from './data/variations';
import { NotFoundPage } from './pages/NotFoundPage';
import { TopPage } from './pages/TopPage';
import { RouteList } from './route';
import { VolumeContext } from './utils/hooks/useAudio';
import { CheckContext, useCheck } from './utils/hooks/useCheck';
import { useDarkMode, DarkModeContext } from './utils/hooks/useDarkMode';
import {
  useStoragedImmerState,
  useStoragedState,
} from './utils/hooks/useLocalStorage';
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
  const { darkMode, setLightMode, setDarkMode } = useDarkMode();
  const [locale, setLocale] = useStoragedState(
    withPrefix('locale'),
    navigator.language
  );
  const { showsModal, openModal, closeModal } = useModal();

  const app = (
    <Router basename="/oll">
      <Header
        right={
          <span tw="flex space-x-2">
            <IconButton
              tw="w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-white"
              icon={faCog}
              onClick={openModal}
            />
            <span tw="flex items-center flex-nowrap">
              <SwitchButton
                value={darkMode ? 'right' : 'left'}
                onChange={(value) => {
                  if (value === 'left') setLightMode();
                  else setDarkMode();
                }}
              />
              <FontAwesomeIcon icon={faMoon} />
            </span>
          </span>
        }
      />
      <Routes>
        <Route path="/" element={<TopPage />} />
        {RouteList.map(({ path, component }) => (
          <Route path={path} key={path} element={component} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showsModal && (
        <Modal onClose={closeModal}>
          <ModalCloseButton onClick={closeModal} />
          <div tw="flex flex-col px-3.5 py-5 space-y-2 h-full">
            <div tw="text-lg">Settings</div>
            <LanguageSettingSelect locale={locale} setLocale={setLocale} />
          </div>
        </Modal>
      )}
    </Router>
  );

  return (
    <UserDefinedVariationContext.Provider
      value={useStoragedImmerState<Variation[]>(
        withPrefix('user-defined-variations'),
        []
      )}
    >
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={selectMessages(locale)}
      >
        <VolumeContext.Provider
          value={useStoragedState(withPrefix('volume'), 1)}
        >
          <DarkModeContext.Provider value={darkMode}>
            <CheckContext.Provider value={useCheck()}>
              {app}
            </CheckContext.Provider>
          </DarkModeContext.Provider>
        </VolumeContext.Provider>
      </IntlProvider>
    </UserDefinedVariationContext.Provider>
  );
};
render(<App />, document.querySelector('#app'));
