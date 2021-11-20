import {
  useEffect,
  useCallback,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { useLocalStorage } from 'react-use';
import { withPrefix } from '../withPrefix';

const STORAGE_KEY = withPrefix('theme');
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useLocalStorage(
    STORAGE_KEY,
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) as [boolean, Dispatch<SetStateAction<boolean>>, () => void];

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
    }, [setDarkMode]),
    setDarkMode: useCallback(() => {
      setDarkMode(true);
    }, [setDarkMode]),
  };
};

export const DarkModeContext = createContext(false);
export const useDarkModeState = () => {
  return useContext(DarkModeContext);
};
