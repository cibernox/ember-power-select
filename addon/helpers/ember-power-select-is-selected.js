import { helper } from '@ember/component/helper';
import { isArray as isEmberArray } from '@ember/array';
import { isEqual } from '@ember/utils';

// TODO: Make it private or scoped to the component
export function emberPowerSelectIsSelected([option, selected]/* , hash*/) {
  if (selected === undefined || selected === null) {
    return false;
  }
  if (isEmberArray(selected)) {
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

export default helper(emberPowerSelectIsSelected);
