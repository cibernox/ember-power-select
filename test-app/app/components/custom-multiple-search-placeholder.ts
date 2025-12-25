import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';

export default class CustomMultipleSearchPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {}
