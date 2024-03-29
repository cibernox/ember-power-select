import { helper } from '@ember/component/helper';
import { isGroup } from '../utils/group-utils.ts';

export function emberPowerSelectIsGroup([maybeGroup]: [any]): boolean {
  return isGroup(maybeGroup);
}

export default helper(emberPowerSelectIsGroup);
