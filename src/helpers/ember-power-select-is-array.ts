export default function emberPowerSelectIsArray<T>(
  maybeArray: T | T[] | undefined,
): maybeArray is T[] {
  return Array.isArray(maybeArray);
}
