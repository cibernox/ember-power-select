import Component from 'ember-component';
import { scheduleOnce } from 'ember-runloop';
import layout from '../../templates/components/power-select/before-options';

export default Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.focusInput();
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.getAttr('searchEnabled')) {
      this.getAttr('select').actions.search('');
    }
  },

  // Methods
  focusInput() {
    this.input = self.document.querySelector('.ember-power-select-search-input');
    if (this.input) {
      scheduleOnce('afterRender', this.input, 'focus');
    }
  }
});
