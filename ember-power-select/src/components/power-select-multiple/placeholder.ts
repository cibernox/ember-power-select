import PowerSelectPlaceholder from '../power-select/placeholder.ts';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectMultipleInputSignature } from './input';
import type { Select } from '../power-select-multiple';

export interface PowerSelectMultiplePlaceholderSignatureArgs<T = unknown> {
  select: Select<T>;
  isMultipleWithSearch?: boolean;
  placeholder?: string;
  displayPlaceholder?: boolean;
  inputComponent?: ComponentLike<PowerSelectMultipleInputSignature<T>>;
}

export interface PowerSelectMultiplePlaceholderSignature<T = unknown> {
  Element: HTMLElement;
  Args: PowerSelectMultiplePlaceholderSignatureArgs<T>;
}

export default class PowerSelectMultiplePlaceholder<
  T = unknown
> extends PowerSelectPlaceholder<T> {
}
