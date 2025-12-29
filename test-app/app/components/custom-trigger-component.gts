import PowerSelectTriggerComponent from 'ember-power-select/components/power-select/trigger';

export default class CustomTrigger<
  T,
  TExtra = undefined,
> extends PowerSelectTriggerComponent<T, TExtra> {<template><div class="custom-trigger-component">{{@loadingMessage}}</div></template>}
