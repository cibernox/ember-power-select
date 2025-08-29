import PowerSelectTriggerComponent from 'ember-power-select/components/power-select/trigger';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';

export default class SelectedCountry<T extends boolean = false> extends PowerSelectTriggerComponent<Country, SelectedCountryExtra, T> {};
