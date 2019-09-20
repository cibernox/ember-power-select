import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { scheduleOnce, later } from '@ember/runloop';
import templateLayout from '../../templates/components/power-select/before-options';
import { action } from '@ember/object';

export default @tagName('') @layout(templateLayout) class BeforeOptions extends Component {
  autofocus = true;

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.searchEnabled) {
      scheduleOnce('actions', this, this.select.actions.search, '');
    }
  }

  @action
  handleKeydown(e) {
    if (this.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.select.actions.close(e);
    }
  }

  @action
  focusInput(el) {
    later(() => {
      if (this.autofocus) {
        el.focus();
      }
    }, 0);
  }
}
