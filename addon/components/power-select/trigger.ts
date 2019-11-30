import Component from '@glimmer/component';
import { action } from "@ember/object";
import { Select } from '../power-select';
interface Args {
  select: Select
}
export default class Trigger extends Component<Args> {
  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
