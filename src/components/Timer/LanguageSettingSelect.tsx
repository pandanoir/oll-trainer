import { VFC } from 'react';
import 'twin.macro';
import { useI18nContext } from '../../i18n/i18n-react';
import { Locales } from '../../i18n/i18n-types';
import { loadLocaleAsync } from '../../i18n/i18n-util.async';

export const LanguageSettingSelect: VFC = () => {
  const { LL, locale, setLocale } = useI18nContext();
  const valueLabelTuples: [Locales, string][] = [
    ['ja', '日本語'],
    ['en', 'English'],
  ];
  return (
    <span tw="flex space-x-2">
      {LL['Language']()}:
      <select
        tw="bg-transparent"
        value={locale}
        onChange={async ({ target: { value } }) => {
          localStorage.setItem('lang', value);
          await loadLocaleAsync(value as Locales);
          setLocale(value as Locales);
        }}
      >
        {valueLabelTuples.map(([value, label]) => (
          <option tw="text-black" value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </span>
  );
};
