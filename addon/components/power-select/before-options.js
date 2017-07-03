import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import layout from '../../templates/components/power-select/before-options';

export default Component.extend({
  tagName: '',
  layout,
  autofocus: true,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);

    if (this.get('autofocus')) {
      this.focusInput();
    }
  },

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
  focusInput() {
    this.input = self.document.querySelector(`.ember-power-select-search-input[aria-controls="${this.get('listboxId')}"]`);
    if (this.input) {
      scheduleOnce('afterRender', this.input, 'focus');
    }
  }
});
