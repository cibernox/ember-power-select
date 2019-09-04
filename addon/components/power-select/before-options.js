import Component from '@glimmer/component';
import { scheduleOnce, later } from '@ember/runloop';
import { action } from '@ember/object';

export default class BeforeOptions extends Component {
  @action
  clearSearch() {
    scheduleOnce('actions', this.args.select.actions.search, '');
  }

  @action
  handleKeydown(e) {
    if (this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }

  @action
  focusInput(el) {
    later(() => {
      if (this.args.autofocus !== false) {
        el.focus();
      }
    }, 0);
  }
}
