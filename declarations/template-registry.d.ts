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
//# sourceMappingURL=template-registry.d.ts.map