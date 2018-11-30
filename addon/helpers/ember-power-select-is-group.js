import { helper } from '@ember/component/helper';
import { isGroup } from '../utils/group-utils';

export function emberPowerSelectIsGroup([maybeGroup]) {
  return isGroup(maybeGroup);
}

export default helper(emberPowerSelectIsGroup);
