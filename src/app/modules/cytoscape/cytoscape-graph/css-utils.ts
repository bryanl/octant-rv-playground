import { camelCaseToDash } from './string-utils';

export const style = (o: { [key: string]: any }) =>
  Object.entries(o)
    .map<string>(([k, v]) => `${camelCaseToDash(k)}:${v};`)
    .join(' ');
