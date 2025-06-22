import { helper } from '@ember/component/helper';
import { isArray as isEmberArray } from '@ember/array';
import { isEqual } from '@ember/utils';

export function emberPowerSelectIsEqual(
  [option, selected]: [unknown, unknown] /* , hash*/,
): boolean {
  if (selected === undefined || selected === null) {
    return false;
  }
  if (isEmberArray(selected)) {
    for (let i = 0; i < selected.length; i++) {
      // @ts-expect-error Element implicitly has an 'any' type because expression of type 'number' can't be used to index type 'ArrayLike<unknown> | EmberArray<unknown>'.
      if (isEqual(selected[i], option)) {
        return true;
      }
    }
    return false;
  } else {
    return isEqual(option, selected);
  }
}

export default helper(emberPowerSelectIsEqual);
