import { helper } from '@ember/component/helper';
import { isNone } from '@ember/utils';

function emberPowerSelectIsSelectedPresent([value]) {
  return !isNone(value);
}
var emberPowerSelectIsSelectedPresent$1 = helper(emberPowerSelectIsSelectedPresent);

export { emberPowerSelectIsSelectedPresent$1 as default, emberPowerSelectIsSelectedPresent };
//# sourceMappingURL=ember-power-select-is-selected-present.js.map
