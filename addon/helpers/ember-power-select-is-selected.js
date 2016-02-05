import Ember from 'ember';

const { isArray } = Ember;

export function emberPowerSelectIsSelected([option, selected]) {
  if (isArray(selected)) {
    return selected.indexOf(option) > -1;
  } else {
    return option === selected;
  }
}

export default Ember.Helper.helper(emberPowerSelectIsSelected);
