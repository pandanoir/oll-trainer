import { zerofill } from './zerofill';

export const showTime = (timeMillisec: number) => {
  const min = Math.floor(timeMillisec / 1000 / 60);
  const sec = Math.floor(timeMillisec / 1000) % 60;
  const millisec = Math.floor(timeMillisec) % 1000;
  if (min > 0) {
    return `${min}:${zerofill(sec, 2)}.${zerofill(millisec, 3)}`;
  }
  return `${sec}.${zerofill(millisec, 3)}`;
};
