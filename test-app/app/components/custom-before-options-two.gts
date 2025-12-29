import PowerSelectBeforeOptionsComponent from 'ember-power-select/components/power-select/before-options';
import type { SelectedCountryExtra } from 'test-app/utils/constants';
import { on } from "@ember/modifier";

export default class CustomBeforeOptionsTwo<
  T,
> extends PowerSelectBeforeOptionsComponent<T, SelectedCountryExtra> {<template>{{#if @extra.passedAction}}
  <button class="custom-before-options2-button" type="button" {{on "click" @extra.passedAction}}>Do something</button>
{{/if}}</template>}
