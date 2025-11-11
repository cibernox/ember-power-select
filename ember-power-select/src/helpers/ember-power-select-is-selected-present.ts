import { isNone } from '@ember/utils';

export function emberPowerSelectIsSelectedPresent(value: any): boolean {
  return !isNone(value);
}

export default emberPowerSelectIsSelectedPresent;
