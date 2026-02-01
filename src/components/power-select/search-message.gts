import Component from '@glimmer/component';
import type { Select } from '../../types.ts';

export interface PowerSelectSearchMessageSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLUListElement;
  Args: {
    searchMessage: string;
    select?: Select<T, IsMultiple>;
    extra?: TExtra;
  };
}

export default class PowerSelectSearchMessage<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectSearchMessageSignature<T, TExtra, IsMultiple>> {
  <template>
    <ul class="ember-power-select-options" role="listbox" ...attributes>
      <li
        class="ember-power-select-option ember-power-select-option--search-message"
        role="option"
        aria-selected={{false}}
      >
        {{@searchMessage}}
      </li>
    </ul>
  </template>
}
