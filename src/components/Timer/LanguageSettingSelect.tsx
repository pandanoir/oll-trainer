import { VFC, Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import 'twin.macro';

export const LanguageSettingSelect: VFC<{
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
}> = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  return (
    <span tw="flex space-x-2">
      {formatMessage({
        id: 'ViVJ9R',
        description: '設定のラベル。使用言語を設定する',
        defaultMessage: '言語',
      })}
      :
      <select
        tw="bg-transparent"
        value={locale}
        onChange={({ target: { value } }) => setLocale(value)}
      >
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </select>
    </span>
  );
};
