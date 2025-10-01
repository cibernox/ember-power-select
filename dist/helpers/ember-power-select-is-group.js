import { helper } from '@ember/component/helper';
import { isGroup } from '../utils/group-utils.js';

function emberPowerSelectIsGroup([maybeGroup]) {
  return isGroup(maybeGroup);
}
var emberPowerSelectIsGroup$1 = helper(emberPowerSelectIsGroup);

export { emberPowerSelectIsGroup$1 as default, emberPowerSelectIsGroup };
//# sourceMappingURL=ember-power-select-is-group.js.map
