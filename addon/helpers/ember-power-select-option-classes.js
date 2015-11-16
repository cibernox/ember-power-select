import Ember from 'ember';

const { isArray, get } = Ember;

// TODO: Make it private or scoped to the component
export function emberPowerSelectOptionClasses([option, selected, highlighted]/*, hash*/) {
  let classes;
  if (isArray(selected)) {
    classes = selected.indexOf(option) > -1 ? 'ember-power-select-option--selected' : '';
  } else {
    classes = option === selected ? 'ember-power-select-option--selected' : '';
  }
  if (get(option, 'disabled')) { classes += ' ember-power-select-option--disabled'; }
  if (option === highlighted) { classes += ' ember-power-select-option--highlighted'; }
  return classes;
}

export default Ember.Helper.helper(emberPowerSelectOptionClasses);
