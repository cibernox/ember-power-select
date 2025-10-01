import Component from '@glimmer/component';
import type { Select } from '../../types';

export interface PowerSelectSearchMessageSignature<
  T = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    searchMessage: string;
    select?: Select<T, IsMultiple>;
  };
}

export default class PowerSelectSearchMessage<
  T = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectSearchMessageSignature<T, IsMultiple>> {}
