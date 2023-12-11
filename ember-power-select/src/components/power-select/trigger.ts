import Component from '@glimmer/component';
import { action } from "@ember/object";
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';

interface Args {
  select: Select;
  allowClear: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra: any;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeholderComponent?: string | ComponentLike<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItemComponent?: string | ComponentLike<any>;
  Blocks: {
    default: [selected: any, select: Select];
  };
}

export default class TriggerComponent extends Component<Args> {
  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
