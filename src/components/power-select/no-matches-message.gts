import Component from '@glimmer/component';
import type { Select } from '../../types.js';

export interface PowerSelectNoMatchesMessageSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLUListElement;
  Args: {
    noMatchesMessage?: string;
    select?: Select<T, IsMultiple>;
    extra?: TExtra;
  };
}

export default class PowerSelectNoMatchesMessage<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<
  PowerSelectNoMatchesMessageSignature<T, TExtra, IsMultiple>
> {
  <template>
    {{#if @noMatchesMessage}}
      <ul class="ember-power-select-options" role="listbox" ...attributes>
        <li
          class="ember-power-select-option ember-power-select-option--no-matches-message"
          role="option"
          aria-selected={{false}}
        >
          {{@noMatchesMessage}}
        </li>
      </ul>
    {{/if}}
  </template>
}
