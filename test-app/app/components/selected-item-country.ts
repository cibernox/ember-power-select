import Component from '@glimmer/component';
import type { PowerSelectSelectedItemSignature } from 'ember-power-select/components/power-select';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';

type SelectedItemCountrySignature<IsMultiple extends boolean = false> =
  PowerSelectSelectedItemSignature<Country, SelectedCountryExtra, IsMultiple>;

export default class SelectedItemCountry<
  IsMultiple extends boolean = false,
> extends Component<SelectedItemCountrySignature<IsMultiple>> {}
