import Ember from 'ember';

export function emberPowerSelectEq([v1, v2]) {
  return v1 === v2;
}

export default Ember.Helper.helper(emberPowerSelectEq);
