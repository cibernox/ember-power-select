import { helper } from '@ember/component/helper';
import { isNone } from '@ember/utils';

export function emberPowerSelectIsSelectedPresent([value]: [any]): boolean {
  return !isNone(value);
}

export default helper(emberPowerSelectIsSelectedPresent);
