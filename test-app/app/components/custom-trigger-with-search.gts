import { action } from '@ember/object';
import Component from '@glimmer/component';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';
import type { GroupedNumber } from 'test-app/utils/constants';
import { on } from "@ember/modifier";

export default class CustomTriggerWithSearch extends Component<
  PowerSelectTriggerSignature<GroupedNumber>
> {<template><input type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck={{false}} aria-controls={{@listboxId}} {{on "input" this.onSearch}} /></template>
  @action
  onSearch(evt: Event) {
    this.args.select.actions.search(
      (evt.target as HTMLInputElement).value ?? '',
    );
  }
}
