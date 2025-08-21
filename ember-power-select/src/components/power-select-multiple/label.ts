import PowerSelectLabelComponent, { type PowerSelectLabelArgs } from '../power-select/label.ts';
import type { Select } from '../power-select';

export interface PowerSelectMultipleLabelArgs<T = unknown, TExtra = unknown> extends Omit<PowerSelectLabelArgs<T, TExtra>, 'select'> {
  select: Select<T>;
}

export interface PowerSelectMultipleLabelSignature<T = unknown, TExtra = unknown> {
  Element: HTMLElement;
  Args: PowerSelectMultipleLabelArgs<T, TExtra>;
}

export default class PowerSelectMultipleLabelComponent<
  T = unknown,
  TExtra = unknown,
> extends PowerSelectLabelComponent<T, TExtra> {
  declare readonly args: PowerSelectMultipleLabelSignature<T, TExtra>['Args'];
}
