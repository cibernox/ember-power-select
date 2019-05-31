import Component from '@ember/component';
import { scheduleOnce, later } from '@ember/runloop';
import layout from '../../templates/components/power-select/before-options';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  layout,
  autofocus: true,

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('searchEnabled')) {
      scheduleOnce('actions', this, this.get('select').actions.search, '');
    }
  },

  // Actions
  actions: {
    onKeydown(e) {
      let onKeydown = this.get('onKeydown');
      if (onKeydown(e) === false) {
        return false;
      }
      if (e.keyCode === 13) {
        let select = this.get('select');
        select.actions.close(e);
      }
    }
  },

  // Methods
  @action
  focusInput(el) {
    if (this.autofocus) {
      el.focus();
    }
  }
});
