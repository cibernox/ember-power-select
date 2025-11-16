import PowerSelectLabelComponent from 'ember-power-select/components/power-select/label';

export default class CustomLabelComponent<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectLabelComponent<T, TExtra, IsMultiple> {}
