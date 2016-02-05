import Ember from 'ember';

const { isArray } = Ember;

// TODO: Make it private or scoped to the component
export function emberPowerSelectIsSelected([option, selected]/*, hash*/) {
  return isArray(selected) ? selected.indexOf(option) > -1 : option === selected;
}

export default Ember.Helper.helper(emberPowerSelectIsSelected);
