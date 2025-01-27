import { helper } from '@ember/component/helper';
import { isArray } from '@ember/array';
import { isEqual } from '@ember/utils';

function emberPowerSelectIsEqual([option, selected]) {
  if (selected === undefined || selected === null) {
    return false;
  }
  if (isArray(selected)) {
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
var emberPowerSelectIsEqual$1 = helper(emberPowerSelectIsEqual);

export { emberPowerSelectIsEqual$1 as default, emberPowerSelectIsEqual };
//# sourceMappingURL=ember-power-select-is-equal.js.map
