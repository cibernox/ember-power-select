import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Select } from '../../types.ts';

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
}
