import Component from '@glimmer/component';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';
import type { GroupedNumbersWithCustomProperty } from 'test-app/utils/constants';

export default class CustomGroupComponentWithVariant<
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<
  PowerSelectPowerSelectGroupSignature<
    GroupedNumbersWithCustomProperty,
    TExtra,
    IsMultiple
  >
> {}
