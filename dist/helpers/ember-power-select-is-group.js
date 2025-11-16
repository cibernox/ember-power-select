import { helper } from '@ember/component/helper';
import { isGroup } from '../utils/group-utils.js';

function emberPowerSelectIsGroup([maybeGroup]) {
  return isGroup(maybeGroup);
}
var emberPowerSelectIsGroup_default = helper(emberPowerSelectIsGroup);

export { emberPowerSelectIsGroup_default as default, emberPowerSelectIsGroup };
//# sourceMappingURL=ember-power-select-is-group.js.map
