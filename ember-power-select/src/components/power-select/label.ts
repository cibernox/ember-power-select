import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Select } from '../power-select';

interface PowerSelectLabelSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    labelText?: string;
    labelId: string;
    triggerId: string;
    extra: any;
  };
}

export default class PowerSelectLabelComponent extends Component<PowerSelectLabelSignature> {
  @action
  onLabelClick(e: MouseEvent): void {
    if (!this.args.select) {
      return;
    }

    this.args.select.actions.labelClick(e);
  }
}
