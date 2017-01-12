import Ember from 'ember';
import { helper } from 'ember-helper';
import { isEmberArray } from 'ember-array/utils';

const { isEqual } = Ember;

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
