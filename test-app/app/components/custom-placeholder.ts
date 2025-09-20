import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';

export default class CustomPlaceholder<
  T,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, IsMultiple> {}
