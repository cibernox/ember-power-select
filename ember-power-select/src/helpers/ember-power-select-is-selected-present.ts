import { helper } from '@ember/component/helper';
import { isNone } from '@ember/utils';

export function emberPowerSelectIsSelectedPresent([value]: [unknown]): boolean {
  return !isNone(value);
}

export default helper(emberPowerSelectIsSelectedPresent);
