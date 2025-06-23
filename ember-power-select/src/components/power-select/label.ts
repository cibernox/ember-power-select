import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Select } from '../power-select';

export interface PowerSelectLabelSignature<T = unknown, TExtra = unknown> {
  Element: HTMLElement;
  Args: {
    select: Select<T>;
    labelText?: string;
    labelId: string;
    triggerId: string;
    extra: TExtra;
  };
}

export default class PowerSelectLabelComponent<
  T = unknown,
  TExtra = unknown,
> extends Component<PowerSelectLabelSignature<T, TExtra>> {
  @action
  onLabelClick(e: MouseEvent): void {
    if (!this.args.select) {
      return;
    }

    this.args.select.actions.labelClick(e);
  }
}
