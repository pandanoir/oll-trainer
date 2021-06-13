import { storagePrefix } from '../constants';

export const withPrefix = (key: string) => {
  return `${storagePrefix}-${key}`;
};
