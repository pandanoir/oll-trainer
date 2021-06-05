import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { storagePrefix } from '../../constants';

const STORAGE_KEY = `${storagePrefix}-theme`;
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // localStorage に設定があればそれを使用、なければ環境設定を使用
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json === null) {
        return;
      }
      const item: unknown = JSON.parse(json);
      if (typeof item === 'boolean') {
        setDarkMode(item);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  return {
    darkMode,
    setLightMode: useCallback(() => {
      setDarkMode(false);
    }, []),
    setDarkMode: useCallback(() => {
      setDarkMode(true);
    }, []),
  };
};

export const DarkModeContext = createContext(false);
export const useDarkModeState = () => {
  return useContext(DarkModeContext);
};
