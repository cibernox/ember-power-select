import { helper } from '@ember/component/helper';
import { isGroup } from '../utils/group-utils.ts';

export function emberPowerSelectIsGroup([maybeGroup]: [unknown]): boolean {
  return isGroup(maybeGroup);
}

export default helper(emberPowerSelectIsGroup);
