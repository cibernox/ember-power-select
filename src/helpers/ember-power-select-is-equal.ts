import isEqual from '../utils/equal.ts';

export default function emberPowerSelectIsEqual(
  option: unknown,
  selected: unknown,
): boolean {
  if (selected === undefined || selected === null) {
    return false;
  }
  if (Array.isArray(selected)) {
    for (let i = 0; i < selected.length; i++) {
      if (isEqual(selected[i], option)) {
        return true;
      }
    }
    return false;
  } else {
    return isEqual(option, selected);
  }
}
