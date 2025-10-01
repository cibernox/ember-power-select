import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';

export default class CustomPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {}
