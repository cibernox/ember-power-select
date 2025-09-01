import Component from '@glimmer/component';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';
import type { GroupedNumbersWithCustomProperty } from 'test-app/utils/constants';

export interface CustomGroupComponentWithVariantSignature<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Omit<
    PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>,
    'Args'
  > {
  Args: PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>['Args'];
}

export default class CustomGroupComponentWithVariant<
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<CustomGroupComponentWithVariantSignature<GroupedNumbersWithCustomProperty, TExtra, IsMultiple>> {
}
