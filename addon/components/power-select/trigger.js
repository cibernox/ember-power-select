import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class Trigger extends Component {
  @action
  clear(e) {
    e.stopPropagation();
    this.args.select.actions.select(null, this.args.select);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
