import { zerofill } from '../../utils/zerofill';

export const showTime = (time: number) => {
  const min = Math.floor(time / 1000 / 60);
  const sec = Math.floor(time / 1000) % 60;
  const millisec = Math.floor(time) % 1000;
  if (min > 0) {
    return `${min}:${zerofill(sec, 2)}.${zerofill(millisec, 3)}`;
  }
  return `${sec}.${zerofill(millisec, 3)}`;
};
