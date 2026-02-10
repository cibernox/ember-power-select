// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type PowerSelectComponent from './components/power-select';
import type PowerSelectMultipleInputComponent from './components/power-select/input';
import type emberPowerSelectIsEqual from './helpers/ember-power-select-is-equal';
import type emberPowerSelectIsArray from './helpers/ember-power-select-is-array';
import type emberPowerSelectIsGroup from './helpers/ember-power-select-is-group';
import type emberPowerSelectIsSelectedPresent from './helpers/ember-power-select-is-selected-present';

export default interface Registry {
  PowerSelect: typeof PowerSelectComponent;
  'ember-power-select-is-group': typeof emberPowerSelectIsGroup;
  'ember-power-select-is-equal': typeof emberPowerSelectIsEqual;
  'ember-power-select-is-array': typeof emberPowerSelectIsArray;
  'ember-power-select-is-selected-present': typeof emberPowerSelectIsSelectedPresent;
  'PowerSelect::Input': typeof PowerSelectMultipleInputComponent;
}
