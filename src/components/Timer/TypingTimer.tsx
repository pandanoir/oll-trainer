import {
  VFC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
} from 'react';
import { showTime } from './showTime';
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
    const { isDNF, penalty, time } = prevTime;
    if (isDNF) {
      return 'DNF';
    }
    return `${showTime(time)}${penalty ? ' + 2' : ''}`;
  }, [prevTime]);

  return (
    <input
      className="w-full font-bold text-6xl text-center"
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') {
          return;
        }
        if (isNaN(parseInt(value, 10))) {
          return;
        }

        onInput(parseInt(value, 10) / 100);
      }}
    />
  );
};
