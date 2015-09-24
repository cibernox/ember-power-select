import Ember from 'ember';

const { isArray, get } = Ember;

// TODO: Make it private or scoped to the component
export function emberPowerSelectOptionClasses([option, selected, highlighted]/*, hash*/) {
  let classes;
  if (isArray(selected)) {
    classes = selected.indexOf(option) > -1 ? 'selected' : '';
  } else {
    classes = option === selected ? 'selected' : '';
  }
  if (get(option, 'disabled')) { classes += ' disabled'; }
  if (option === highlighted) { classes += ' highlighted'; }
  return classes;
}

export default Ember.Helper.helper(emberPowerSelectOptionClasses);
