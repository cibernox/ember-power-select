import PowerSelectOptionsComponent from 'ember-power-select/components/power-select/options';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';

export default class ListOfCountries<IsMultiple extends boolean = false> extends PowerSelectOptionsComponent<Country, SelectedCountryExtra, IsMultiple> {};
