import {
  VFC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
} from 'react';
import 'twin.macro';
import { showRecord } from '../../utils/showRecord';
import { TimeData } from './timeData';

export const TypingTimer: VFC<{
  prevTime?: TimeData;
  onInput: (time: number) => void;
}> = ({ prevTime, onInput }) => {
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
      return 'タイムを入力';
    }
    return showRecord(prevTime);
  }, [prevTime]);

  return (
    <input
      tw="w-full font-bold text-6xl text-center bg-transparent"
      placeholder={placeholder}
      value={value}
      onTouchStart={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') {
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
