import { action } from '@ember/object';
import Component from '@glimmer/component';
import type { Select } from 'ember-power-select/components/power-select';

export interface CustomTriggerWithSearchSignature {
  Element: Element;
  Args: {
    selected: any;
    select: Select;
    listboxId: string;
    lastSearchedText: string;
  };
  Blocks: {
    default: [selected: any, lastSearchedText: string];
  };
}

export default class CustomGroupComponent extends Component<CustomTriggerWithSearchSignature> {
  @action
  onSearch(evt: Event) {
    this.args.select.actions.search(
      (evt.target as HTMLInputElement).value ?? '',
    );
  }
}
