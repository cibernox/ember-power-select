import { helper } from 'ember-helper';
import { isEmberArray } from 'ember-array/utils';

// TODO: Make it private or scoped to the component
export function emberPowerSelectIsSelected([option, selected]/*, hash*/) {
  return isEmberArray(selected) ? selected.indexOf(option) > -1 : option === selected;
}

export default helper(emberPowerSelectIsSelected);
