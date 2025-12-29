import PowerSelectOptionsComponent from 'ember-power-select/components/power-select/options';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';
import { get } from "@ember/helper";

export default class ListOfCountries<
  IsMultiple extends boolean = false,
> extends PowerSelectOptionsComponent<
  Country,
  SelectedCountryExtra,
  IsMultiple
> {<template><div class="ember-power-select-options">
  <p>
    Countries:
  </p>
  <ul>
    {{#if @extra.field}}
      {{#each @options as |option index|}}
        <li>
          {{index}}.
          {{get option @extra.field}}
        </li>
      {{/each}}
    {{else}}
      {{#each @options as |option index|}}
        <li>
          {{index}}.
          {{option.name}}
        </li>
      {{/each}}
    {{/if}}
  </ul>
</div></template>}
