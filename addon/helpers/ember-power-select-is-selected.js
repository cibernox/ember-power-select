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
    return !!selected.find((e) => isEqual(e, option));
  } else {
    return isEqual(option, selected);
  }
}

export default helper(emberPowerSelectIsSelected);
