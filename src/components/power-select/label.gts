import Component from '@glimmer/component';
import { action } from '@ember/object';
import { eq, or } from 'ember-truth-helpers';
import element from 'ember-element-helper/helpers/element';
import { on } from '@ember/modifier';
import type { Select } from '../../types.js';

export interface PowerSelectLabelArgs<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  select: Select<T, IsMultiple>;
  labelText?: string;
  labelId: string;
  triggerId: string;
  labelTag?: keyof HTMLElementTagNameMap;
  extra?: TExtra;
}

export interface PowerSelectLabelSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: PowerSelectLabelArgs<T, TExtra, IsMultiple>;
}

export default class PowerSelectLabelComponent<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectLabelSignature<T, TExtra, IsMultiple>> {
  @action
  onLabelClick(e: MouseEvent): void {
    if (!this.args.select) {
      return;
    }

    this.args.select.actions.labelClick(e);
  }

  <template>
    {{#let
      (or @labelTag "div") (element (or @labelTag "div"))
      as |tagName LabelTag|
    }}
      <LabelTag
        id={{@labelId}}
        class="ember-power-select-label"
        ...attributes
        for={{if (eq tagName "label") @triggerId}}
        {{on "click" this.onLabelClick}}
      >
        {{@labelText}}
      </LabelTag>
    {{/let}}
  </template>
}
