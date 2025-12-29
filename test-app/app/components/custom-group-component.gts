import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';

export interface CustomGroupSignature<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Omit<
  PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>,
  'Args'
> {
  Args: PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>['Args'] & {
    onInit?: () => void;
  };
}

export default class CustomGroupComponent<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<CustomGroupSignature<T, TExtra, IsMultiple>> {<template><div class="custom-component" {{this.setup}}>{{yield}}</div></template>
  didSetup = false;

  setup = modifier(() => {
    if (this.didSetup) {
      return;
    }

    this.didSetup = true;
    if (this.args.onInit) {
      this.args.onInit?.bind(this)();
    }
  });
}
