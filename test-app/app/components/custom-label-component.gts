import PowerSelectLabelComponent from 'ember-power-select/components/power-select/label';

export default class CustomLabelComponent<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectLabelComponent<T, TExtra, IsMultiple> {<template><label id={{@labelId}} class="ember-power-select-custom-label-component" ...attributes for={{@triggerId}}>
  {{@labelText}}
</label></template>}
