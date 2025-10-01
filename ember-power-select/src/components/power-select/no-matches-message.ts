import Component from '@glimmer/component';
import type { Select } from '../../types';

export interface PowerSelectNoMatchesMessageSignature<
  T = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    noMatchesMessage?: string;
    select?: Select<T, IsMultiple>;
  };
}

export default class PowerSelectNoMatchesMessage<
  T = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectNoMatchesMessageSignature<T, IsMultiple>> {}
