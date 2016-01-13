import Ember from 'ember';

export function emberPowerSelectBuildSelection([option, selected], hash) {
  if (hash.multiple) {
    const newSelection = (selected || []).slice(0);
    let idx = newSelection.indexOf(option);
    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(option);
    }
    return newSelection;
  } else {
    return option;
  }
}

export default Ember.Helper.helper(emberPowerSelectBuildSelection);
