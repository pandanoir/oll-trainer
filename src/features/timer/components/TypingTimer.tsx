import {
  VFC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import 'twin.macro';
import { noop } from '../../../utils/noop';
import { showRecord } from '../../../utils/showRecord';
import { withStopPropagation } from '../../../utils/withStopPropagation';
import { TimeData } from '../data/timeData';

export const TypingTimer: VFC<{
  prevTime?: TimeData;
  className?: string;
  onInput: (time: number) => void;
}> = ({ prevTime, className = '', onInput }) => {
  const { formatMessage } = useIntl();
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue('');
  }, [prevTime]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.currentTarget.value),
    []
  );

  const placeholder = useMemo(() => {
    if (!prevTime) {
      return formatMessage({
        id: 'xgQ7Qv',
        description:
          '入力フォーム。タイムを手動で入力するフォームのプレースホルダー',
        defaultMessage: 'タイムを入力',
      });
    }
    return showRecord(prevTime);
  }, [formatMessage, prevTime]);

  return (
    <input
      tw="w-full font-bold font-mono text-6xl lg:text-8xl text-center bg-transparent"
      className={className}
      placeholder={placeholder}
      value={value}
      onTouchStart={withStopPropagation(noop)}
      onMouseDown={withStopPropagation(noop)}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') {
          return;
        }
        if (value.includes('.')) {
          const input = parseFloat(value);
          if (isNaN(input)) {
            return;
          }
          onInput(input);
          return;
        }

        const input = parseInt(value, 10);
        if (isNaN(input)) {
          return;
        }

        const centisec = input % 100;
        const sec = (Math.floor(input / 100) % 100) % 60;
        const min =
          Math.floor(input / 100 / 100) +
          Math.floor(((input / 100) % 100) / 60);
        onInput(min * 60 + sec + centisec / 100);
      }}
    />
  );
};
