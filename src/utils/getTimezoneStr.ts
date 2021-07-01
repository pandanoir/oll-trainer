import { zerofill } from './zerofill';

export const getTimezoneStr = (timezoneOffset: number) =>
  `${timezoneOffset > 0 ? '-' : '+'}${zerofill(
    Math.abs(Math.floor(timezoneOffset / 60)),
    2
  )}${zerofill(Math.floor(timezoneOffset % 60), 2)}`;
