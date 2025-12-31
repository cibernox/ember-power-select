import { isArray as isEmberArray } from '@ember/array';

export default function emberPowerSelectIsArray<T>(
  maybeArray: T | T[] | undefined,
): maybeArray is T[] {
  return isEmberArray(maybeArray);
}
