import { action } from '@ember/object';
import Component from '@glimmer/component';

export interface CustomTriggerWithSearchSignature {
  Element: Element;
  Args: {
    selected: any;
    select: any;
    listboxId: string;
    lastSearchedText: string;
  };
  Blocks: {
    default: [selected: any, lastSearchedText: string];
  };
}

export default class CustomGroupComponent extends Component<CustomTriggerWithSearchSignature> {
  didSetup = false;

  @action
  onSearch(evt: Event) {
    this.args.select.actions.search((evt.target as HTMLInputElement).value ?? '');
  }
}
