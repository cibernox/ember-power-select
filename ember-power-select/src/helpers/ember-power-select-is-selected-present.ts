import { isNone } from '@ember/utils';

export default function emberPowerSelectIsSelectedPresent(value: unknown): boolean {
  return !isNone(value);
}
