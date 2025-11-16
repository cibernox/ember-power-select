import { helper } from '@ember/component/helper';
import { isNone } from '@ember/utils';

function emberPowerSelectIsSelectedPresent([value]) {
  return !isNone(value);
}
var emberPowerSelectIsSelectedPresent_default = helper(emberPowerSelectIsSelectedPresent);

export { emberPowerSelectIsSelectedPresent_default as default, emberPowerSelectIsSelectedPresent };
//# sourceMappingURL=ember-power-select-is-selected-present.js.map
