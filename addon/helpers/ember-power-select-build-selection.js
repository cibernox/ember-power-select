import Ember from 'ember';

export function emberPowerSelectBuildSelection([option, selected], hash) {
  if (hash.multiple) {
    const newSelection = Ember.A((selected || []).slice(0));
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  } else {
    return option;
  }
}

export default Ember.Helper.helper(emberPowerSelectBuildSelection);
