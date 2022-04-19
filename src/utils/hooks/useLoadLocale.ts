import { useState, useEffect } from 'react';
import { Locales } from '../../i18n/i18n-types';
import { loadLocaleAsync } from '../../i18n/i18n-util.async';

export const useLoadLocale = (locale: Locales) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    loadLocaleAsync(locale).then(() => setHasLoaded(true));
  }, [locale]);
  return { hasLoaded };
};
