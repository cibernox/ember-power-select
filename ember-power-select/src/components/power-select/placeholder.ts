import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectInputSignature } from './input';
import type { Select } from '../power-select';

export interface PowerSelectPlaceholderSignatureArgs<T = unknown, IsMultiple extends boolean = false> {
    select: Select<T, IsMultiple>;
    isMultipleWithSearch?: boolean;
    placeholder?: string;
    displayPlaceholder?: boolean;
    inputComponent?: ComponentLike<PowerSelectInputSignature<T, IsMultiple>>;
  }

export interface PowerSelectPlaceholderSignature<T = unknown, IsMultiple extends boolean = false> {
  Element: HTMLElement;
  Args: PowerSelectPlaceholderSignatureArgs<T, IsMultiple>;
}

export default class PowerSelectPlaceholder<
  T = unknown,
  IsMultiple extends boolean = false
> extends Component<PowerSelectPlaceholderSignature<T, IsMultiple>> {
}
