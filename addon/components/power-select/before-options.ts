import Component from '@glimmer/component';
import { scheduleOnce, later } from '@ember/runloop';
import { action } from '@ember/object';
import { Select } from '../power-select';

interface Args {
  select: Select,
  onKeydown: (e: Event) => false | void
  autofocus?: boolean
}

export default class BeforeOptions extends Component<Args> {
  @action
  clearSearch(): void {
    scheduleOnce('actions', this.args.select.actions, 'search', '');
  }

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }

  @action
  focusInput(el: HTMLElement) {
    later(() => {
      if (this.args.autofocus !== false) {
        el.focus();
      }
    }, 0);
  }
}
