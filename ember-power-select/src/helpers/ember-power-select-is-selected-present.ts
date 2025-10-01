import { isNone } from '@ember/utils';

export default function emberPowerSelectIsSelectedPresent<T>(
  value: T | null | undefined,
): value is T {
  return !isNone(value);
}
