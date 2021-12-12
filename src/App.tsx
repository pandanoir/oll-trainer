import { useCallback, VFC } from 'react';
import { render } from 'react-dom';
import { MessageFormatElement, IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'twin.macro';

import en from '../compiled-lang/en.json';
import ja from '../compiled-lang/ja.json';
import { Modal, useModal } from './components/common/Modal';
import { ModalCloseButton } from './components/common/ModalCloseButton';
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

export const App: VFC = () => {
  const { darkMode, setDarkMode, setLightMode } = useDarkMode();
  const [locale, setLocale] = useStoragedState(
    withPrefix('locale'),
    navigator.language
  );
  const { showsModal, openModal, closeModal } = useModal();

  const app = (
    <BrowserRouter basename="/oll">
      <Header
        onSettingButtonClick={openModal}
        onDarkModeToggle={useCallback(() => {
          if (darkMode) {
            setLightMode();
          } else {
            setDarkMode();
          }
        }, [darkMode, setDarkMode, setLightMode])}
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
    </BrowserRouter>
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
