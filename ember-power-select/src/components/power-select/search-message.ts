import Component from '@glimmer/component';
import type { Select } from '../../types';

export interface PowerSelectSearchMessageSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
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
> extends Component<PowerSelectSearchMessageSignature<T, TExtra, IsMultiple>> {}
