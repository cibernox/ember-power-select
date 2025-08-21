import { isGroup, type Group } from '../utils/group-utils.ts';

export default function emberPowerSelectIsGroup<T>(maybeGroup: unknown): maybeGroup is Group<T> {
  return isGroup(maybeGroup);
}
