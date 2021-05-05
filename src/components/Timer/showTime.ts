import { zerofill } from '../../utils/zerofill';

export const showTime = (time: number) => {
  const sec = Math.floor(time / 1000);
  const millisec = Math.floor(time) % 1000;
  return `${sec}.${zerofill(millisec, 3)}`;
};
