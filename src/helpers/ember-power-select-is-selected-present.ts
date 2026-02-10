export default function emberPowerSelectIsSelectedPresent<T>(
  value: T | undefined,
): value is T {
  return value !== null && value !== undefined;
}
