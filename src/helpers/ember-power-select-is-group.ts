import { isGroup } from '../utils/group-utils.ts';
import type { GroupBase } from '../types.ts';

export default function emberPowerSelectIsGroup<T>(
  maybeGroup: unknown,
): maybeGroup is GroupBase<T> {
  return isGroup(maybeGroup);
}
