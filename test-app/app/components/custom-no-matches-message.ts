import PowerSelectNoMatchesMessage from 'ember-power-select/components/power-select/no-matches-message';

export default class CustomNoMatchesMessage<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectNoMatchesMessage<T, TExtra, IsMultiple> {}
